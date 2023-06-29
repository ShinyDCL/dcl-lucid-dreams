export class ContentManager {
  private visible: boolean = false
  private message: string = ''

  public isVisible = () => this.visible
  public getMessage = () => this.message

  public showLabel = (message: string) => {
    this.message = message
    this.visible = true
  }

  public hideLabel = () => {
    this.visible = false
    this.message = ''
  }
}
