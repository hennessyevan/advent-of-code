import { zip } from './utils/array'
import { importInput } from './utils/importInput'

function parseInput(input: string): string[][] {
  return input
    .split('\n\n')
    .map((row) => row.split('\n').map((packet) => JSON.parse(packet)))
}

type PacketItem = number[] | number
type Packet = PacketItem[]

enum ComparisonResult {
  Correct = -1,
  Incorrect = 1,
  Equal = 0,
}

const comparePackets = (
  leftPacket: Packet,
  rightPacket: Packet
): ComparisonResult => {
  for (const [left, right] of zip(leftPacket, rightPacket)) {
    if (left === undefined) return ComparisonResult.Correct
    if (right === undefined) return ComparisonResult.Incorrect

    if (typeof left === 'number' && typeof right === 'number') {
      if (left === right) continue
      return left < right
        ? ComparisonResult.Correct
        : ComparisonResult.Incorrect
    }

    const result = comparePackets(
      Array.isArray(left) ? left : [left],
      Array.isArray(right) ? right : [right]
    )

    if (result !== ComparisonResult.Equal) {
      return result
    }
  }

  return ComparisonResult.Equal
}

const separatorPackets: Packet[] = [[[2]], [[6]]]
const separatorStrings: string[] = separatorPackets.map((p) =>
  JSON.stringify(p)
)

function part1(input: ReturnType<typeof parseInput>) {
  const orderedPairsSum = input
    .map(([left, right]) => comparePackets(left, right))
    .reduce(
      (sum, result, i) =>
        sum + (result === ComparisonResult.Correct ? i + 1 : 0),
      0
    )

  const allPackets = [...input.flatMap((p) => p), ...separatorPackets]

  const decoderKey = allPackets
    .sort(comparePackets)
    .reduce(
      (product, packet, i) =>
        product *
        (separatorStrings.includes(JSON.stringify(packet)) ? i + 1 : 1),
      1
    )

  console.log(decoderKey)
  console.log(orderedPairsSum)
}

function test() {
  const input = importInput(13)
  const parsedInput = parseInput(input)
  part1(parsedInput)
}

test()
