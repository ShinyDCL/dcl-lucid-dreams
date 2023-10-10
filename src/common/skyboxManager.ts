import { engine, Entity, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

import { sceneMiddle, skyBoxFolders, yOffset } from './resources'
import { createSkyBox } from './skyBox'
import { showEntity } from './utils'

const skyboxFolders = Object.values(skyBoxFolders)

export class SkyboxManager {
  private skyboxes: Entity[] = []

  constructor() {
    const parent = engine.addEntity()
    Transform.create(parent, {
      position: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
    })

    // Create all of the skyboxes
    skyboxFolders.forEach((folder) => {
      this.skyboxes.push(createSkyBox(parent, folder.toString()))
    })
  }

  show = (index: number): Entity => {
    showEntity(this.skyboxes[index])
    return this.skyboxes[index]
  }
}

export const skyboxManager = new SkyboxManager()
