import { importInput } from './utils/importInput'

function parseInput(input: string) {
  const parsed = input.split('\n\n').map((group) => {
    const id = Number(group.match(/Monkey (\d+)/)?.[1])
    const items: number[] = group
      .match(/Starting items: (.*)/)![1]
      .split(', ')
      .map((item) => Number(item))

    const worryOperationString = group.match(/Operation: new = (.*)/)![1]
    function worryOperation(worryLevel: number): number {
      const worryOperationStringReplaced = worryOperationString.replace(
        /old/g,
        String(worryLevel)
      )

      return eval(worryOperationStringReplaced)
    }

    const divisor = Number(group.match(/divisible by (\d+)/)?.[1])
    const trueMonkey = Number(group.match(/If true: .+ (\d+)/)?.[1])
    const falseMonkey = Number(group.match(/If false: .+ (\d+)/)?.[1])

    function test(worryLevel: number): number {
      if (worryLevel % divisor === 0) {
        return trueMonkey
      } else {
        return falseMonkey
      }
    }

    return { id, items, worryOperation, divisor, test, inspectCount: 0 }
  })

  return parsed
}

function test() {
  const rounds = 10000
  const monkeys = parseInput(importInput(11))

  let divisor = monkeys.reduce((acc, monkey) => {
    return acc * monkey.divisor
  }, 1)

  for (let i = 0; i < rounds; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      let { items, worryOperation, test } = monkeys[j]

      while (items.length > 0) {
        monkeys[j].inspectCount++
        let item = items.shift()
        item = worryOperation(item!)

        item %= divisor

        const nextMonkey = monkeys[test(item)]
        nextMonkey.items.push(item)
      }
    }
  }

  monkeys.sort((a, b) => b.inspectCount - a.inspectCount)

  return monkeys[0].inspectCount * monkeys[1].inspectCount
}

console.log(test())
