import { Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { sceneMiddle, yOffset } from '../common'
import { leverAndDoorTransforms } from './config'
import { Door } from './door'
import { Lever } from './lever'
import { levelInfoLabelManager } from '../ui'
import { movePlayerTo } from '~system/RestrictedActions'

export class Game {
  doorsOpened: number = 0
  maxDoors: number

  constructor(parent: Entity, onGameCompleted: () => void) {
    this.maxDoors = leverAndDoorTransforms.length

    leverAndDoorTransforms.forEach((transform, index) => {
      const door = new Door(parent, transform.door)
      const lever = new Lever(parent, transform.lever)

      lever.setOnClick(`Open door ${index + 1}`, () => {
        door.playAnimation()
        this.doorsOpened++
        levelInfoLabelManager.showLabel(`Doors opened ${this.doorsOpened}/${this.maxDoors}`)
        if (this.doorsOpened === this.maxDoors) onGameCompleted()
      })
    })
  }

  startGame = () => {
    movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle) })
    levelInfoLabelManager.showLabel(`Doors opened ${this.doorsOpened}/${this.maxDoors}`)
  }
}
