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
import { createSkyBox, skyBoxFolders, modelFolders } from '../common'

export const setupNightmareScene = (parent: Entity, onClickNextLevelButton: () => void): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })

  createSkyBox(scene, skyBoxFolders.nightmare)

  const platform = engine.addEntity()
  GltfContainer.create(platform, { src: `${modelFolders.nightmare}/platform.glb` })
  Transform.create(platform, {
    position: Vector3.create(0, -2, 0),
    parent: scene
  })

  const checkIfLoaded = () => {
    const loadingState = GltfContainerLoadingState.getOrNull(platform)
    if (loadingState?.currentState === LoadingState.FINISHED) {
      const game = new Game(platform, () => showNextLevelButton(platform, onClickNextLevelButton))
      game.startGame()
      engine.removeSystem(checkIfLoaded)
    }
  }

  engine.addSystem(checkIfLoaded)

  return scene
}

const showNextLevelButton = (parent: Entity, onClickNextLevelButton: () => void) => {
  const nextLevelButton = engine.addEntity()
  GltfContainer.create(nextLevelButton, { src: `${modelFolders.nightmare}/nextLevelButton.glb` })
  Transform.create(nextLevelButton, {
    position: Vector3.create(0, 1.5, 3.7),
    rotation: Quaternion.fromEulerDegrees(0, 180, 0),
    parent
  })

  pointerEventsSystem.onPointerDown(
    { entity: nextLevelButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Next level!' } },
    onClickNextLevelButton
  )
}
