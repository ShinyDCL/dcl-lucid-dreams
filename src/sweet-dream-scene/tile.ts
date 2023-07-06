import { Entity, GltfContainer, Transform, TransformType, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { GameConfig } from './gameConfiguration'
import { modelFolders } from '../common'
import { Tile } from './components'

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

export const colorKeys = Object.keys(TileColor) as TileColorKey[]
export const colorEnums: TileColor[] = colorKeys.map((key) => TileColor[key])

export const symbolKeys = Object.keys(TileSymbol) as TileSymbolKey[]
export const symbolEnums: TileSymbol[] = symbolKeys.map((key) => TileSymbol[key])

const tileModels: { [key in TileColor]: string } = {
  [TileColor.Yellow]: `${modelFolders.sweetDream}/tileYellow.glb`,
  [TileColor.Pink]: `${modelFolders.sweetDream}/tilePink.glb`,
  [TileColor.LightBlue]: `${modelFolders.sweetDream}/tileLightBlue.glb`,
  [TileColor.DarkBlue]: `${modelFolders.sweetDream}/tileDarkBlue.glb`,
  [TileColor.Green]: `${modelFolders.sweetDream}/tileGreen.glb`,
  [TileColor.Purple]: `${modelFolders.sweetDream}/tilePurple.glb`
} as const

const symbolModels: { [key in TileSymbol]: string } = {
  [TileSymbol.Triangle]: `${modelFolders.sweetDream}/tileTriangle.glb`,
  [TileSymbol.Square]: `${modelFolders.sweetDream}/tileSquare.glb`,
  [TileSymbol.Pentagon]: `${modelFolders.sweetDream}/tilePentagon.glb`
} as const

export const tileSize = 2

/*
 * Creates a single tile for game area
 */
export const createGameAreaTile = (
  parent: Entity,
  gameConfig: GameConfig,
  coordinates: { i: number; j: number },
  targetColor: TileColor,
  targetSymbol: TileSymbol,
  color: TileColor,
  symbol?: TileSymbol
) => {
  const isTargetColor = color === targetColor
  const isTargetSymbol = symbol === targetSymbol
  const isTarget = gameConfig.hasSymbol ? isTargetColor && isTargetSymbol : isTargetColor

  const transform = { position: Vector3.create(coordinates.i * tileSize, 0, coordinates.j * tileSize), parent }
  createTile(gameConfig, transform, isTarget, color, symbol)
}

/*
 * Creates a tile displaying target color and symbol at the front of game area
 */
export const createDisplayTile = (
  parent: Entity,
  gameConfig: GameConfig,
  position: Vector3.MutableVector3,
  color: TileColor,
  symbol?: TileSymbol
) => {
  const transform = {
    position,
    rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
    scale: Vector3.create(2, 2, 2),
    parent
  }
  createTile(gameConfig, transform, true, color, symbol)
}

/*
 * Creates a tile
 */
export const createTile = (
  { hasSymbol }: GameConfig,
  transform: Partial<TransformType>,
  isTarget: boolean,
  color: TileColor,
  symbol?: TileSymbol
) => {
  const tile = engine.addEntity()
  GltfContainer.create(tile, { src: tileModels[color] })
  Transform.create(tile, transform)
  Tile.create(tile, { isTarget })

  if (hasSymbol && symbol) {
    createTileSymbol(tile, symbol, isTarget)
  }
}

/*
 * Creates a symbol for a tile
 */
export const createTileSymbol = (parent: Entity, symbol: TileSymbol, isTarget: boolean) => {
  const tileSymbol = engine.addEntity()
  GltfContainer.create(tileSymbol, { src: symbolModels[symbol] })
  Transform.create(tileSymbol, { position: Vector3.create(0, 0.2, 0), parent })
  Tile.create(tileSymbol, { isTarget })
}
