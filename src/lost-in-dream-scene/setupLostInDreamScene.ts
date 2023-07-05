import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { createSkyBox } from '../skyBox'
import { Vector3 } from '@dcl/sdk/math'
import { lostInDreamModels, sceneMiddle, secondLevel, yOffset } from '../resources'
import { LevelComponent } from '../common'
import { movePlayerTo } from '~system/RestrictedActions'

export const setupLostInDreamScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  LevelComponent.create(scene, { level: secondLevel })

  const skyBox = createSkyBox(parent, 'lost-in-dream')
  LevelComponent.create(skyBox, { level: secondLevel })

  const platform = engine.addEntity()
  GltfContainer.create(platform, { src: `${lostInDreamModels}/platform.glb` })
  Transform.create(platform, {
    position: Vector3.create(0, -2, 0),
    parent: scene
  })
  LevelComponent.create(platform, { level: secondLevel })

  movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle) })
  return scene
}
