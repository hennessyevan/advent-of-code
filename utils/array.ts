export const from = <T = undefined>(
  size: number,
  creator?: (v: T, k: number) => T
): T[] =>
  Array.from({ length: size }, creator || (() => undefined as unknown as T))

export const zip = <T>(
  arrOne: T[],
  arrTwo: T[]
): [T | undefined, T | undefined][] => {
  const maxLength = Math.max(arrOne.length, arrTwo.length)

  return from(maxLength).map((_, i) => [arrOne[i], arrTwo[i]])
}
