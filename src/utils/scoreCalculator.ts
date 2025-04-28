// utils/scoreCalculator.ts
export function scoreCalculator(
    grid: (number | string)[][], 
    cheminoGrid: (number | string)[][], 
    rowPos: number, 
    colPos: number
  ): number {
    let score = 0;

    // Checar os vizinhos da peça que está caindo
    for (let row = Math.max(rowPos - 1, 0); row <= Math.min(rowPos + 1, 24); row++) {
      for (let col = Math.max(colPos - 1, 0); col <= Math.min(colPos + 1, 20); col++) {
          console.log(cheminoGrid[row][col], grid[row][col])
        if (typeof cheminoGrid[row][col] === 'string' && grid[row][col] === 0) {
          score += 10; // Aumentar o score por vizinhança
        }
      }
    }
  
    return score;
  }
  