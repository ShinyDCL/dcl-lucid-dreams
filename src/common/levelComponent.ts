import { Schemas, engine } from '@dcl/sdk/ecs'

// Track all entities added to current level scene
export const LevelComponent = engine.defineComponent('levelComponent', { level: Schemas.Int })
