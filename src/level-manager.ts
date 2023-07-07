import { Entity, engine, removeEntityWithChildren } from '@dcl/sdk/ecs'
import { setupNightmareScene } from './nightmare-scene'
import { setupSweetDreamScene } from './sweet-dream-scene'
import { setupLostInDreamScene } from './lost-in-dream-scene'
import { messageLabelManager } from './ui'

const levels = ['Level 1 - Nightmare', 'Level 2 - Lost in a dream', 'Level 3 - Sweet dream']

class LevelManager {
  private currentLevel: number = 1

  getCurrentLevel = (): string => levels[this.currentLevel - 1]

  startCurrentLevel = (parent: Entity) => {
    if (this.currentLevel === 1) {
      const sceneParent = setupNightmareScene(parent, () => this.finishLevel(parent, sceneParent))
    }
    if (this.currentLevel === 2) {
      const sceneParent = setupLostInDreamScene(parent, () => this.finishLevel(parent, sceneParent))
    }
    if (this.currentLevel === 3) {
      setupSweetDreamScene(parent)
    }
  }

  finishLevel = (parent: Entity, sceneParent: Entity) => {
    removeEntityWithChildren(engine, sceneParent)
    messageLabelManager.hideLabel()
    this.currentLevel++
    this.startCurrentLevel(parent)
  }
}

export const levelManager = new LevelManager()
