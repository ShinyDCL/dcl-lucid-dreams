import { Entity, Transform, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils'
import { WordSection } from './wordSection'
import { LetterSection } from './letterSection'
import { Character } from './character'
import { getShuffledWordList } from './wordList'
import { levelInfoLabelManager, messageLabelManager } from '../ui'
import { Tile } from './tile'
import { movePlayerTo } from '~system/RestrictedActions'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { LevelComponent, levels, sceneMiddle, yOffset } from '../common'

const green: Color4.Mutable = Color4.Green()
green.a = 0.6

const red: Color4.Mutable = Color4.Red()
red.a = 0.6

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
  private onGameCompleted: () => void

  constructor(parent: Entity, onGameCompleted: () => void) {
    const gameArea = engine.addEntity()
    Transform.create(gameArea, { position: Vector3.create(0, 0, 4), parent })
    LevelComponent.create(gameArea, { level: levels.first })

    this.wordList = getShuffledWordList()
    this.letterSection = new LetterSection(gameArea, this.selectLetter)
    this.wordSection = new WordSection(gameArea)
    this.character = new Character(gameArea)
    this.maxWrongGuessCount = this.character.getCharacterPartCount()
    this.onGameCompleted = onGameCompleted
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
    this.wordSection.displayWord(lettersInWord)

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

    // If all letters in the word have been revealed then player has won
    if (this.wordSection.allLettersRevealed()) {
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('Round won!', green)

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()

        // If the current round is the last round then level has been completed
        if (this.round >= this.maxRoundCount) {
          messageLabelManager.showLabel('Level completed! Find button to start next level!', green)
          this.onGameCompleted()
        } else {
          this.round++
          this.startRound()
        }
      }, 3000)
    }

    // If maximum count of wrong guesses have been reached then player has lost
    if (this.wrongGuessCount >= this.maxWrongGuessCount) {
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('Round lost, try again!', red)
      this.wordSection.revealWord()

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()
        this.startRound()
      }, 3000)
    }
  }
}
