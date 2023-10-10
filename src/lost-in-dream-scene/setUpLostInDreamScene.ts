import { engine, Entity, GltfContainer, GltfContainerLoadingState, LoadingState, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { addInteraction, modelFolders } from '../common'
import { Game } from './game'

export const setUpLostInDreamScene = (parent: Entity, onClickNextLevelButton: () => void): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })

  const maze = engine.addEntity()
  Transform.create(maze, { position: Vector3.create(0, -2, 0), parent: scene })
  GltfContainer.create(maze, { src: `${modelFolders.lostInDream}/maze.glb` })

  const checkIfLoaded = () => {
    const loadingState = GltfContainerLoadingState.getOrNull(maze)
    if (loadingState?.currentState === LoadingState.FINISHED) {
      const game = new Game(maze, () => showNextLevelButton(maze, onClickNextLevelButton))
      game.startGame()
      engine.removeSystem(checkIfLoaded)
    }
  }

  engine.addSystem(checkIfLoaded)

  return scene
}

const showNextLevelButton = (parent: Entity, onClickNextLevelButton: () => void) => {
  const nextLevelButton = engine.addEntity()
  GltfContainer.create(nextLevelButton, { src: `${modelFolders.lostInDream}/nextLevelButton.glb` })
  Transform.create(nextLevelButton, {
    position: Vector3.create(-15.4, 1.5, 0),
    rotation: Quaternion.fromEulerDegrees(0, 90, 0),
    parent
  })

  addInteraction(nextLevelButton, 'Next level!', onClickNextLevelButton)
}
