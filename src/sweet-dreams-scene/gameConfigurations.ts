import { Difficulty, GameConfig } from './types'

export const gameConfigurations: { [key in Difficulty]: GameConfig } = {
  [Difficulty.VeryEasy]: {
    size: 5,
    hasSymbol: false,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.6
  },
  [Difficulty.Easy]: {
    size: 6,
    hasSymbol: false,
    targetColorProbability: 0.5,
    targetSymbolProbability: 0.5
  },
  [Difficulty.Medium]: {
    size: 7,
    hasSymbol: true,
    targetColorProbability: 0.4,
    targetSymbolProbability: 0.4
  },
  [Difficulty.Hard]: {
    size: 8,
    hasSymbol: true,
    targetColorProbability: 0.3,
    targetSymbolProbability: 0.3
  },
  [Difficulty.VeryHard]: {
    size: 9,
    hasSymbol: true,
    targetColorProbability: 0.2,
    targetSymbolProbability: 0.2
  }
} as const

export const getGameConfiguration = (difficulty: Difficulty): GameConfig => gameConfigurations[difficulty]
