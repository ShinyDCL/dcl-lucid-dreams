/*
 * Shuffles elements in array in random order
 */
export const shuffleArray = (arr: string[]): string[] =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

/*
 * Returns random Int between 0 and max
 */
export const getRandomInt = (max: number) => Math.floor(Math.random() * max + 1)
