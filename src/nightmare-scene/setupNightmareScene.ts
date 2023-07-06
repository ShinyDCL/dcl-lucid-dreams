import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { Game } from './game'
import {
  LevelComponent,
  levels,
  createSkyBox,
  skyBoxFolders,
  modelFolders,
  removeLevelScene,
  startNextLevel
} from '../common'

export const setupNightmareScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  LevelComponent.create(scene, { level: levels.first })

  const skyBox = createSkyBox(parent, skyBoxFolders.nightmare)
  LevelComponent.create(skyBox, { level: levels.first })

  const platform = engine.addEntity()
  GltfContainer.create(platform, { src: `${modelFolders.nightmare}/platform.glb` })
  Transform.create(platform, {
    position: Vector3.create(0, -2, 0),
    parent: scene
  })
  LevelComponent.create(platform, { level: levels.first })

  const nextLevelButton = engine.addEntity()
  GltfContainer.create(nextLevelButton, { src: `${modelFolders.nightmare}/nextLevelButton.glb` })
  Transform.create(nextLevelButton, {
    position: Vector3.create(0, 1.5, -5),
    parent: platform
  })
  LevelComponent.create(nextLevelButton, { level: levels.first })

  pointerEventsSystem.onPointerDown(
    { entity: nextLevelButton, opts: { button: InputAction.IA_POINTER, hoverText: `Next level!` } },
    () => {
      removeLevelScene(levels.first)
      startNextLevel(parent)
    }
  )

  new Game(platform).startGame()

  return scene
}
