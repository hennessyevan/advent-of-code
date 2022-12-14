import { importInput } from './utils/importInput'

type AlphabetCharacter =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z'

type StartPoint = 'S'
type EndPoint = 'E'

type GridLetter = AlphabetCharacter | StartPoint | EndPoint

function parseInput(
  input: string
): [AlphabetCharacter[][], [number, number], [number, number]] {
  const gridMap = input
    .split('\n')
    .map((row) => row.split('')) as GridLetter[][]
  const startRow = gridMap.findIndex((row) => row.includes('S'))
  const startCol = gridMap[startRow]?.indexOf('S')
  const endRow = gridMap.findIndex((row) => row.includes('E'))
  const endCol = gridMap[endRow]?.indexOf('E')

  gridMap[startRow][startCol] = 'a'
  gridMap[endRow][endCol] = 'z'

  return [
    gridMap as AlphabetCharacter[][],
    [startRow, startCol],
    [endRow, endCol],
  ]
}

function canMove(from: string, to: string): boolean {
  const fromCharCode = from.charCodeAt(0)
  const toCharCode = to.charCodeAt(0)
  return fromCharCode === toCharCode - 1 || fromCharCode >= toCharCode
}

function getNeighbors(
  gridMap: AlphabetCharacter[][],
  row: number,
  col: number
): [number, number][] {
  const neighbors: [number, number][] = []
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]

  for (const [rowOffset, colOffset] of directions) {
    const newRow = row + rowOffset
    const newCol = col + colOffset

    if (
      newRow < 0 ||
      newRow >= gridMap.length ||
      newCol < 0 ||
      newCol >= gridMap[0].length
    ) {
      continue
    }

    if (canMove(gridMap[row][col], gridMap[newRow][newCol])) {
      neighbors.push([newRow, newCol])
    }
  }

  return neighbors
}

function part1(input: ReturnType<typeof parseInput>) {
  const [gridMap, [startRow, startCol], [endRow, endCol]] = input

  const queue = [
    {
      row: startRow,
      col: startCol,
      steps: 0,
    },
  ]
  const visited: Set<string> = new Set()

  while (queue.length > 0) {
    const { row, col, steps } = queue.shift()!
    const key = `${row},${col}`
    if (visited.has(key)) {
      continue
    }
    visited.add(key)

    if (row === endRow && col === endCol) {
      console.log('part1', steps)
      return
    }

    const neighbors = getNeighbors(gridMap, row, col)

    for (const [newRow, newCol] of neighbors) {
      queue.push({
        row: newRow,
        col: newCol,
        steps: steps + 1,
      })
    }
  }
}

function part2(input: ReturnType<typeof parseInput>) {
  const [gridMap, [startRow, startCol], [endRow, endCol]] = input
  // get all starting points with the letter a
  const startingPoints: [number, number][] = gridMap.reduce(
    (acc, row, rowIdx) => [
      ...acc,
      ...row.reduce(
        (acc, col, colIdx) => (col === 'a' ? [...acc, [rowIdx, colIdx]] : acc),
        [] as [number, number][]
      ),
    ],
    [] as [number, number][]
  )

  const shortestPaths: number[] = []

  for (const [startRow, startCol] of startingPoints) {
    const queue = [
      {
        row: startRow,
        col: startCol,
        steps: 0,
      },
    ]
    const visited: Set<string> = new Set()

    while (queue.length > 0) {
      const { row, col, steps } = queue.shift()!
      const key = `${row},${col}`
      if (visited.has(key)) {
        continue
      }
      visited.add(key)

      if (row === endRow && col === endCol) {
        shortestPaths.push(steps)
        break
      }

      const neighbors = getNeighbors(input[0], row, col)

      for (const [newRow, newCol] of neighbors) {
        queue.push({
          row: newRow,
          col: newCol,
          steps: steps + 1,
        })
      }
    }
  }

  console.log('part2', Math.min(...shortestPaths))
}

function test() {
  const testInput = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`
  const input = parseInput(testInput)
  part1(input)
}

// test()

// part1(parseInput(importInput(12)))

part2(parseInput(importInput(12)))
