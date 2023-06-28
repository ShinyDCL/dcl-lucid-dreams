export enum TileColor {
  Yellow = 'Yellow',
  Pink = 'Pink',
  LightBlue = 'Light Blue',
  DarkBlue = 'Dark Blue',
  Green = 'Green',
  Purple = 'Purple'
}

export enum TileSymbol {
  Triangle = 'Triangle',
  Square = 'Square',
  Pentagon = 'Pentagon'
}

export type TileColorKey = keyof typeof TileColor
export type TileSymbolKey = keyof typeof TileSymbol

export interface GameConfig {
  size: number
  hasSymbol: boolean
  targetColorProbability: number
  targetSymbolProbability: number
}

export interface GameResult {
  targetColor: TileColor
  targetSymbol: TileSymbol
}
