import { Entity, GltfContainer, InputAction, Transform, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { createSkyBox } from '../skyBox'
import { Vector3 } from '@dcl/sdk/math'
import { firstLevel, nightmareModels } from '../resources'
import { Game } from './game'
import { LevelComponent } from '../common'
import { removeLevelComponents } from '../common/removeLevelScene'

export const setupNightmareScene = (parent: Entity): Entity => {
  const scene = engine.addEntity()
  Transform.create(scene, { parent })
  LevelComponent.create(scene, { level: firstLevel })

  const skyBox = createSkyBox(parent, 'nightmare')
  LevelComponent.create(skyBox, { level: firstLevel })

  const platform = engine.addEntity()
  GltfContainer.create(platform, { src: `${nightmareModels}/platform.glb` })
  Transform.create(platform, {
    position: Vector3.create(0, -2, 0),
    parent: scene
  })
  LevelComponent.create(platform, { level: firstLevel })

  const nextLevelButton = engine.addEntity()
  GltfContainer.create(nextLevelButton, { src: `${nightmareModels}/nextLevelButton.glb` })
  Transform.create(nextLevelButton, {
    position: Vector3.create(0, 1.5, -5),
    parent: platform
  })
  LevelComponent.create(nextLevelButton, { level: firstLevel })

  pointerEventsSystem.onPointerDown(
    { entity: nextLevelButton, opts: { button: InputAction.IA_POINTER, hoverText: `Next level!` } },
    () => {
      removeLevelComponents(firstLevel)
    }
  )

  new Game(platform).startGame()

  return scene
}
