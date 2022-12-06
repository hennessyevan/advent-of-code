import { importInput } from './utils/importInput'

const input = importInput(1)

let mostCalories = 0

// split by newlines
const lines = input.split('\n')

let elfIndex = 0
const elves: number[][] = [[]]

for (const line of lines) {
  if (line === '') {
    elfIndex++
    elves[elfIndex] = []
    continue
  }

  elves[elfIndex].push(Number(line))
}

const totals = elves.map((elf) => elf.reduce((a, b) => a + b, 0))
const largest = Math.max(...totals)
const topThreeLargest = totals
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((a, b) => a + b, 0)
console.log(largest)
console.log(topThreeLargest)
