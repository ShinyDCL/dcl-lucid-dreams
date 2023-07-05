import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { firstLevel, nightmareModels } from '../resources'
import { Tile, tileSize } from './tile'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { LevelComponent } from '../common'

const spaceSize = 0.02

/*
 * Word section with title and a row of tiles displaying each letter in word
 */
export class WordSection {
  private row: Entity
  private wordTiles: Tile[] = []

  constructor(parent: Entity) {
    const section = engine.addEntity()
    Transform.create(section, { position: Vector3.create(0, 3.2, 0), parent })
    LevelComponent.create(section, { level: firstLevel })

    const title = engine.addEntity()
    Transform.create(title, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: section })
    GltfContainer.create(title, { src: `${nightmareModels}/textWord.glb` })
    LevelComponent.create(title, { level: firstLevel })

    const row = engine.addEntity()
    Transform.create(row, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: section })
    LevelComponent.create(row, { level: firstLevel })

    this.row = row
  }

  /*
   * Displays word in word section with all letters hidden initially
   */
  displayWord = (word: string[]) => {
    this.wordTiles = word.map((letter, index) => {
      const column = index * (spaceSize + tileSize)
      return new Tile(this.row, Vector3.create(column, 0, 0), letter, undefined, letter !== ' ')
    })
  }

  /*
   * Removes all entities used for displaying a word from engine
   */
  removeWord = () => this.wordTiles.forEach((tile) => tile.removeFromEngine())

  /*
   * Reveals a letter in all occurrences in word
   */
  revealLetter = (letter: string) => {
    const correctTiles = this.wordTiles.filter((tile) => tile.getLetter() === letter)
    correctTiles.forEach((tile) => tile.showLetter())
  }

  /*
   * Reveals word by revealing all hidden letters in the word
   */
  revealWord = () => this.wordTiles.forEach((tile) => tile.isLetterHidden() && tile.showLetter())

  /*
   * Checks if all letters in word have been revealed
   */
  allLettersRevealed = (): boolean => this.wordTiles.filter((tile) => tile.isLetterHidden()).length <= 0

  /*
   * Checks if word includes given letter
   */
  includesLetter = (letter: string): boolean => !!this.wordTiles.find((tile) => tile.getLetter() === letter)
}
