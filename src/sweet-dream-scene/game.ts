import { Entity, Transform, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { messageLabelManager } from '../ui'
import { GameArea, Tile } from './components'
import { createGameArea } from './gameArea'
import { gameManager } from './gameManager'
import { Color3, Vector3 } from '@dcl/sdk/math'
import { sceneMiddle, sceneSize, yOffset } from '../resources'
import { movePlayerTo } from '~system/RestrictedActions'
import { getRoundCount } from './gameConfiguration'

export const initializeGameArea = (parent: Entity) => {
  cleanup()
  gameManager.initializeGame()
  createGameArea(gameManager.getRound(), parent)
  createTriggerLayer()
}

export const initializeRound = (parent: Entity) => {
  gameManager.initializeRound()
  messageLabelManager.showLabel(`Round starts in ${gameManager.getTimer()} seconds`)

  const timerId = utils.timers.setInterval(() => {
    if (gameManager.getTimer() < 1) {
      utils.timers.clearInterval(timerId)
      messageLabelManager.hideLabel()
      startRound(parent)
    } else {
      gameManager.decreaseTimer()
      messageLabelManager.updateLabel(`Round starts in ${gameManager.getTimer()} seconds`)
    }
  }, 1000)
}

export const startRound = (parent: Entity) => {
  cleanup()
  createGameArea(gameManager.getRound(), parent)
  gameManager.startRound()
  messageLabelManager.showLabel(`Ends in ${gameManager.getTimer()} seconds`)

  const timerId = utils.timers.setInterval(() => {
    if (gameManager.getTimer() < 1) {
      utils.timers.clearInterval(timerId)
      messageLabelManager.hideLabel()
      finishRound(parent)
    } else {
      gameManager.decreaseTimer()
      messageLabelManager.updateLabel(`Ends in ${gameManager.getTimer()} seconds`)
    }
  }, 1000)
}

export const finishRound = (parent: Entity) => {
  const tileEntities = engine.getEntitiesWith(Tile)
  for (const [entity] of tileEntities) {
    const tileData = Tile.get(entity)
    if (!tileData.isTarget) engine.removeEntity(entity)
  }
  utils.timers.setTimeout(() => {
    if (!gameManager.isActive()) {
      cleanup()
      createGameArea(gameManager.getRound(), parent)
      return
    }

    gameManager.finishRound()
    console.log(getRoundCount())
    console.log(gameManager.getRound())
    if (gameManager.getRound() === getRoundCount()) {
      messageLabelManager.showLabel(`Game finished!`)
    } else {
      initializeRound(parent)
    }
  }, 1000)
}

export const cleanup = () => {
  const tiles = engine.getEntitiesWith(Tile)
  for (const [entity] of tiles) {
    engine.removeEntity(entity)
  }

  const gameAreas = engine.getEntitiesWith(GameArea)
  for (const [entity] of gameAreas) {
    engine.removeEntity(entity)
  }
}

export const createTriggerLayer = () => {
  utils.triggers.enableDebugDraw(true)
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
        position: { x: sceneMiddle, y: sceneMiddle / 2 - 5, z: sceneMiddle },
        scale: { x: sceneSize, y: sceneMiddle, z: sceneSize }
      }
    ],
    () => {
      messageLabelManager.showLabel(`Game lost!`)
      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()
      }, 3000)
      movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 14) })
      gameManager.stopGame()
    },
    undefined,
    Color3.Red()
  )
}
