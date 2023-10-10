import { engine, Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import { sceneMiddle, skyboxManager, yOffset } from './common'
import { setUpLostInDreamScene } from './lost-in-dream-scene'
import { setUpNightmareScene } from './nightmare-scene'
import { setUpSweetDreamScene } from './sweet-dream-scene'
import { messageLabelManager } from './ui'

const levels = ['Level 1 - Nightmare', 'Level 2 - Lost in a dream', 'Level 3 - Sweet dream']

class LevelManager {
  private currentLevel: number = 0
  private currentScene: Entity
  private currentSkybox: Entity
  private parent: Entity

  constructor() {
    this.parent = engine.addEntity()
    Transform.create(this.parent, {
      position: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
    })

    this.currentScene = engine.addEntity()
    this.currentSkybox = engine.addEntity()
  }

  getCurrentLevel = (): string => levels[this.currentLevel]

  startCurrentLevel = () => {
    switch (this.currentLevel) {
      case 0:
        this.currentScene = setUpNightmareScene(this.parent, this.finishLevel)
        break
      case 1:
        this.currentScene = setUpLostInDreamScene(this.parent, this.finishLevel)
        break
      case 2:
        this.currentScene = setUpSweetDreamScene(this.parent)
        break
      default:
        this.currentScene = setUpNightmareScene(this.parent, this.finishLevel)
    }

    this.currentSkybox = skyboxManager.show(this.currentLevel)
  }

  finishLevel = () => {
    // Cleanup scene from current level
    engine.removeEntityWithChildren(this.currentScene)
    engine.removeEntityWithChildren(this.currentSkybox)
    messageLabelManager.hideLabel()

    // Start next level
    this.currentLevel++
    this.startCurrentLevel()
  }
}

export const levelManager = new LevelManager()
