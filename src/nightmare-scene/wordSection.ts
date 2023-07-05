import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { nightmareModels } from '../resources'
import { Tile, tileSize } from './tile'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

const spaceSize = 0.02

export class WordSection {
  private list: Entity
  private tiles: Tile[] = []

  constructor(parent: Entity) {
    const section = engine.addEntity()
    Transform.create(section, { position: Vector3.create(0, 3.2, 0), parent })

    const title = engine.addEntity()
    Transform.create(title, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: section })
    GltfContainer.create(title, { src: `${nightmareModels}/textWord.glb` })

    const list = engine.addEntity()
    Transform.create(list, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: section })

    this.list = list
  }

  setWord = (word: string[]) => {
    this.tiles = word.map((letter, index) => {
      const column = index * (spaceSize + tileSize)
      return new Tile(this.list, Vector3.create(column, 0, 0), letter, undefined, true)
    })
  }

  removeWord = () => {
    this.tiles.forEach((tile) => tile.removeFromEngine())
  }

  revealLetter = (letter: string) => {
    const correctTiles = this.tiles.filter((tile) => tile.getLetter() === letter)
    correctTiles.forEach((tile) => tile.showLetter())
  }

  revealWord = () => {
    this.tiles.forEach((tile) => tile.isLetterHidden() && tile.showLetter())
  }

  allLettersRevealed = (): boolean => this.tiles.filter((tile) => tile.isLetterHidden()).length <= 0

  includesLetter = (letter: string) => !!this.tiles.find((tile) => tile.getLetter() === letter)
}
