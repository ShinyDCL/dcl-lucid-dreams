import { Transform, engine } from '@dcl/sdk/ecs'
import { sceneMiddle, yOffset } from './resources'
import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { setupSweetDreamsScene } from './sweet-dreams-scene'

export function main() {
  const scene = engine.addEntity()
  Transform.create(scene, {
    position: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
  })

  setupSweetDreamsScene(scene)
  setupUi()
}
