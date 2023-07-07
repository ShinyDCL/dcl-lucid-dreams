import { Entity, GltfContainer, Transform, TransformType, VisibilityComponent, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { LevelComponent, levels, modelFolders } from '../common'

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

export class Tile {
  private target: boolean = false
  private tileEntity: Entity
  private symbolEntity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const tile = engine.addEntity()
    Transform.create(tile, { ...transform, parent })
    LevelComponent.create(tile, { level: levels.third })
    this.tileEntity = tile

    const tileSymbol = engine.addEntity()
    Transform.create(tileSymbol, { position: Vector3.create(0, 0.2, 0), parent: tile })
    LevelComponent.create(tileSymbol, { level: levels.third })
    this.symbolEntity = tileSymbol
  }

  isTarget = () => this.target

  updateTile = (target: boolean, color: TileColor, symbol?: TileSymbol) => {
    this.target = target
    GltfContainer.createOrReplace(this.tileEntity, { src: tileModels[color] })

    if (symbol) {
      GltfContainer.createOrReplace(this.symbolEntity, { src: symbolModels[symbol] })
    }
  }

  hideTile = () => {
    GltfContainer.deleteFrom(this.symbolEntity)
    GltfContainer.deleteFrom(this.tileEntity)
  }
}
