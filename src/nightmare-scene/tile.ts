import {
  AudioSource,
  engine,
  Entity,
  Font,
  GltfContainer,
  pointerEventsSystem,
  TextShape,
  Transform
} from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'

import { addInteraction, modelFolders, playSound, sounds } from '../common'

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

    const tileLetter = engine.addEntity()
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

    this.tileEntity = tile
    this.letterEntity = tileLetter
    this.letter = letter
    this.letterHidden = letterHidden

    if (onClick) {
      AudioSource.create(tile, {
        audioClipUrl: sounds.click,
        loop: false,
        playing: false
      })

      this.onClick = onClick
      this.addOnClick()
    }
  }

  getLetter = () => this.letter
  isLetterHidden = () => this.letterHidden

  /*
   * Sets text color for the letter displayed on tile
   */
  setTextColor = (color: Color4) => {
    const textShape = TextShape.getMutable(this.letterEntity)
    textShape.textColor = color
  }

  /*
   * Removes on-click interaction from tile
   */
  removeInteraction = () => pointerEventsSystem.removeOnPointerDown(this.tileEntity)

  /*
   * Adds on-click interaction to tile
   */
  addOnClick = () =>
    addInteraction(this.tileEntity, `Select ${this.letter}!`, () => {
      if (!this.onClick) return
      playSound(this.tileEntity)
      this.onClick(this)
    })

  /*
   * Shows tile letter
   */
  showLetter = () => {
    this.letterHidden = false
    const textShape = TextShape.getMutable(this.letterEntity)
    textShape.text = this.letter
  }

  /*
   * Removes tile from engine by removing tile and letter entities
   */
  removeFromEngine = () => engine.removeEntityWithChildren(this.tileEntity)
}
