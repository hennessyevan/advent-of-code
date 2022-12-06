import { importInput } from './utils/importInput'

const input = importInput(2)

const rounds = input.split('\n').map((line) => line.split(' '))

const shapes = {
  A: 'ROCK',
  B: 'PAPER',
  C: 'SCISSORS',
  X: 'ROCK',
  Y: 'PAPER',
  Z: 'SCISSORS',
}

const shapeScores = {
  X: 1,
  Y: 2,
  Z: 3,
}

const desiredOutcome = {
  X: 'lose',
  Y: 'tie',
  Z: 'win',
}

const outcomeMatches = {
  lose: {
    A: 'Z',
    B: 'X',
    C: 'Y',
  },
  tie: {
    A: 'X',
    B: 'Y',
    C: 'Z',
  },
  win: {
    A: 'Y',
    B: 'Z',
    C: 'X',
  },
}

let score1 = 0

const plays = {
  win,
  lose,
  tie,
}

function win(shape: string, score: number): number {
  return score + 6 + shapeScores[shape]
}

function lose(shape: string, score: number): number {
  return score + shapeScores[shape]
}

function tie(shape: string, score: number): number {
  return score + 3 + shapeScores[shape]
}

for (const round of rounds) {
  const [theirs, ours] = round

  if (shapes[theirs] === shapes[ours]) {
    score1 = tie(ours, score1)
  } else if (
    (shapes[theirs] === 'ROCK' && shapes[ours] === 'PAPER') ||
    (shapes[theirs] === 'PAPER' && shapes[ours] === 'SCISSORS') ||
    (shapes[theirs] === 'SCISSORS' && shapes[ours] === 'ROCK')
  ) {
    score1 = win(ours, score1)
  } else {
    score1 = lose(ours, score1)
  }
}

let score2 = 0
for (const round of rounds) {
  const [theirs, ours] = round

  const outcome = desiredOutcome[ours]
  const play = outcomeMatches[outcome][theirs]

  score2 = plays[outcome](play, score2)
}

// console.log(score1)
console.log(score2)
