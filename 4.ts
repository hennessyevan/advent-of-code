import { importInput } from './utils/importInput'

const input = importInput(4)

type Range = [number, number]

function getRange(input: string): Range {
  const [min, max] = input.split('-').map(Number)

  return [min, max]
}

function splitPairs(input: string): [string, string] {
  return input.split(',') as [string, string]
}

function assignmentFullyContains(
  assignment1: Range,
  assignment2: Range
): boolean {
  const [min1, max1] = assignment1
  const [min2, max2] = assignment2

  return (min1 <= min2 && max1 >= max2) || (min2 <= min1 && max2 >= max1)
}

function assignmentsOverlap(assignment1: Range, assignment2: Range): boolean {
  const [min1, max1] = assignment1
  const [min2, max2] = assignment2

  return (min1 >= min2 && min1 <= max2) || (min2 >= min1 && min2 <= max1)
}

function answer1() {
  let fullyContained = 0
  const lines = input.split('\n')
  for (const line of lines) {
    const rangePairs = splitPairs(line).map(getRange)
    if (assignmentFullyContains(...(rangePairs as [Range, Range]))) {
      fullyContained++
    }
  }

  console.log(fullyContained)
}

function answer2() {
  let overlapped = 0
  const lines = input.split('\n')
  for (const line of lines) {
    const rangePairs = splitPairs(line).map(getRange)
    if (assignmentsOverlap(...(rangePairs as [Range, Range]))) {
      overlapped++
    }
  }

  console.log(overlapped)
}

answer1()
answer2()
