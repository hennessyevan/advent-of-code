import { importInput } from './utils/importInput'

type Movement = ['R' | 'L' | 'U' | 'D', number]

const input = importInput(9)

type PositionT = { row: number; column: number }
type DirectionT = 'L' | 'R' | 'U' | 'D'
type OffsetT = -1 | 0 | 1
type ActionT = { direction: DirectionT; amount: number }

const head: PositionT = { row: 0, column: 0 }
const tail: PositionT = { row: 0, column: 0 }
const p1: PositionT[] = [
  { row: 0, column: 0 },
  { row: 0, column: 0 },
]
const p2: PositionT[] = []
for (let i = 0; i < 10; i += 1) {
  p2.push({ row: 0, column: 0 })
}

const sampleInput = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`

const translation: ActionT[] = input.split(/\r?\n/g).map((action) => {
  const [direction, steps] = action.split(/\s/g)
  return { direction, amount: parseInt(steps) } as ActionT
})

const hits1 = uniquePositions(p1, translation)
const hits2 = uniquePositions(p2, translation)
console.log(hits1.size)
console.log(hits2.size)
function uniquePositions(snek: PositionT[], actions: ActionT[]) {
  const positions: Set<string> = new Set()
  positions.add(`0-0`)
  let head = snek[0]
  let tail = snek[1]
  for (const { direction, amount } of actions) {
    for (let i = 0; i < amount; i += 1) {
      head = snek[0]
      switch (direction) {
        case 'L':
          head.column -= 1
          break
        case 'R':
          head.column += 1
          break
        case 'U':
          head.row += 1
          break
        case 'D':
          head.row -= 1
      }
      for (let j = 1; j < snek.length; j += 1) {
        head = snek[j - 1]
        tail = snek[j]
        const distance = {
          row: head.row - tail.row,
          column: head.column - tail.column,
        }
        tailMove(distance, head, tail)
      }
      //console.log(`${tail.row}-${tail.column}`)
      positions.add(`${tail.row}-${tail.column}`)
    }
  }
  return positions
}

function tailMove(distance: PositionT, head: PositionT, tail: PositionT) {
  const sameRow = head.row === tail.row
  const sameCol = head.column === tail.column
  const isAligned = sameRow || sameCol
  const hasRowDistance = Math.abs(distance.row) > 1
  const hasColumnDistance = Math.abs(distance.column) > 1
  const hasDistance = hasRowDistance || hasColumnDistance
  if (hasDistance && isAligned) {
    if (sameRow) {
      tail.column += distance.column > 0 ? 1 : -1
    } else if (sameCol) {
      tail.row += distance.row > 0 ? 1 : -1
    }
  } else if (hasRowDistance || hasColumnDistance) {
    tail.row += head.row > tail.row ? 1 : -1
    tail.column += head.column > tail.column ? 1 : -1
  }
}

// console.log(part1(parseInput()))
