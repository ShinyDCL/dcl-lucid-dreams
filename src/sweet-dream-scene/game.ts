import { movePlayerTo, MovePlayerToRequest } from '~system/RestrictedActions'

import * as utils from '@dcl-sdk/utils'
import { Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import { colors, sceneMiddle, yOffset } from '../common'
import { levelInfoLabelManager, messageLabelManager } from '../ui'
import { GameArea } from './gameArea'
import { getRoundCount } from './gameConfiguration'

const startPlatformPosition: MovePlayerToRequest = {
  newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 14),
  cameraTarget: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 10)
}

const gameAreaPosition: MovePlayerToRequest = {
  newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
}

export class Game {
  private readonly roundPreparationTime = 3
  private readonly roundTime = 3

  private round: number = 0
  private timer: number = this.roundPreparationTime
  private gameActive: boolean = false
  private roundActive: boolean = false
  private gameArea: GameArea

  constructor(parent: Entity) {
    this.gameArea = new GameArea(parent, 8, this.onTriggerEnter)
    this.gameArea.update(this.round)
  }

  initialize = () => {
    levelInfoLabelManager.showLabel(`Completed rounds ${this.round}/${getRoundCount()}`)
    movePlayerTo(startPlatformPosition)
  }

  start = () => {
    this.gameActive = true
    this.initializeRound()
    movePlayerTo(gameAreaPosition)
  }

  initializeRound = () => {
    this.timer = this.roundPreparationTime
    messageLabelManager.showLabel(`Round starts in ${this.timer} seconds`)

    const timerId = utils.timers.setInterval(() => {
      if (this.timer <= 1) {
        utils.timers.clearInterval(timerId)
        messageLabelManager.hideLabel()
        this.startRound()
      } else {
        this.timer--
        messageLabelManager.showLabel(`Round starts in ${this.timer} seconds`)
      }
    }, 1000)
  }

  startRound = () => {
    this.roundActive = true
    this.timer = this.roundTime
    this.gameArea.update(this.round)
    this.gameArea.playCountdownSound()
    messageLabelManager.showLabel(`Ends in ${this.timer} seconds`, colors.blue)

    const timerId = utils.timers.setInterval(() => {
      if (this.timer <= 1) {
        utils.timers.clearInterval(timerId)
        messageLabelManager.hideLabel()
        this.gameArea.stopCountdownSound()
        this.finishRound()
      } else {
        this.timer--
        messageLabelManager.showLabel(`Ends in ${this.timer} seconds`, colors.blue)
      }
    }, 1000)
  }

  finishRound = () => {
    this.gameArea.hideFloorCollider()
    this.gameArea.hideNonTargetTiles()
    utils.timers.setTimeout(() => this.gameArea.showFloorCollider(), 1000)

    utils.timers.setTimeout(() => {
      if (!this.roundActive) return

      this.round++
      levelInfoLabelManager.showLabel(`Completed rounds ${this.round}/${getRoundCount()}`)
      if (this.round === getRoundCount()) {
        messageLabelManager.showLabel('All levels completed, you can now leave the scene!', colors.pink)
      } else {
        this.roundActive = false
        this.initializeRound()
      }
    }, 2000)
  }

  onTriggerEnter = () => {
    if (this.gameActive && this.roundActive) {
      this.roundActive = false
      this.gameActive = false
      this.gameArea.showFloorCollider()
      const message = 'Round lost!'
      messageLabelManager.showLabel(message, colors.red)
      utils.timers.setTimeout(() => {
        if (messageLabelManager.getMessage() === message) messageLabelManager.hideLabel()
      }, 3000)
    }
    movePlayerTo(startPlatformPosition)
  }
}
