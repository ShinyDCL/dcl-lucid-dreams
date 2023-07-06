import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { createSkyBox } from '../skyBox'
import { levels, modelFolders, skyBoxFolders } from '../resources'
import { LevelComponent } from '../common'
import { Game } from './game'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

export const setupLostInDreamScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  LevelComponent.create(scene, { level: levels.second })

  const skyBox = createSkyBox(parent, skyBoxFolders.lostInDream)
  LevelComponent.create(skyBox, { level: levels.second })

  const maze = engine.addEntity()
  GltfContainer.create(maze, { src: `${modelFolders.lostInDream}/maze.glb` })
  Transform.create(maze, { position: Vector3.create(0, -2, 0), parent })
  LevelComponent.create(maze, { level: levels.second })

  const game = new Game(maze, () => showNextLevelButton(maze, () => {}))
  game.startGame()

  return scene
}

const showNextLevelButton = (parent: Entity, onClick: () => void) => {
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
    onClick
  )
}
