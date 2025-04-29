export function checkNeighbors(
  grid: (string | number)[][],
  cheminoGrid: (string | number)[][],
  rowPos: number,
  colPos: number
) {
  const result: {
    element: string;
    x: number;
    y: number;
    neighbors: { x: number; y: number; value: string }[];
  }[] = [];

  const cheminoOccupiedCells: { x: number; y: number; element: string }[] = [];
  const row = rowPos + 1
  const col = colPos + 10


  console.log(rowPos, colPos)
  // 🟡 Primeiro loop: encontrar todas as células ativas do chemino
  for (let y = row -2; y < row + 2; y++) {
    for (let x = col -2; x < col +2; x++) {
      const cell = cheminoGrid[y][x];
      if (cell !== 0 && cell !== 1) {
        cheminoOccupiedCells.push({
          x: x, // posição real no grid principal
          y: y, // posição real no grid principal
          element: cell as string,
        });
      }
    }
  }
  console.log(cheminoOccupiedCells)

  // 🟢 Segundo loop: para cada célula ativa, buscar vizinhos
  for (const cell of cheminoOccupiedCells) {
    const { x, y, element } = cell;

    const neighbors: { x: number; y: number; value: string }[] = [];

    const directions = [
      [0, -1], // esquerda
      [0, 1],  // direita
      [-1, 0], // cima
      [1, 0],  // baixo
    ];

    // Itera pelas direções possíveis
    for (const [dy, dx] of directions) {
      const ny = y + dy;
      const nx = x + dx;

      // Verifica se o vizinho está dentro dos limites do grid principal
      if (
        ny >= 0 && ny < grid.length &&
        nx >= 0 && nx < grid[0].length && grid[ny][nx] !==0 && grid[ny][nx] !== 1
      ) {
        const isCheminoCell = cheminoOccupiedCells.some(c => c.x === nx && c.y === ny)
        if (!isCheminoCell) {

        const neighborValue = grid[ny][nx] as string;  // Valor do vizinho no grid principal
        neighbors.push({
          x: nx,  // Posição do vizinho no grid
          y: ny,
          value: neighborValue,  // Valor do vizinho
        });
      }
    }}
    result.push({
      element,
      x,
      y,
      neighbors,
    });
  }

  

  return result;
}
