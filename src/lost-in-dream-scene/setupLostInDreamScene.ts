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
import { Game } from './game'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { LevelComponent, levels, createSkyBox, skyBoxFolders, modelFolders } from '../common'

export const setupLostInDreamScene = (parent: Entity, onClickNextLevelButton: () => void): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  LevelComponent.create(scene, { level: levels.second })

  const skyBox = createSkyBox(parent, skyBoxFolders.lostInDream)
  LevelComponent.create(skyBox, { level: levels.second })

  const maze = engine.addEntity()
  Transform.create(maze, { position: Vector3.create(0, -2, 0), parent })
  LevelComponent.create(maze, { level: levels.second })
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
  LevelComponent.create(nextLevelButton, { level: levels.second })

  pointerEventsSystem.onPointerDown(
    { entity: nextLevelButton, opts: { button: InputAction.IA_POINTER, hoverText: 'Next level!' } },
    onClickNextLevelButton
  )
}
