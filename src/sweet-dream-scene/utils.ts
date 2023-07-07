export interface ItemWithProbability<T> {
  item: T
  probability: number
}

/*
 * Assigns probability to each item in the array
 */
export const getItemsWithProbabilities = <T>(
  items: T[],
  targetItem: T,
  targetItemProbability: number
): ItemWithProbability<T>[] => {
  const itemsWithProbabilities = items.map((item) => ({
    item,
    probability: item === targetItem ? targetItemProbability : 1
  }))

  return normalizeProbabilities(itemsWithProbabilities)
}

/*
 * Normalizes probabilities so that total sum is 1
 */
export const normalizeProbabilities = <T>(items: ItemWithProbability<T>[]): ItemWithProbability<T>[] => {
  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0)
  return items.map(({ item, probability }) => ({
    item,
    probability: probability / totalProbability
  }))
}

/*
 * Gets random item from array based on its probability
 */
export const getRandomItem = <T>(items: ItemWithProbability<T>[]): T => {
  const randomValue = Math.random()
  let cumulativeProbability = 0

  for (const item of items) {
    cumulativeProbability += item.probability
    if (randomValue <= cumulativeProbability) {
      return item.item
    }
  }

  // Fallback in case of rounding errors or unexpected inputs
  return items[items.length - 1].item
}
