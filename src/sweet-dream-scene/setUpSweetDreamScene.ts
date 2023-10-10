import { engine, Entity, GltfContainer, GltfContainerLoadingState, LoadingState, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { addInteraction, modelFolders } from '../common'
import { Game } from './game'

export const setUpSweetDreamScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })

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

      addInteraction(startButton, 'Start!', game.start)
      engine.removeSystem(checkIfLoaded)
    }
  }

  engine.addSystem(checkIfLoaded)

  return scene
}
