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

export const tileSize = 0.4
const underscore = '_'

export class Tile {
  private tileEntity: Entity
  private letterEntity: Entity
  private letter: string
  private letterHidden: boolean | undefined
  private onClick: ((tile: Tile) => void) | undefined

  constructor(
    parent: Entity,
    position: Vector3.MutableVector3,
    letter: string,
    onClick?: (tile: Tile) => void,
    letterHidden?: boolean
  ) {
    const tile = engine.addEntity()
    GltfContainer.create(tile, { src: `${nightmareModels}/tile.glb` })
    Transform.create(tile, { position, parent })

    const tileLetter = engine.addEntity(true)
    TextShape.create(tileLetter, {
      text: letterHidden ? underscore : letter,
      fontSize: 3,
      font: Font.F_SANS_SERIF,
      textColor: Color4.White()
    })
    Transform.create(tileLetter, {
      position: Vector3.create(0, 0, -0.04),
      parent: tile
    })

    if (onClick) {
      pointerEventsSystem.onPointerDown(
        { entity: tile, opts: { button: InputAction.IA_POINTER, hoverText: `Select ${letter}!` } },
        () => onClick(this)
      )
      this.onClick = onClick
    }

    this.letter = letter
    this.letterEntity = tileLetter
    this.tileEntity = tile
    this.letterHidden = letterHidden
  }

  getLetter = () => this.letter
  isLetterHidden = () => this.letterHidden

  setTextColor = (color: Color4) => {
    const textShape = TextShape.getMutableOrNull(this.letterEntity)
    if (textShape) {
      textShape.textColor = color
    }
  }

  removeInteraction = () => pointerEventsSystem.removeOnPointerDown(this.tileEntity)

  setInteraction = () => {
    pointerEventsSystem.onPointerDown(
      { entity: this.tileEntity, opts: { button: InputAction.IA_POINTER, hoverText: `Select ${this.letter}!` } },
      () => this.onClick && this.onClick(this)
    )
  }

  showLetter = () => {
    this.letterHidden = false
    const textShape = TextShape.getMutableOrNull(this.letterEntity)
    if (textShape) {
      textShape.text = this.letter
    }
  }

  removeFromEngine = () => {
    engine.removeEntity(this.letterEntity)
    engine.removeEntity(this.tileEntity)
  }
}
