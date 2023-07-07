import { Color4 } from '@dcl/sdk/math'
import { colors } from '../common'

export class ContentManager {
  private visible: boolean = false
  private message: string = ''
  private backgroundColor: Color4 = colors.black
  private textColor: Color4 = Color4.White()

  public isVisible = () => this.visible
  public getMessage = () => this.message
  public getTextColor = () => this.textColor
  public getBackgroundColor = () => this.backgroundColor

  public showLabel = (message: string, backgroundColor?: Color4, textColor?: Color4) => {
    this.message = message
    this.backgroundColor = backgroundColor || colors.black
    this.textColor = textColor || Color4.White()
    this.visible = true
  }

  public hideLabel = () => {
    this.visible = false
    this.message = ''
  }
}
