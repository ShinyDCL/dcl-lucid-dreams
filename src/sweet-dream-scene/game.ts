import { Entity } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { GameArea } from './gameArea'
import { Vector3 } from '@dcl/sdk/math'
import { colors, sceneMiddle, yOffset } from '../common'
import { movePlayerTo } from '~system/RestrictedActions'
import { getRoundCount } from './gameConfiguration'
import { levelInfoLabelManager, messageLabelManager } from '../ui'

const startPlatformPosition = Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 14)
const gameAreaPosition = Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)

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
    movePlayerTo({ newRelativePosition: startPlatformPosition })
  }

  start = () => {
    this.gameActive = true
    this.gameArea.update(this.round)

    this.initializeRound()
    movePlayerTo({ newRelativePosition: gameAreaPosition })
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
    this.gameArea.playAudio()
    messageLabelManager.showLabel(`Ends in ${this.timer} seconds`, colors.blue)

    const timerId = utils.timers.setInterval(() => {
      if (this.timer <= 1) {
        utils.timers.clearInterval(timerId)
        messageLabelManager.hideLabel()
        this.gameArea.stopAudio()
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
      const message = 'Round lost!'
      messageLabelManager.showLabel(message, colors.red)
      utils.timers.setTimeout(() => {
        if (messageLabelManager.getMessage() === message) messageLabelManager.hideLabel()
      }, 3000)
      this.initialize()
    } else {
      movePlayerTo({ newRelativePosition: startPlatformPosition })
    }
  }
}
