import { importInput } from './utils/importInput'

const input = importInput(3)

function letterPriority(letter: string) {
  if (letter.charCodeAt(0) >= 65 && letter.charCodeAt(0) <= 90) {
    return letter.charCodeAt(0) - 64 + 26
  } else {
    return letter.charCodeAt(0) - 96
  }
}

const rucksackPairs = input
  .split('\n')
  .map((line) => {
    const firstHalf = line.slice(0, line.length / 2)
    const secondHalf = line.slice(line.length / 2)

    return [firstHalf, secondHalf]
  })
  .map(([firstHalf, secondHalf]) => {
    for (const letter of firstHalf) {
      if (secondHalf.includes(letter)) {
        return letter
      }
    }

    return ''
  })
  .map(letterPriority)

const answer1 = rucksackPairs.reduce((acc, curr) => acc + curr, 0)

const rucksackGroupsOfThree = input
  .split('\n')
  .reduce(
    (acc, curr) => {
      // group into 3s
      if (acc[acc.length - 1].length === 3) {
        acc.push([])
      }

      acc[acc.length - 1].push(curr)

      return acc
    },
    [[]] as string[][]
  )
  .map((trio) => {
    return trio.map((line) => {
      for (const letter of line) {
        if (trio.every((otherLine) => otherLine.includes(letter))) {
          return letter
        }
      }
    })
  })
  .map((group) => letterPriority(group[0]!))

const answer2 = rucksackGroupsOfThree.reduce((acc, curr) => acc + curr, 0)
console.log(answer2)
