export interface GameConfig {
  hasSymbol: boolean
  targetColorProbability: number
  targetSymbolProbability: number
}

// Array of configurations for each game round
const gameConfiguration: GameConfig[] = [
  {
    hasSymbol: false,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.6
  },
  {
    hasSymbol: false,
    targetColorProbability: 0.5,
    targetSymbolProbability: 0.5
  },
  {
    hasSymbol: true,
    targetColorProbability: 0.6,
    targetSymbolProbability: 0.5
  },
  {
    hasSymbol: true,
    targetColorProbability: 0.7,
    targetSymbolProbability: 0.3
  },
  {
    hasSymbol: true,
    targetColorProbability: 0.8,
    targetSymbolProbability: 0.3
  },
  {
    hasSymbol: true,
    targetColorProbability: 0.9,
    targetSymbolProbability: 0.2
  },
  {
    hasSymbol: true,
    targetColorProbability: 1,
    targetSymbolProbability: 0.1
  },
  {
    hasSymbol: true,
    targetColorProbability: 5,
    targetSymbolProbability: 0.05
  },
  {
    hasSymbol: true,
    targetColorProbability: 20,
    targetSymbolProbability: 0.02
  },
  {
    hasSymbol: true,
    targetColorProbability: 40,
    targetSymbolProbability: 0.01
  }
]

export const getGameConfiguration = (round: number): GameConfig => gameConfiguration[round]
export const getRoundCount = () => gameConfiguration.length
