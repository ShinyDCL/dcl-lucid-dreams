import { Difficulty } from './types'

class GameManager {
  public readonly roundPreparationTime = 3
  public readonly roundTime = 3

  private difficulty: Difficulty = Difficulty.VeryEasy
  private active: boolean = false
  private timer: number = this.roundPreparationTime

  public getDifficulty = () => this.difficulty
  public isActive = () => this.active

  public getTimer = () => this.timer
  public decreaseTimer = () => this.timer--

  public initializeGame = () => (this.difficulty = Difficulty.VeryEasy)

  public initializeRound = () => {
    this.timer = this.roundPreparationTime
  }
  public stopGame = () => (this.active = false)

  public startRound = () => {
    this.active = true
    this.timer = this.roundTime
  }

  public finishRound = () => {
    switch (this.difficulty) {
      case Difficulty.VeryEasy:
        this.difficulty = Difficulty.Easy
        break
      case Difficulty.Easy:
        this.difficulty = Difficulty.Medium
        break
      case Difficulty.Medium:
        this.difficulty = Difficulty.Hard
        break
      case Difficulty.Hard:
        this.difficulty = Difficulty.VeryHard
        break
      default:
        this.difficulty = Difficulty.Easy
    }
  }
}

export const gameManager = new GameManager()
