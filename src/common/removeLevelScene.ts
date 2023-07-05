import { engine } from '@dcl/sdk/ecs'
import { LevelComponent } from './levelComponent'

export const removeLevelScene = (level: number) => {
  for (const [entity] of engine.getEntitiesWith(LevelComponent)) {
    const levelData = LevelComponent.getOrNull(entity)
    if (levelData?.level === level) engine.removeEntity(entity)
  }
}
