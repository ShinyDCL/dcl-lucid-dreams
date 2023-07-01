import { Entity, Font, GltfContainer, TextShape, Transform, engine } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { nightmareModels } from '../resources'

export const tileSize = 0.4

export const createTile = (parent: Entity, position: Vector3.MutableVector3, text: string) => {
  const letterOffsetZ = -0.04

  const tile = engine.addEntity()
  GltfContainer.create(tile, { src: `${nightmareModels}/tile.glb` })
  Transform.create(tile, { position, parent })

  const letter = engine.addEntity(true)
  TextShape.create(letter, {
    text,
    fontSize: 3,
    font: Font.F_SANS_SERIF
  })
  Transform.create(letter, {
    position: Vector3.create(0, 0, letterOffsetZ),
    parent: tile
  })
}
