class MessageLabelManager {
  private visible: boolean = false
  private message: string = ''

  public isVisible = () => this.visible
  public getMessage = () => this.message

  public showLabel = (message: string) => {
    this.message = message
    this.visible = true
  }

  public updateLabel = (message: string) => {
    this.message = message
  }

  public hideLabel = () => {
    this.visible = false
    this.message = ''
  }
}

export const messageLabelManager = new MessageLabelManager()
