import {
  Entity,
  GltfContainer,
  GltfContainerLoadingState,
  InputAction,
  LoadingState,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { Game } from './game'
import { createSkyBox, modelFolders, skyBoxFolders } from '../common'

export const setupSweetDreamScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })

  createSkyBox(scene, skyBoxFolders.sweetDream)

  const startPlatform = engine.addEntity()
  GltfContainer.create(startPlatform, { src: `${modelFolders.sweetDream}/cloudPlatform.glb` })
  Transform.create(startPlatform, {
    position: Vector3.create(0, -2.2, -14),
    parent: scene
  })

  const startButton = engine.addEntity()
  GltfContainer.create(startButton, { src: `${modelFolders.sweetDream}/startButton.glb` })
  Transform.create(startButton, {
    position: Vector3.create(0, -0.8, -12),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    parent: scene
  })

  const checkIfLoaded = () => {
    const loadingState = GltfContainerLoadingState.getOrNull(startPlatform)
    if (loadingState?.currentState === LoadingState.FINISHED) {
      const game = new Game(scene)
      game.initialize()

      pointerEventsSystem.onPointerDown(
        { entity: startButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Start!' } },
        () => game.start()
      )
      engine.removeSystem(checkIfLoaded)
    }
  }

  engine.addSystem(checkIfLoaded)

  return scene
}
