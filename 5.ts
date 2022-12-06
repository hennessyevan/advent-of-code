import { importInput } from './utils/importInput'

const input = importInput(5)

// test input
// const input = `
//     [D]
// [N] [C]
// [Z] [M] [P]
//  1   2   3

// move 1 from 2 to 1
// move 3 from 1 to 3
// move 2 from 2 to 1
// move 1 from 1 to 2
// `

function* chunkArray(arr: any[], n: number) {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

//regex to split the input into an array of 9 arrays
const crateMatrix = input
  .split('\n')
  .filter((row) => row.includes('['))
  .map((row) => row.split('').filter((_, i) => (i + 1) % 4 !== 0))
  .map((row) => [...chunkArray(row, 3)].map((row) => row[1]))
  .reduce((acc, row, i) => {
    row.forEach((crate, j) => {
      acc[j] = acc[j] || []
      acc[j][i] = crate
    })
    return acc
  }, [] as (string | null)[][])
  .map((row: (string | null)[]) => row.filter((crate) => crate !== ' '))

const instructions = input
  .split('\n')
  .filter((row) => row.startsWith('move'))
  .map((row) => {
    const [, cratesToMove, , from, , to] = row.split(' ').map(Number)
    return [cratesToMove, from, to]
  })

const part1Matrix = JSON.parse(JSON.stringify(crateMatrix))

// Part 1
for (const [cratesToMove, from, to] of instructions) {
  for (let i = 0; i < cratesToMove; i++) {
    const crate = part1Matrix[from - 1].shift()

    part1Matrix[to - 1].unshift(crate!)
  }
}

const tops1 = part1Matrix.map((row) => row[0]).join('')

console.log(tops1)

const part2Matrix = JSON.parse(JSON.stringify(crateMatrix))
// Part 2
for (const [cratesToMove, from, to] of instructions) {
  const crates = part2Matrix[from - 1].splice(0, cratesToMove)
  part2Matrix[to - 1].unshift(...crates)
}

const tops2 = part2Matrix.map((row) => row[0]).join('')
console.log(tops2)
