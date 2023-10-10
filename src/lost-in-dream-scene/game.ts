import { movePlayerTo } from '~system/RestrictedActions'

import * as utils from '@dcl-sdk/utils'
import { Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import { colors, sceneMiddle, yOffset } from '../common'
import { levelInfoLabelManager, messageLabelManager } from '../ui'
import { leverAndDoorTransforms } from './config'
import { Door } from './door'
import { Lever } from './lever'

export class Game {
  private doorsOpened: number = 0
  private maxDoors: number

  constructor(parent: Entity, onGameCompleted: () => void) {
    this.maxDoors = leverAndDoorTransforms.length

    leverAndDoorTransforms.forEach((transform, index) => {
      const door = new Door(parent, transform.door)
      const lever = new Lever(parent, transform.lever)

      lever.addOnClick(`Open door ${index + 1}`, () => {
        door.open()
        this.doorsOpened++
        levelInfoLabelManager.showLabel(`Doors opened ${this.doorsOpened}/${this.maxDoors}`)
        if (this.doorsOpened === this.maxDoors) onGameCompleted()
      })
    })
  }

  startGame = () => {
    movePlayerTo({
      newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle),
      cameraTarget: Vector3.create(sceneMiddle, sceneMiddle + yOffset + 1, sceneMiddle - 4)
    })
    levelInfoLabelManager.showLabel(`Doors opened ${this.doorsOpened}/${this.maxDoors}`)
    messageLabelManager.showLabel('Find your way ot of the maze to get to the next level!', colors.black)
    utils.timers.setTimeout(() => messageLabelManager.hideLabel(), 5000)
  }
}
