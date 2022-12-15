import { importInput } from './utils/importInput'

function parseInput(input: string): number[][][] {
  return input
    .split('\n')
    .map((line) =>
      line.split(' -> ').map((coordinate) => coordinate.split(',').map(Number))
    )
}

function printGrid(
  input: ReturnType<typeof parseInput>,
  grid: string[][],
  restedSandCount?: number
) {
  console.clear()
  // find the bounries of the grid
  const rightMostPoint =
    Math.max(
      ...input.map((line) =>
        line.map((point) => point[0]).reduce((a, b) => Math.max(a, b))
      )
    ) + 200
  const leftMostPoint =
    Math.min(
      ...input.map((line) =>
        line.map((point) => point[0]).reduce((a, b) => Math.min(a, b))
      )
    ) - 150
  const bottomMostPoint =
    Math.max(
      ...input.map((line) =>
        line.map((point) => point[1]).reduce((a, b) => Math.max(a, b))
      )
    ) + 5
  const topMostPoint =
    Math.min(
      ...input.map((line) =>
        line.map((point) => point[1]).reduce((a, b) => Math.min(a, b))
      )
    ) - 25

  const gridArea = grid
    .slice(topMostPoint, bottomMostPoint)
    .map((row) => row.slice(leftMostPoint, rightMostPoint).join(''))
    .join('\n')

  if (restedSandCount) {
    // put the sand count in the bottom right corner
    const sandCount = String(restedSandCount).split('')
    const lastRow = gridArea.split('\n').pop()!
    const lastRowWithSandCount =
      lastRow.slice(0, -sandCount.length) + sandCount.join('')
    const gridAreaWithSandCount =
      gridArea.split('\n').slice(0, -1).join('\n') + '\n' + lastRowWithSandCount
    console.log(gridAreaWithSandCount)
    return
  }

  console.log(gridArea)
}

function createGrid(input: ReturnType<typeof parseInput>) {
  const rightMostPoint = Math.max(
    ...input.map((line) =>
      line.map((point) => point[0]).reduce((a, b) => Math.max(a, b))
    )
  )
  const bottomMostPoint = Math.max(
    ...input.map((line) =>
      line.map((point) => point[1]).reduce((a, b) => Math.max(a, b))
    )
  )

  const floorY = bottomMostPoint + 2

  const grid = Array.from({ length: bottomMostPoint + 10 }, () =>
    Array.from({ length: rightMostPoint + 1000 }, () => '.')
  )

  function drawLine(
    startingPoint: [number, number],
    endingPoint: [number, number]
  ) {
    const [x1, y1] = startingPoint
    const [x2, y2] = endingPoint

    if (x1 === x2) {
      // vertical line
      const yMin = Math.min(y1, y2)
      const yMax = Math.max(y1, y2)

      for (let y = yMin; y <= yMax; y++) {
        grid[y][x1] = '#'
      }
    } else {
      // horizontal line
      const xMin = Math.min(x1, x2)
      const xMax = Math.max(x1, x2)

      for (let x = xMin; x <= xMax; x++) {
        grid[y1][x] = '#'
      }
    }
  }

  input.forEach((line) => {
    let startingPoint = line.shift()!
    let points = line

    for (let point of points) {
      drawLine(startingPoint, point)
      startingPoint = point
    }
  })

  // Draw the floor
  for (let x = 0; x < grid[0].length; x++) {
    grid[floorY][x] = '#'
  }

  return grid
}

function part1(input: ReturnType<typeof parseInput>) {
  const grid = createGrid(input)
  const sandSpoutPoint: [number, number] = [500, 0]
  const sandGlyph = 'o'
  let overflowing = false
  let restedSand = 0
  const visualize = true
  const speed = 0

  let spoutBlocked = false

  async function simulateDownwardFlow(
    startingPoint: [number, number],
    grid: string[][]
  ) {
    if (spoutBlocked) {
      return
    }

    if (visualize) {
      await new Promise((resolve) => setTimeout(resolve, speed))
    }

    const [x, y] = startingPoint
    if (grid[y + 1] === undefined) return

    const pointBelowSand = grid[y + 1][x]
    const solidSurfaceBelowSand = ['#', sandGlyph].includes(pointBelowSand)
    // if point below sand is '#' or 'o'
    if (solidSurfaceBelowSand) {
      // if space diagonally down and left is '.'
      const diagonalDownLeft = grid[y + 1][x - 1]
      const diagonalDownRight = grid[y + 1][x + 1]

      if (diagonalDownLeft === '.') {
        // move sand diagonally down and left
        grid[y + 1][x - 1] = sandGlyph
        grid[y][x] = '.'
        return simulateDownwardFlow([x - 1, y + 1], grid)
      } else if (diagonalDownRight === '.') {
        // move sand diagonally down and right
        grid[y + 1][x + 1] = sandGlyph
        grid[y][x] = '.'
        return simulateDownwardFlow([x + 1, y + 1], grid)
      }

      const bothDiagonalsBlocked = [diagonalDownLeft, diagonalDownRight].every(
        (point) => point === '#' || point === sandGlyph
      )

      if (bothDiagonalsBlocked) {
        if (y === sandSpoutPoint[1]) {
          const pointToTheDownRight = grid[y + 1][x + 1]
          const pointToTheDownLeft = grid[y + 1][x - 1]
          const bothPointsToTheDownAreBlocked = [
            pointToTheDownRight,
            pointToTheDownLeft,
          ].every((point) => ['#', sandGlyph].includes(point))

          if (bothPointsToTheDownAreBlocked) {
            grid[sandSpoutPoint[1]][sandSpoutPoint[0]] = sandGlyph
            restedSand = restedSand + 1
            spoutBlocked = true
            printGrid(input, grid, restedSand)
          }
          return
        }
        // if both diagonals are blocked simulate a new sand drop
        restedSand = restedSand + 1

        return simulateDownwardFlow(sandSpoutPoint, grid)
      }
    } else {
      // if we're below the grid
      if (y + 1 >= grid.length) {
        // stop dropping sand
        overflowing = true
        return
      } else {
        // move sand down
        grid[y + 1][x] = sandGlyph
        grid[y][x] = '.'
        return simulateDownwardFlow([x, y + 1], grid)
      }
    }

    return
  }

  simulateDownwardFlow(sandSpoutPoint, grid)
  printGrid(input, grid, restedSand)
}

function test() {
  const input = importInput(14)
  const parsedInput = parseInput(input)
  console.log(part1(parsedInput))
}

test()
