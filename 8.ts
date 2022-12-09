import { importInput } from './utils/importInput'

function parseInputToGrid(input: string) {
  return input.split('\n').map((line) => line.split('').map(Number))
}

function part1(grid: number[][]) {
  let visibleTrees = 0

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      let isVisible = false

      function traverseRow(index: number, direction: number) {
        if (isVisible) return

        const nextCell = row[index + direction]

        if (typeof nextCell === 'undefined') {
          isVisible = true
          return
        }

        if (nextCell < cell) {
          traverseRow(index + direction, direction)
        }
      }

      function traverseColumn(index: number, direction: number) {
        if (isVisible) return

        const nextCell = grid[index + direction]?.[cellIndex]
        if (typeof nextCell === 'undefined') {
          isVisible = true
        }

        if (nextCell < cell) {
          traverseColumn(index + direction, direction)
        }
      }

      traverseRow(cellIndex, 1)
      traverseRow(cellIndex, -1)
      traverseColumn(rowIndex, 1)
      traverseColumn(rowIndex, -1)

      if (isVisible) {
        visibleTrees++
      }
    })
  })

  return visibleTrees
}

function part2(grid: number[][]) {
  let topTotalScore = 0

  grid.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      let leftScore = 0
      let rightScore = 0
      let bottomScore = 0
      let topScore = 0

      function traverseRow(index: number, direction: number) {
        const nextCell = row[index + direction]

        if (typeof nextCell === 'undefined') {
          return
        }

        if (direction === 1) leftScore++
        else rightScore++

        if (nextCell < cell) {
          traverseRow(index + direction, direction)
        }
      }

      function traverseColumn(index: number, direction: number) {
        const nextCell = grid[index + direction]?.[cellIndex]
        if (typeof nextCell === 'undefined') {
          return
        }

        if (direction === 1) topScore++
        else bottomScore++

        if (nextCell < cell) {
          traverseColumn(index + direction, direction)
        }
      }

      traverseRow(cellIndex, 1)
      traverseRow(cellIndex, -1)
      traverseColumn(rowIndex, 1)
      traverseColumn(rowIndex, -1)

      const totalScore = leftScore * rightScore * bottomScore * topScore
      if (totalScore > topTotalScore) topTotalScore = totalScore
    })
  })

  return topTotalScore
}

const grid = parseInputToGrid(importInput(8))
// console.log(part1(grid))
console.log(part2(grid))

function test() {
  const input = `
30373
25512
65332
33549
35390
`
  const grid = parseInputToGrid(input)
  // console.log(part1(grid))
  // console.log(part2(grid))
}

test()
