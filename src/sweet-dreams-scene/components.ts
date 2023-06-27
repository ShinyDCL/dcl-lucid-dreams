import { Schemas, engine } from '@dcl/sdk/ecs'

// Track all game area tiles
export const Tile = engine.defineComponent('tile', { isTarget: Schemas.Boolean })

// Track game area
export const GameArea = engine.defineComponent('gameArea', {})

// Track all entities added to sweet dreams scene
export const SweetDreamsComponent = engine.defineComponent('sweetDreamsComponent', {})
