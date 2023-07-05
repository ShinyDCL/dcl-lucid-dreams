import { Transform, engine } from '@dcl/sdk/ecs'
import { sceneMiddle, yOffset } from './resources'
import { Vector3 } from '@dcl/sdk/math'
import { setupUi } from './ui'
import { setupLostInDreamScene } from './lost-in-dream-scene'
import { setupNightmareScene } from './nightmare-scene'

export function main() {
  const scene = engine.addEntity()
  Transform.create(scene, {
    position: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)
  })

  setupLostInDreamScene(scene)
  //setupNightmareScene(scene)
  // setupSweetDreamScene(scene)
  setupUi()
}
