import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { createSkyBox } from '../skyBox'
import { Vector3 } from '@dcl/sdk/math'
import { nightmareModels, sceneMiddle, yOffset } from '../resources'
import { movePlayerTo } from '~system/RestrictedActions'
import { startGame } from './game'

const gameAreaPosition = Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle)

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

  startGame(platform)

  movePlayerTo({ newRelativePosition: gameAreaPosition })

  return scene
}
