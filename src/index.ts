import { Transform, engine } from '@dcl/sdk/ecs'
import { sceneMiddle, yOffset } from './common'
import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { levelManager } from './level-manager'

export function main() {
  const scene = engine.addEntity()
  Transform.create(scene, {
    position: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
  })

  setupUi()
  levelManager.startCurrentLevel(scene)
}
