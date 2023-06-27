import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { sceneMiddle, sweetDreamsModels, yOffset } from '../resources'
import { SweetDreamsComponent } from './components'
import { createSkyBox } from '../skyBox'
import { movePlayerTo } from '~system/RestrictedActions'
import { initializeGameArea, initializeRound } from './game'

export const setupSweetDreamsScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  SweetDreamsComponent.create(scene)

  const skyBox = createSkyBox(parent, 'sweet-dreams')
  SweetDreamsComponent.create(skyBox)

  const startPlatform = engine.addEntity()
  GltfContainer.create(startPlatform, { src: `${sweetDreamsModels}/cloudPlatform.glb` })
  Transform.create(startPlatform, {
    position: Vector3.create(0, -1, -14),
    parent: scene
  })
  SweetDreamsComponent.create(startPlatform)

  /*const stars = engine.addEntity()
  GltfContainer.create(stars, { src: `${sweetDreamsModels}/stars.glb` })
  Transform.create(stars, {
    position: Vector3.create(0, -1, 0),
    parent: scene
  })
  SweetDreamsComponent.create(stars)*/

  const startButton = engine.addEntity()
  GltfContainer.create(startButton, { src: `${sweetDreamsModels}/startButton.glb` })
  Transform.create(startButton, {
    position: Vector3.create(0, 0.5, -12),
    rotation: Quaternion.fromEulerDegrees(90, 180, 0),
    parent: scene
  })
  pointerEventsSystem.onPointerDown(
    {
      entity: startButton,
      opts: { button: InputAction.IA_POINTER, hoverText: 'Start!' }
    },
    () => {
      movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle) })
      initializeRound(scene)
    }
  )
  SweetDreamsComponent.create(startButton)

  initializeGameArea(scene)

  movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle - 14) })

  return scene
}
