import { importInput } from './utils/importInput'

class Valve {
  name: string
  flowRate: number
  toValves: string[]

  constructor(name: string, flowRate: number, toValves: string[]) {
    this.name = name
    this.flowRate = flowRate
    this.toValves = toValves
  }
}

function parseInput(input: string) {
  return input.split('\n').map((line) => {
    const [, valve] = line.match(/Valve ([A-Z]{2})/)!
    const [, flowRate] = line.match(/flow rate=([0-9]+);/)!
    const [, nextValves] = line.match(/leads? to valves? (.*)/)!

    return new Valve(valve, Number(flowRate), nextValves.split(', '))
  })
}

function part1() {
  const input = parseInput(importInput(16.1))

  let scores = []
  let solutions = []

  const findHighestScore = (
    startingValve: Valve,
    score: number,
    elapsed = 0,
    visited = [],
    turns,
    recordSolutions: boolean = true
  ) => {
    if (recordSolutions) {
      solutions.push([score, visited])
    }

    scores.push(score)

    if (elapsed === turns) {
      return
    }

    for (const nextValve of startingValve.toValves) {
      const nextValveObj = input.find((valve) => valve.name === nextValve)

      if (nextValveObj === undefined) {
        throw new Error('Valve not found')
      }

      if (visited.includes(nextValveObj.name)) {
        continue
      }

      findHighestScore(
        nextValveObj,
        score + nextValveObj.flowRate,
        elapsed + 1,
        [...visited, nextValveObj.name],
        turns,
        recordSolutions
      )
    }
  }

  return Math.max(...scores)
}
console.log(part1())
