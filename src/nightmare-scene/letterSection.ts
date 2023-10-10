import { engine, Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

import { modelFolders } from '../common'
import { Tile, tileSize } from './tile'

const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]
const rows = 3
const columns = Math.ceil(letters.length / rows)
const spaceSize = 0.02

/*
 * Letter section with title and a multiple rows of tiles displaying all letters
 */
export class LetterSection {
  private section: Entity
  private letterTiles: Tile[]

  constructor(parent: Entity, onSelectLetter: (tileWithLetter: Tile) => void) {
    const section = engine.addEntity()
    Transform.create(section, { position: Vector3.create(0, 2, 0), parent })
    this.section = section

    const title = engine.addEntity()
    Transform.create(title, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: section })
    GltfContainer.create(title, { src: `${modelFolders.nightmare}/textLetters.glb` })

    const list = engine.addEntity()
    Transform.create(list, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: section })

    const letterTiles = letters.map((letter, index) => {
      const row = Math.floor(index / columns) * (spaceSize + tileSize)
      const column = (index % columns) * (spaceSize + tileSize)
      return new Tile(list, Vector3.create(column, -row, 0), letter, onSelectLetter)
    })

    this.letterTiles = letterTiles
  }

  /*
   * Resets all tiles in the list to their initial state
   */
  reset = () =>
    this.letterTiles.forEach((tile) => {
      tile.setTextColor(Color4.White())
      tile.addOnClick()
    })

  /*
   * Marks letter tile as used by updating tile text color and removing on-click interaction
   */
  markAsUsed = (letter: string, isCorrectLetter: boolean) => {
    const usedTile = this.letterTiles.find((tile) => tile.getLetter() === letter)
    if (!usedTile) return

    usedTile.setTextColor(isCorrectLetter ? Color4.Green() : Color4.Red())
    usedTile.removeInteraction()
  }

  /*
   * Removes interactions for all letter tiles
   */
  removeInteractions = () => this.letterTiles.forEach((tile) => tile.removeInteraction())

  remove = () => engine.removeEntityWithChildren(this.section)
}
