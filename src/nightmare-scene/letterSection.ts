import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { nightmareModels } from '../resources'
import { Tile, tileSize } from './tile'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'

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

export class LetterSection {
  private tiles: Tile[]

  constructor(parent: Entity, onSelectLetter: (tileWithLetter: Tile) => void) {
    const section = engine.addEntity()
    Transform.create(section, { position: Vector3.create(0, 2.2, 0), parent })

    const title = engine.addEntity()
    Transform.create(title, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: section })
    GltfContainer.create(title, { src: `${nightmareModels}/textLetters.glb` })

    const list = engine.addEntity()
    Transform.create(list, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: section })

    const tiles = letters.map((letter, index) => {
      const row = Math.floor(index / columns) * (spaceSize + tileSize)
      const column = (index % columns) * (spaceSize + tileSize)
      return new Tile(list, Vector3.create(column, -row, 0), letter, onSelectLetter)
    })

    this.tiles = tiles
  }

  reset = () => {
    this.tiles.forEach((tile) => {
      tile.setTextColor(Color4.White())
      tile.setInteraction()
    })
  }

  markAsUsed = (letter: string, isCorrectLetter: boolean) => {
    const usedTile = this.tiles.find((tile) => tile.getLetter() === letter)
    if (!usedTile) return

    usedTile.setTextColor(isCorrectLetter ? Color4.Green() : Color4.Red())
    usedTile.removeInteraction()
  }

  selectLetter = (tile: Tile, isCorrectLetter: boolean) => {
    tile.setTextColor(isCorrectLetter ? Color4.Green() : Color4.Red())
    tile.removeInteraction()
  }

  removeInteractions = () => this.tiles.forEach((tile) => tile.removeInteraction())
}
