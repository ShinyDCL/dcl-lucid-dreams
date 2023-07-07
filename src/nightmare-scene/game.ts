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
import { LevelComponent, colors, levels, sceneMiddle, yOffset } from '../common'

export class Game {
  private readonly maxWordCount: number = 5
  private wordsGuessed: number = 0
  private wordList: string[] = []
  private letterSection: LetterSection
  private wordSection: WordSection
  private character: Character
  private wrongGuessCount: number = 0
  private maxWrongGuessCount: number
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
    messageLabelManager.showLabel('Successfully guess 5 words to get to the next level! ', colors.black)
    this.startRound(true)
  }

  startRound = (skipCleanup?: boolean) => {
    if (!skipCleanup) this.cleanup()

    const word = this.getRandomWord()
    this.wordSection.displayWord(word)

    const firstLetter = word[0]
    const lastLetter = word[word.length - 1]

    // Reveal first and last letter in word
    this.wordSection.revealLetter(firstLetter)
    this.wordSection.revealLetter(lastLetter)

    // Set first and last letter as already used
    this.letterSection.markAsUsed(firstLetter, true)
    this.letterSection.markAsUsed(lastLetter, true)

    levelInfoLabelManager.showLabel(`Words guessed ${this.wordsGuessed}/${this.maxWordCount}`)
  }

  cleanup = () => {
    this.wordSection.removeWord()
    this.letterSection.reset()
    this.character.reset()
    this.wrongGuessCount = 0
  }

  selectLetter = (tile: Tile) => {
    const selectedLetter = tile.getLetter()
    const isCorrectLetter = this.wordSection.includesLetter(selectedLetter)

    this.letterSection.markAsUsed(selectedLetter, isCorrectLetter)
    this.wordSection.revealLetter(selectedLetter)
    if (!isCorrectLetter) {
      this.character.playAnimation(this.wrongGuessCount)
      this.wrongGuessCount++
    }

    // If all letters in the word have been revealed then player has won
    if (this.wordSection.allLettersRevealed()) {
      this.wordsGuessed++
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('Word completed!', colors.green)
      levelInfoLabelManager.showLabel(`Words guessed ${this.wordsGuessed}/${this.maxWordCount}`)

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()

        // If the current round is the last round then level has been completed
        if (this.wordsGuessed >= this.maxWordCount) {
          this.completeGame()
        } else {
          this.startRound()
        }
      }, 3000)
    }

    // If maximum count of wrong guesses have been reached then player has lost
    if (this.wrongGuessCount >= this.maxWrongGuessCount) {
      this.letterSection.removeInteractions()
      messageLabelManager.showLabel('You lost, try again!', colors.red)
      this.wordSection.revealWord()

      utils.timers.setTimeout(() => {
        messageLabelManager.hideLabel()
        this.startRound()
      }, 3000)
    }
  }

  getRandomWord = (): string[] => {
    if (!this.wordList.length) this.wordList = getShuffledWordList()

    const word = this.wordList.pop()
    if (!word) return []

    return word.split('').map((letter) => letter.toUpperCase())
  }

  completeGame = () => {
    this.character.remove()
    this.wordSection.remove()
    this.letterSection.remove()

    messageLabelManager.showLabel('Level completed! Click on the button to start next level!', colors.black)
    this.onGameCompleted()
  }
}
