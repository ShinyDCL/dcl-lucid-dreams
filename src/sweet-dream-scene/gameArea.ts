import * as utils from '@dcl-sdk/utils'
import { AudioSource, engine, Entity, GltfContainer, MeshCollider, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { getRandomInt, modelFolders, playSound, sceneMiddle, sceneSize, sounds, stopSound } from '../common'
import { getGameConfiguration } from './gameConfiguration'
import { colorEnums, symbolEnums, Tile, TileColor, tileSize, TileSymbol } from './tile'
import { getItemsWithProbabilities, getRandomItem } from './utils'

export class GameArea {
  private gameAreaEntity: Entity
  private displayTile: Tile
  private tiles: Tile[][]
  private floorCollider: Entity
  private size: number

  constructor(parent: Entity, size: number, onTriggerEnter: () => void) {
    const floorSize = tileSize * size
    const floorMiddle = floorSize / 2 - tileSize / 2

    const gameArea = engine.addEntity()
    Transform.create(gameArea, { position: Vector3.create(-floorMiddle, -2.2, -floorMiddle), parent })
    this.gameAreaEntity = gameArea

    AudioSource.create(gameArea, {
      audioClipUrl: sounds.countdown,
      loop: true,
      playing: false
    })

    this.floorCollider = this.addFloorCollider(gameArea, size, floorMiddle)
    this.addWallCollider(gameArea, size, floorMiddle)
    this.addTriggerLayer(onTriggerEnter)

    // Game area from n x n tiles
    this.tiles = []
    for (let i = 0; i < size; i++) {
      this.tiles[i] = []
      for (let j = 0; j < size; j++) {
        this.tiles[i][j] = new Tile(gameArea, { position: Vector3.create(i * tileSize, 0, j * tileSize) })
      }
    }

    // Tile displaying target color (and symbol) in front of game area
    this.displayTile = new Tile(gameArea, {
      position: Vector3.create(floorMiddle, 3, floorSize + 2),
      rotation: Quaternion.fromEulerDegrees(-90, 0, 0),
      scale: Vector3.create(2, 2, 2)
    })

    this.size = size
  }

  /*
   * Updates game area from tiles based on current round configuration
   */
  update = (round: number) => {
    const config = getGameConfiguration(round)
    const { hasSymbol, targetColorProbability, targetSymbolProbability } = config

    const targetColor = colorEnums[getRandomInt(colorEnums.length)]
    const colorsWithProbabilities = getItemsWithProbabilities<TileColor>(
      colorEnums,
      targetColor,
      targetColorProbability
    )

    const targetSymbol = symbolEnums[getRandomInt(symbolEnums.length)]
    const symbolsWithProbabilities = getItemsWithProbabilities<TileSymbol>(
      symbolEnums,
      targetSymbol,
      targetSymbolProbability
    )

    const targetCoords: [number, number] = [getRandomInt(this.tiles.length), getRandomInt(this.tiles.length)]

    this.tiles.forEach((row, i) => {
      row.forEach((tile, j) => {
        if (targetCoords[0] === i && targetCoords[0] === j) {
          tile.updateTile(true, targetColor, hasSymbol ? targetSymbol : undefined)
        } else {
          const color = getRandomItem<TileColor>(colorsWithProbabilities)
          const symbol = hasSymbol ? getRandomItem<TileSymbol>(symbolsWithProbabilities) : undefined
          const isTargetTile = color === targetColor && (!hasSymbol || symbol === targetSymbol)
          tile.updateTile(isTargetTile, color, symbol)
        }
      })
    })

    this.displayTile.updateTile(true, targetColor, hasSymbol ? targetSymbol : undefined)
  }
  /*
   * Adds collider walls to game area based on current game size
   */
  addWallCollider = (parent: Entity, size: number, floorMiddle: number) => {
    const wallCollider = engine.addEntity()
    GltfContainer.create(wallCollider, { src: `${modelFolders.sweetDream}/gameAreaCollider.glb` })
    Transform.create(wallCollider, {
      position: Vector3.create(floorMiddle, 0, floorMiddle),
      scale: Vector3.create(size, 1, size),
      parent
    })
  }

  /*
   * Adds collider floor to game area based on current game size
   */
  addFloorCollider = (parent: Entity, size: number, floorMiddle: number): Entity => {
    const floorCollider = engine.addEntity()
    MeshCollider.setPlane(floorCollider)
    Transform.create(floorCollider, {
      position: Vector3.create(floorMiddle, 0.192, floorMiddle),
      rotation: Quaternion.fromEulerDegrees(90, 0, 0),
      scale: Vector3.create(size * tileSize, size * tileSize, 1),
      parent
    })
    return floorCollider
  }

  hideFloorCollider = () => MeshCollider.deleteFrom(this.floorCollider)
  showFloorCollider = () => MeshCollider.setPlane(this.floorCollider)

  /*
   * Removes non-target tiles from engine
   */
  hideNonTargetTiles = () => {
    this.tiles.forEach((row) => {
      row.forEach((tile) => !tile.isTarget() && tile.hideTile())
    })
  }

  addTriggerLayer = (onTriggerEnter: () => void) => {
    // Create a box with disabled collision
    const triggerEntity = engine.addEntity()
    Transform.create(triggerEntity)

    utils.triggers.addTrigger(
      triggerEntity,
      utils.NO_LAYERS,
      utils.LAYER_1,
      [
        {
          type: 'box',
          position: { x: sceneMiddle, y: sceneMiddle / 2 - 4, z: sceneMiddle },
          scale: { x: sceneSize, y: sceneMiddle, z: sceneSize }
        }
      ],
      onTriggerEnter
    )
  }

  playCountdownSound = () => playSound(this.gameAreaEntity)
  stopCountdownSound = () => stopSound(this.gameAreaEntity)
}
