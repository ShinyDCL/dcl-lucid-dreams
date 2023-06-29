export interface GameConfig {
  size: number
  hasSymbol: boolean
  targetColorProbability: number
  targetSymbolProbability: number
}

// Array of configurations for each game round
const gameConfiguration: GameConfig[] = [
  {
    size: 5,
    hasSymbol: false,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.6
  },
  {
    size: 6,
    hasSymbol: false,
    targetColorProbability: 0.5,
    targetSymbolProbability: 0.5
  },
  {
    size: 7,
    hasSymbol: true,
    targetColorProbability: 0.8,
    targetSymbolProbability: 0.7
  },
  {
    size: 7,
    hasSymbol: true,
    targetColorProbability: 0.7,
    targetSymbolProbability: 0.6
  },
  {
    size: 8,
    hasSymbol: true,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.5
  },
  {
    size: 8,
    hasSymbol: true,
    targetColorProbability: 0.5,
    targetSymbolProbability: 0.4
  },
  {
    size: 9,
    hasSymbol: true,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.3
  },
  {
    size: 9,
    hasSymbol: true,
    targetColorProbability: 0.8,
    targetSymbolProbability: 0.2
  },
  {
    size: 9,
    hasSymbol: true,
    targetColorProbability: 1,
    targetSymbolProbability: 0.1
  },
  {
    size: 9,
    hasSymbol: true,
    targetColorProbability: 1.5,
    targetSymbolProbability: 0.05
  }
]

export const getGameConfiguration = (round: number): GameConfig => gameConfiguration[round]
export const getRoundCount = () => gameConfiguration.length
