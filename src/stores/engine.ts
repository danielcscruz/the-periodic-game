import { defineStore } from 'pinia'
import { randomChemino, formulaAtoms, type CheminoItem } from '@/components/elements/cheminos'
import { atomicNumberOf } from '@/components/elements/periodic'
import {
  BASE_GRAVITY_MS,
  COLLAPSE_MS,
  COLS,
  GRAVITY_STEP_MS,
  MIN_GRAVITY_MS,
  REACTION_FLASH_MS,
  REACTIONS_PER_LEVEL,
  ROULETTE_MS,
  SOFT_DROP_MS,
} from '@/game/config'
import { applyGravity, blockPositions, createBoard, fits } from '@/game/board'
import { blocksFromChemino, KICKS, rotateBlocks } from '@/game/pieces'
import { expandEffect, findReactions } from '@/game/reactionEngine'
import { effectMultiplier, reactions } from '@/game/reactions'
import type { ActivePiece, Board, Pos, ReactionEffect } from '@/game/types'

export type Phase = 'welcome' | 'playing' | 'reacting' | 'over'

export interface Burst {
  id: number
  r: number
  c: number
  el: string
}

export interface ReactionToast {
  id: number
  name: string
  equation: string
  points: number
  chain: number
  effect: ReactionEffect
  r: number
  c: number
}

/* Estado não reativo do loop (não precisa disparar renderização). */
let uid = 1
const nextId = () => uid++
let rafId = 0
let lastTime = 0
let gravityAcc = 0
let rouletteAcc = 0
let softDropping = false
let gameToken = 0

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function readBest(): number {
  try {
    return Number(localStorage.getItem('periodic-best') || 0)
  } catch {
    return 0
  }
}

