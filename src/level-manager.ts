import { Entity, engine } from '@dcl/sdk/ecs'
import { LevelComponent } from './common'
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
      setupNightmareScene(parent, () => this.finishLevel(parent))
    }
    if (this.currentLevel === 2) {
      setupLostInDreamScene(parent, () => this.finishLevel(parent))
    }
    if (this.currentLevel === 3) {
      setupSweetDreamScene(parent)
    }
  }

  finishLevel = (parent: Entity) => {
    this.removeLevelScene(this.currentLevel)
    this.currentLevel++
    this.startCurrentLevel(parent)
  }

  removeLevelScene = (level: number) => {
    for (const [entity] of engine.getEntitiesWith(LevelComponent)) {
      const levelData = LevelComponent.getOrNull(entity)
      if (levelData?.level === level) engine.removeEntity(entity)
    }
    messageLabelManager.hideLabel()
  }
}

export const levelManager = new LevelManager()
