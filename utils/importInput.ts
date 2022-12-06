import fs from 'fs'

export function importInput(day: number): string {
  // Read the file synchronously
  return fs.readFileSync(`./inputs/${day}.txt`, 'utf8')
}
