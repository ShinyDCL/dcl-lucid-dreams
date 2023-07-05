import { Color4 } from '@dcl/sdk/math'

export class ContentManager {
  private visible: boolean = false
  private message: string = ''
  private backgroundColor: Color4 = Color4.create(0, 0, 0, 0.8)
  private textColor: Color4 = Color4.White()

  public isVisible = () => this.visible
  public getMessage = () => this.message
  public getTextColor = () => this.textColor
  public getBackgroundColor = () => this.backgroundColor

  public showLabel = (message: string, backgroundColor?: Color4, textColor?: Color4) => {
    this.message = message
    this.backgroundColor = backgroundColor || Color4.create(0, 0, 0, 0.8)
    this.textColor = textColor || Color4.White()
    this.visible = true
  }

  public hideLabel = () => {
    this.visible = false
    this.message = ''
  }
}
