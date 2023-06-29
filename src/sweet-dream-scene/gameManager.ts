class GameManager {
  public readonly roundPreparationTime = 3
  public readonly roundTime = 3

  private round: number = 0
  private timer: number = this.roundPreparationTime
  private gameActive: boolean = false
  private roundActive: boolean = false

  public getRound = () => this.round
  public getTimer = () => this.timer
  public isGameActive = () => this.gameActive
  public isRoundActive = () => this.roundActive

  public decreaseTimer = () => this.timer--

  public initializeGame = () => {
    this.round = 0
    this.gameActive = false
  }
  public initializeRound = () => {
    this.timer = this.roundPreparationTime
    this.roundActive = false
  }

  public startGame = () => (this.gameActive = true)
  public startRound = () => {
    this.roundActive = true
    this.timer = this.roundTime
  }

  public finishGame = () => {
    this.roundActive = false
    this.gameActive = false
    this.round = 0
  }
  public finishRound = () => {
    this.roundActive = false
    this.round++
  }
}

export const gameManager = new GameManager()
