import { importInput } from './utils/importInput'

function part1() {
  const input = importInput(6)

  const characters = input.split('')

  for (let i = 0; i < characters.length; i++) {
    if (i <= 3) continue

    const last4Characters = characters.slice(i - 4, i)
    if (
      last4Characters.every((char, index, arr) => arr.indexOf(char) === index)
    ) {
      return i
    }
  }
}

console.log(part1())

function part2() {
  const input = importInput(6)

  const characters = input.split('')

  for (let i = 0; i < characters.length; i++) {
    if (i <= 13) continue

    const last14Characters = characters.slice(i - 14, i)
    if (
      last14Characters.every((char, index, arr) => arr.indexOf(char) === index)
    ) {
      return i
    }
  }
}

console.log(part2())
