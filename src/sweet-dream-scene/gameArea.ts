import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { getGameConfiguration } from './gameConfiguration'
import { GameArea, Tile } from './components'
import { TileColor, TileSymbol, colorEnums, createDisplayTile, createGameAreaTile, symbolEnums, tileSize } from './tile'
import { getRandomInt, modelFolders } from '../common'

export interface ItemWithProbability<T> {
  item: T
  probability: number
}

/*
 * Creates a game area from tiles based on current game round configuration
 */
export const createGameArea = (round: number, parent: Entity): Entity => {
  cleanupGameArea()
  const config = getGameConfiguration(round)
  const { size, hasSymbol, targetColorProbability, targetSymbolProbability } = config
  const floorSize = tileSize * size
  const floorMiddle = floorSize / 2 - tileSize / 2

  const targetCoordinates: [number, number] = [getRandomInt(size - 1), getRandomInt(size - 1)]

  const targetColor = colorEnums[getRandomInt(colorEnums.length - 1)]
  const colorsWithProbabilities = getItemsWithProbabilities<TileColor>(colorEnums, targetColor, targetColorProbability)

  const targetSymbol = symbolEnums[getRandomInt(symbolEnums.length - 1)]
  const symbolsWithProbabilities = getItemsWithProbabilities<TileSymbol>(
    symbolEnums,
    targetSymbol,
    targetSymbolProbability
  )

  const gameArea = engine.addEntity()
  Transform.create(gameArea, { position: Vector3.create(-floorMiddle, -1, -floorMiddle), parent })
  GameArea.create(gameArea)

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const isTargetTile = i === targetCoordinates[0] && j === targetCoordinates[1]

      if (isTargetTile) {
        createGameAreaTile(gameArea, config, { i, j }, targetColor, targetSymbol, targetColor, targetSymbol)
      } else {
        const color = getRandomItem<TileColor>(colorsWithProbabilities)
        const symbol = hasSymbol ? getRandomItem<TileSymbol>(symbolsWithProbabilities) : undefined
        createGameAreaTile(gameArea, config, { i, j }, targetColor, targetSymbol, color, symbol)
      }
    }
  }

  createDisplayTile(gameArea, config, Vector3.create(floorMiddle, 3, floorSize + 2), targetColor, targetSymbol)
  addCollider(gameArea, size, floorMiddle)
  return gameArea
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
const normalizeProbabilities = <T>(items: ItemWithProbability<T>[]): ItemWithProbability<T>[] => {
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

/*
 * Adds collider walls to game area based on current round size
 */
export const addCollider = (parent: Entity, size: number, floorMiddle: number) => {
  const gameAreaCollider = engine.addEntity()
  GltfContainer.create(gameAreaCollider, { src: `${modelFolders.sweetDream}/gameAreaCollider.glb` })
  Transform.create(gameAreaCollider, {
    position: Vector3.create(floorMiddle, 0, floorMiddle),
    scale: Vector3.create(size, 1, size),
    parent
  })
}

/*
 * Removes non-target tiles from engine
 */
export const removeNonTargetTiles = () => {
  const tiles = engine.getEntitiesWith(Tile)
  for (const [entity] of tiles) {
    const tileData = Tile.get(entity)
    if (!tileData.isTarget) engine.removeEntity(entity)
  }
}

/*
 * Removes tile and game area entities from engine
 */
export const cleanupGameArea = () => {
  const tiles = engine.getEntitiesWith(Tile)
  for (const [entity] of tiles) {
    engine.removeEntity(entity)
  }

  const gameAreas = engine.getEntitiesWith(GameArea)
  for (const [entity] of gameAreas) {
    engine.removeEntity(entity)
  }
}
