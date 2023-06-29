import { Entity, Transform, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { createGameArea, removeNonTargetTiles } from './gameArea'
import { gameManager } from './gameManager'
import { Color3, Vector3 } from '@dcl/sdk/math'
import { sceneMiddle, sceneSize, yOffset } from '../resources'
import { movePlayerTo } from '~system/RestrictedActions'
import { getRoundCount } from './gameConfiguration'
import { levelInfoLabelManager, messageLabelManager } from '../ui'

const startPlatformPosition = Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 14)
const gameAreaPosition = Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)

export const setupGame = (parent: Entity) => {
  createTriggerLayer(parent)
  createGameArea(gameManager.getRound(), parent)
  initializeGame()
}

export const initializeGame = () => {
  gameManager.initializeGame()
  levelInfoLabelManager.showLabel(`Round ${gameManager.getRound() + 1}/${getRoundCount()}`)
  movePlayerTo({ newRelativePosition: startPlatformPosition })
}

export const startGame = (parent: Entity) => {
  gameManager.startGame()
  createGameArea(gameManager.getRound(), parent)
  initializeRound(parent)
  movePlayerTo({ newRelativePosition: gameAreaPosition })
}

export const initializeRound = (parent: Entity) => {
  gameManager.initializeRound()
  levelInfoLabelManager.showLabel(`Round ${gameManager.getRound() + 1}/${getRoundCount()}`)
  messageLabelManager.showLabel(`Round starts in ${gameManager.getTimer()} seconds`)

  const timerId = utils.timers.setInterval(() => {
    if (gameManager.getTimer() < 1) {
      utils.timers.clearInterval(timerId)
      messageLabelManager.hideLabel()
      startRound(parent)
    } else {
      gameManager.decreaseTimer()
      messageLabelManager.showLabel(`Round starts in ${gameManager.getTimer()} seconds`)
    }
  }, 1000)
}

export const startRound = (parent: Entity) => {
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
      messageLabelManager.showLabel(`Ends in ${gameManager.getTimer()} seconds`)
    }
  }, 1000)
}

export const finishRound = (parent: Entity) => {
  removeNonTargetTiles()
  utils.timers.setTimeout(() => {
    if (!gameManager.isRoundActive()) return
    if (gameManager.getRound() === getRoundCount() - 1) {
      messageLabelManager.showLabel(`Game finished!`)
    } else {
      gameManager.finishRound()
      initializeRound(parent)
    }
  }, 1000)
}

export const createTriggerLayer = (parent: Entity) => {
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
        position: { x: sceneMiddle, y: sceneMiddle / 2 - 3, z: sceneMiddle },
        scale: { x: sceneSize, y: sceneMiddle, z: sceneSize }
      }
    ],
    () => {
      if (gameManager.isGameActive()) {
        if (gameManager.isRoundActive()) {
          gameManager.finishGame()
          messageLabelManager.showLabel(`Game lost!`)
          utils.timers.setTimeout(() => {
            messageLabelManager.hideLabel()
          }, 3000)
          initializeGame()
        } else {
          createGameArea(gameManager.getRound(), parent)
          movePlayerTo({ newRelativePosition: gameAreaPosition })
        }
      } else {
        movePlayerTo({ newRelativePosition: startPlatformPosition })
      }
    },
    undefined
  )
}
