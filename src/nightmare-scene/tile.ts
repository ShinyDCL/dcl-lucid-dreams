import {
  AudioSource,
  Entity,
  Font,
  GltfContainer,
  InputAction,
  TextShape,
  Transform,
  engine,
  pointerEventsSystem,
  removeEntityWithChildren
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { modelFolders, sounds } from '../common'

export const tileSize = 0.4
const placeholder = '_'

/*
 * Tile with a single letter
 */
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
    GltfContainer.create(tile, { src: `${modelFolders.nightmare}/tile.glb` })
    Transform.create(tile, { position, parent })

    const tileLetter = engine.addEntity(true)
    TextShape.create(tileLetter, {
      text: letterHidden ? placeholder : letter,
      fontSize: 3,
      font: Font.F_SANS_SERIF,
      textColor: Color4.White()
    })
    Transform.create(tileLetter, {
      position: Vector3.create(0, 0, -0.04),
      parent: tile
    })

    if (onClick) {
      AudioSource.create(tile, {
        audioClipUrl: sounds.click,
        loop: false,
        playing: false
      })

      pointerEventsSystem.onPointerDown(
        { entity: tile, opts: { button: InputAction.IA_POINTER, hoverText: `Select ${letter}!` } },
        () => {
          this.playSound()
          onClick(this)
        }
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

  /*
   * Sets text color for the letter displayed on tile
   */
  setTextColor = (color: Color4) => {
    const textShape = TextShape.getMutableOrNull(this.letterEntity)
    if (textShape) {
      textShape.textColor = color
    }
  }

  /*
   * Removes on-click interaction from tile
   */
  removeInteraction = () => pointerEventsSystem.removeOnPointerDown(this.tileEntity)

  /*
   * Adds on-click interaction to tile
   */
  addInteraction = () =>
    pointerEventsSystem.onPointerDown(
      { entity: this.tileEntity, opts: { button: InputAction.IA_POINTER, hoverText: `Select ${this.letter}!` } },
      () => {
        if (!this.onClick) return

        this.playSound()
        this.onClick(this)
      }
    )

  /*
   * Shows tile letter
   */
  showLetter = () => {
    this.letterHidden = false
    const textShape = TextShape.getMutableOrNull(this.letterEntity)
    if (textShape) {
      textShape.text = this.letter
    }
  }

  /*
   * Removes tile from engine by removing tile and letter entities
   */
  removeFromEngine = () => removeEntityWithChildren(engine, this.tileEntity)

  playSound = () => {
    const audioSource = AudioSource.getMutable(this.tileEntity)
    if (audioSource) audioSource.playing = true
  }
}
