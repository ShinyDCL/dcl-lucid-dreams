import {
  Entity,
  Font,
  GltfContainer,
  InputAction,
  TextShape,
  Transform,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { nightmareModels } from '../resources'

export interface TileWithLetter {
  tileEntity: Entity
  letterEntity: Entity
  letter: string
}

export const tileSize = 0.4

export const createTile = (
  parent: Entity,
  position: Vector3.MutableVector3,
  letter: string,
  onClick?: (tileWithLetter: TileWithLetter) => void
): TileWithLetter => {
  const letterOffsetZ = -0.04

  const tile = engine.addEntity()
  GltfContainer.create(tile, { src: `${nightmareModels}/tile.glb` })
  Transform.create(tile, { position, parent })

  const tileLetter = engine.addEntity(true)
  TextShape.create(tileLetter, {
    text: letter,
    fontSize: 3,
    font: Font.F_SANS_SERIF
  })
  Transform.create(tileLetter, {
    position: Vector3.create(0, 0, letterOffsetZ),
    parent: tile
  })

  const tileWithLetter: TileWithLetter = { tileEntity: tile, letterEntity: tileLetter, letter }

  if (onClick) {
    pointerEventsSystem.onPointerDown(
      { entity: tile, opts: { button: InputAction.IA_POINTER, hoverText: `Select ${letter}!` } },
      () => onClick(tileWithLetter)
    )
  }

  return tileWithLetter
}

export const revealTiles = (tilesWithLetters: TileWithLetter[]) => {
  tilesWithLetters.forEach(({ letterEntity, letter }) => {
    const tileTextShape = TextShape.getMutableOrNull(letterEntity)
    if (tileTextShape) {
      tileTextShape.text = letter
    }
  })
}

export const selectTile = ({ tileEntity, letterEntity }: TileWithLetter, isCorrectLetter: boolean) => {
  const textShape = TextShape.getMutableOrNull(letterEntity)
  if (textShape) {
    textShape.textColor = isCorrectLetter ? Color4.Green() : Color4.Red()
  }

  pointerEventsSystem.removeOnPointerDown(tileEntity)
}
