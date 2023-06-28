class GameManager {
  public readonly roundPreparationTime = 3
  public readonly roundTime = 3

  private round: number = 0
  private active: boolean = false
  private timer: number = this.roundPreparationTime

  public getRound = () => this.round
  public isActive = () => this.active
  public getTimer = () => this.timer

  public decreaseTimer = () => this.timer--
  public initializeGame = () => (this.round = 0)
  public initializeRound = () => (this.timer = this.roundPreparationTime)
  public stopGame = () => (this.active = false)
  public startRound = () => {
    this.active = true
    this.timer = this.roundTime
  }
  public finishRound = () => this.round++
}

export const gameManager = new GameManager()