export const useGameEngine = defineStore('engine', {
  state: () => ({
    phase: 'welcome' as Phase,
    paused: false,
    board: createBoard() as Board,
    active: null as ActivePiece | null,
    next: randomChemino() as CheminoItem,
    nextLocked: false,
    score: 0,
    best: readBest(),
    level: 1,
    reactionCount: 0,
    pieceCount: 0,
    chain: 0,
    /** Átomos em animação de reação: 'reagent' participou, 'caught' foi atingido pelo efeito. */
    flashing: {} as Record<number, 'reagent' | 'caught'>,
    bursts: [] as Burst[],
    toasts: [] as ReactionToast[],
    shake: null as ReactionEffect | null,
  }),

  getters: {
    gravityMs: (s) => Math.max(MIN_GRAVITY_MS, BASE_GRAVITY_MS - (s.level - 1) * GRAVITY_STEP_MS),
    canControl: (s) => s.phase === 'playing' && !s.paused && s.active !== null,
    /** Linha onde a peça cairia com um drop instantâneo (para a "sombra"). */
    ghostRow(s): number | null {
      if (!s.active) return null
      let r = s.active.r
      while (fits(s.board, { ...s.active, r: r + 1 })) r++
      return r
    },
  },

  actions: {
    /* ---------- ciclo de vida ---------- */
    startNewGame() {
      gameToken++
      this.board = createBoard()
      this.active = null
      this.next = randomChemino()
      this.nextLocked = false
      this.score = 0
      this.level = 1
      this.reactionCount = 0
      this.pieceCount = 0
      this.chain = 0
      this.flashing = {}
      this.bursts = []
      this.toasts = []
      this.shake = null
      this.paused = false
      this.phase = 'playing'
      this.spawn()
      this.startLoop()
    },

    showWelcome() {
      gameToken++
      this.stopLoop()
      this.phase = 'welcome'
      this.paused = false
    },

    togglePause(force?: boolean) {
      if (this.phase !== 'playing' && this.phase !== 'reacting') return
      this.paused = force ?? !this.paused
      lastTime = performance.now()
    },

    startLoop() {
      cancelAnimationFrame(rafId)
      lastTime = performance.now()
      gravityAcc = 0
      rouletteAcc = 0
      const frame = (t: number) => {
        const dt = Math.min(t - lastTime, 100)
        lastTime = t
        if (this.phase === 'playing' && !this.paused) {
          // Roleta da próxima peça: troca até o jogador travar.
          rouletteAcc += dt
          if (rouletteAcc >= ROULETTE_MS) {
            rouletteAcc = 0
            if (!this.nextLocked) this.next = randomChemino()
          }
          gravityAcc += dt
          const interval = softDropping ? SOFT_DROP_MS : this.gravityMs
          while (gravityAcc >= interval && this.phase === 'playing') {
            gravityAcc -= interval
            this.step()
          }
        }
        rafId = requestAnimationFrame(frame)
      }
      rafId = requestAnimationFrame(frame)
    },

    stopLoop() {
      cancelAnimationFrame(rafId)
    },

    /* ---------- peça ativa ---------- */
    spawn() {
      const item = this.next
      const blocks = blocksFromChemino(item, nextId)
      const top = Math.min(...blocks.map((b) => b.dr))
      const piece: ActivePiece = {
        formula: item.formula,
        pieceId: nextId(),
        r: -top,
        c: Math.floor(COLS / 2),
        blocks,
      }
      this.nextLocked = false
      this.next = randomChemino()
      if (!fits(this.board, piece)) {
        this.active = null
        this.gameOver()
        return
      }
      this.active = piece
      gravityAcc = 0
    },

    step() {
      if (!this.active) return
      if (fits(this.board, { ...this.active, r: this.active.r + 1 })) {
        this.active.r++
        if (softDropping) this.score += 1
      } else {
        this.lock()
      }
    },

    move(dc: -1 | 1) {
      if (!this.canControl || !this.active) return
      if (fits(this.board, { ...this.active, c: this.active.c + dc })) this.active.c += dc
    },

    rotate() {
      if (!this.canControl || !this.active) return
      const rotated = rotateBlocks(this.active.blocks)
      for (const [kr, kc] of KICKS) {
        const candidate = { ...this.active, r: this.active.r + kr, c: this.active.c + kc, blocks: rotated }
        if (fits(this.board, candidate)) {
          this.active.r = candidate.r
          this.active.c = candidate.c
          this.active.blocks = rotated
          return
        }
      }
    },

    setSoftDrop(on: boolean) {
      softDropping = on && this.canControl
      if (on) gravityAcc = SOFT_DROP_MS
    },

    hardDrop() {
      if (!this.canControl || !this.active || this.ghostRow === null) return
      this.score += (this.ghostRow - this.active.r) * 2
      this.active.r = this.ghostRow
      this.lock()
    },

    toggleNextLock() {
      if (this.phase !== 'playing' || this.paused) return
      this.nextLocked = !this.nextLocked
    },

    /* ---------- assentar e reagir ---------- */
    lock() {
      const piece = this.active
      if (!piece) return
      const seeds = blockPositions(piece)
      piece.blocks.forEach((b, i) => {
        const { r, c } = seeds[i]
        this.board[r][c] = { id: b.id, el: b.el, piece: piece.pieceId }
      })
      this.active = null
      this.pieceCount++
      this.score += formulaAtoms(piece.formula).length
      softDropping = false
      void this.resolveReactions(seeds)
    },

    async resolveReactions(initialSeeds: Pos[]) {
      const token = gameToken
      const reduced = prefersReducedMotion()
      const flashMs = reduced ? 240 : REACTION_FLASH_MS
      const collapseMs = reduced ? 60 : COLLAPSE_MS
      let seeds = initialSeeds
      let chain = 0

      while (true) {
        const matches = findReactions(this.board, seeds, reactions)
        if (!matches.length) break
        chain++
        this.phase = 'reacting'
        this.chain = chain

        const flashing: Record<number, 'reagent' | 'caught'> = {}
        const doomed = new Map<number, Pos>()
        let strongest: ReactionEffect = 'self'

        for (const match of matches) {
          const area = expandEffect(this.board, match)
          area.forEach((p) => {
            const cell = this.board[p.r][p.c]!
            doomed.set(cell.id, p)
            flashing[cell.id] ??= 'caught'
          })
          match.cells.forEach((p) => (flashing[this.board[p.r][p.c]!.id] = 'reagent'))

          const base = match.cells.reduce((s, p) => s + atomicNumberOf(this.board[p.r][p.c]!.el), 0)
          const extra = area.length - match.cells.length
          const points = Math.round(base * effectMultiplier[match.reaction.effect] * chain) + extra * 3
          this.score += points
          this.reactionCount++

          const center = match.cells.reduce((a, p) => ({ r: a.r + p.r, c: a.c + p.c }), { r: 0, c: 0 })
          this.toasts.push({
            id: nextId(),
            name: match.reaction.name,
            equation: match.reaction.equation,
            points,
            chain,
            effect: match.reaction.effect,
            r: center.r / match.cells.length,
            c: center.c / match.cells.length,
          })
          const rank = { self: 0, blast: 1, rows: 2, all: 3 }
          if (rank[match.reaction.effect] > rank[strongest]) strongest = match.reaction.effect
        }

        this.flashing = flashing
        this.shake = strongest === 'self' ? null : strongest
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate(strongest === 'all' ? [30, 40, 60] : 12)
        }
        this.scheduleToastCleanup()

        await sleep(flashMs)
        if (token !== gameToken) return
        await this.waitWhilePaused(token)

        // Remove os átomos e dispara as partículas.
        const bursts: Burst[] = []
        doomed.forEach((p) => {
          const cell = this.board[p.r][p.c]
          if (cell) bursts.push({ id: nextId(), r: p.r, c: p.c, el: cell.el })
          this.board[p.r][p.c] = null
        })
        this.flashing = {}
        this.shake = null
        if (!reduced) this.addBursts(bursts)

        await sleep(collapseMs / 2)
        if (token !== gameToken) return
        seeds = applyGravity(this.board)
        await sleep(collapseMs)
        if (token !== gameToken) return
        await this.waitWhilePaused(token)
      }

      this.chain = 0
      this.level = 1 + Math.floor(this.reactionCount / REACTIONS_PER_LEVEL)
      if (token !== gameToken || this.phase === 'over') return
      this.phase = 'playing'
      this.spawn()
    },

    async waitWhilePaused(token: number) {
      while (this.paused && token === gameToken) await sleep(100)
    },

    addBursts(bursts: Burst[]) {
      this.bursts.push(...bursts)
      const ids = new Set(bursts.map((b) => b.id))
      setTimeout(() => {
        this.bursts = this.bursts.filter((b) => !ids.has(b.id))
      }, 750)
    },

    scheduleToastCleanup() {
      const ids = new Set(this.toasts.map((t) => t.id))
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => !ids.has(t.id))
      }, 1700)
    },

    gameOver() {
      this.phase = 'over'
      softDropping = false
      if (this.score > this.best) {
        this.best = this.score
        try {
          localStorage.setItem('periodic-best', String(this.best))
        } catch {
          /* armazenamento indisponível: o recorde vale só nesta sessão */
        }
      }
    },
  },
})
