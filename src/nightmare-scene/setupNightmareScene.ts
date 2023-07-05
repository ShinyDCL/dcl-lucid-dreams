import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { createSkyBox } from '../skyBox'
import { Vector3 } from '@dcl/sdk/math'
import { nightmareModels } from '../resources'
import { Game } from './game'

export const setupNightmareScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })

  createSkyBox(parent, 'nightmare')

  const platform = engine.addEntity()
  GltfContainer.create(platform, { src: `${nightmareModels}/platform.glb` })
  Transform.create(platform, {
    position: Vector3.create(0, -2, 0),
    parent: scene
  })

  new Game(platform).startGame()

  return scene
}
