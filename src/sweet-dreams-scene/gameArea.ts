import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { sweetDreamsModels } from '../resources'
import { Difficulty, GameResult, TileColor, TileColorKey, TileSymbol, TileSymbolKey } from './types'
import { getGameConfiguration } from './gameConfigurations'

import { GameArea, Tile } from './components'

const tileModels: { [key in TileColor]: string } = {
  [TileColor.Yellow]: `${sweetDreamsModels}/tileYellow.glb`,
  [TileColor.Pink]: `${sweetDreamsModels}/tilePink.glb`,
  [TileColor.LightBlue]: `${sweetDreamsModels}/tileLightBlue.glb`,
  [TileColor.DarkBlue]: `${sweetDreamsModels}/tileDarkBlue.glb`,
  [TileColor.Green]: `${sweetDreamsModels}/tileGreen.glb`,
  [TileColor.Purple]: `${sweetDreamsModels}/tilePurple.glb`
} as const

const symbolModels: { [key in TileSymbol]: string } = {
  [TileSymbol.Cloud]: 'models/tileYellow.glb',
  [TileSymbol.Moon]: 'models/tilePink.glb',
  [TileSymbol.Star]: 'models/tileLightBlue.glb'
} as const

const tileSize = 2

export const createGameArea = (difficulty: Difficulty, parent: Entity): GameResult => {
  const config = getGameConfiguration(difficulty)
  const { size, hasSymbol, targetColorProbability, targetSymbolProbability } = config

  const colorKeys = Object.keys(TileColor) as TileColorKey[]
  const targetColorIndex = getRandomInt(colorKeys.length)
  const targetColor = TileColor[colorKeys[targetColorIndex]]
  const colorsWithProbabilities = colorKeys.map((key, index) => ({
    value: TileColor[key],
    probability: index === targetColorIndex ? targetColorProbability : 1
  }))

  const symbolKeys = Object.keys(TileSymbol) as TileSymbolKey[]
  const targetSymbolIndex = getRandomInt(symbolKeys.length)
  const targetSymbol = TileSymbol[symbolKeys[targetSymbolIndex]]
  const symbolsWithProbabilities = symbolKeys.map((key, index) => ({
    value: TileSymbol[key],
    probability: index === targetSymbolIndex ? targetSymbolProbability : 1
  }))

  const targetCoordinates: [number, number] = [getRandomInt(size), getRandomInt(size)]

  const floorMiddle = -((tileSize * size) / 2 - tileSize / 2)
  const gameAreaEntity = engine.addEntity()
  Transform.create(gameAreaEntity, {
    position: Vector3.create(floorMiddle, -1, floorMiddle),
    parent
  })
  GameArea.create(gameAreaEntity)

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const isTargetTile = i === targetCoordinates[0] && j === targetCoordinates[1]

      if (isTargetTile) {
        createTile(i, j, gameAreaEntity, true, targetColor, hasSymbol ? targetSymbol : undefined)
      } else {
        const color = getRandomItem<TileColor>(colorsWithProbabilities)
        const symbol = hasSymbol ? getRandomItem<TileSymbol>(symbolsWithProbabilities) : undefined
        createTile(i, j, gameAreaEntity, color === targetColor, color, symbol)
      }
    }
  }

  const targetTile = engine.addEntity()
  GltfContainer.create(targetTile, { src: tileModels[targetColor] })
  Transform.create(targetTile, {
    position: Vector3.create(-floorMiddle, 3, -floorMiddle * 2 + 2),
    rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
    scale: Vector3.create(2, 2, 2),
    parent: gameAreaEntity
  })

  return { targetColor, targetSymbol }
}

export const createTile = (
  i: number,
  j: number,
  parent: Entity,
  isTarget: boolean,
  color: TileColor,
  _symbol?: TileSymbol
) => {
  const tile = engine.addEntity()
  GltfContainer.create(tile, { src: tileModels[color] })
  Transform.create(tile, {
    position: Vector3.create(tileSize * i, 0, tileSize * j),
    parent: parent
  })
  Tile.create(tile, { isTarget })
}

const normalizeProbabilities = <T>(items: { value: T; probability: number }[]): { value: T; probability: number }[] => {
  const totalProbability = items.reduce((sum, item) => sum + item.probability, 0)
  return items.map(({ value, probability }) => ({
    value,
    probability: probability / totalProbability
  }))
}

const getRandomItem = <T>(items: { value: T; probability: number }[]): T => {
  const normalizedItems = normalizeProbabilities(items)

  const randomValue = Math.random()
  let cumulativeProbability = 0

  for (const item of normalizedItems) {
    cumulativeProbability += item.probability
    if (randomValue <= cumulativeProbability) {
      return item.value
    }
  }

  // Fallback in case of rounding errors or unexpected inputs
  return normalizedItems[normalizedItems.length - 1].value
}

const getRandomInt = (size: number) => Math.floor(Math.random() * size)
