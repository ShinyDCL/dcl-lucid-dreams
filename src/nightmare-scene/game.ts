import { Entity, Transform, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { WordSection } from './wordSection'
import { LetterSection } from './letterSection'
import { Character } from './character'
import { getShuffledWordList } from './wordList'
import { levelInfoLabelManager, messageLabelManager } from '../ui'
import { Tile } from './tile'
import { movePlayerTo } from '~system/RestrictedActions'
import { Vector3 } from '@dcl/sdk/math'
import { sceneMiddle, yOffset } from '../resources'

export class Game {
  private readonly maxRoundCount: number = 5
  private round: number = 1
  private wordList: string[]
  private letterSection: LetterSection
  private wordSection: WordSection
  private character: Character
  private wrongGuessCount: number = 0
  private maxWrongGuessCount: number
  private correctGuessCount: number = 0

  constructor(parent: Entity) {
    const gameArea = engine.addEntity()
    Transform.create(gameArea, { parent })

    this.wordList = getShuffledWordList()
    this.letterSection = new LetterSection(gameArea, this.selectLetter)
    this.wordSection = new WordSection(gameArea)
    this.character = new Character(gameArea)
    this.maxWrongGuessCount = this.character.getCharacterPartCount()
  }

  startGame = () => {
    movePlayerTo({ newRelativePosition: Vector3.create(sceneMiddle, sceneMiddle + yOffset, sceneMiddle) })
    this.startRound(true)
  }

  startRound = (skipCleanup?: boolean) => {
    if (!skipCleanup) this.cleanup()

    const word = this.wordList.pop()
    if (!word) return

    const lettersInWord = word.split('').map((letter) => letter.toUpperCase())
    this.wordSection.setWord(lettersInWord)

    const firstLetter = lettersInWord[0]
    const lastLetter = lettersInWord[lettersInWord.length - 1]

    // Reveal first and last letter in word
    this.wordSection.revealLetter(firstLetter)
    this.wordSection.revealLetter(lastLetter)

    // Set first and last letter as already used
    this.letterSection.markAsUsed(firstLetter, true)
    this.letterSection.markAsUsed(lastLetter, true)

    levelInfoLabelManager.showLabel(`Round ${this.round}/${this.maxRoundCount}`)
  }

  cleanup = () => {
    this.wordSection.removeWord()
    this.letterSection.reset()
    this.character.reset()
    this.wrongGuessCount = 0
    this.correctGuessCount = 0
  }

  selectLetter = (tile: Tile) => {
    const selectedLetter = tile.getLetter()
    const isCorrectLetter = this.wordSection.includesLetter(selectedLetter)

    this.letterSection.markAsUsed(selectedLetter, isCorrectLetter)
    this.wordSection.revealLetter(selectedLetter)
    if (!isCorrectLetter) {
      this.character.playAnimation(this.wrongGuessCount)
      this.wrongGuessCount++
    } else {
      this.correctGuessCount++
    }

    if (this.wordSection.allLettersRevealed()) {
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('Round won!')

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()
        this.round++
        this.startRound()
      }, 2000)
    }

    if (this.wrongGuessCount >= this.maxWrongGuessCount) {
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('Round lost, try again!')
      this.wordSection.revealWord()

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()
        this.startRound()
      }, 2000)
    }
  }
}
