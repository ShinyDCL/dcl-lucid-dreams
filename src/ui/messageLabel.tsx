import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { ContentManager } from './contentManager'

export const messageLabelManager = new ContentManager()

// Message label displayed at the top of the screen
export const MessageLabel = () => (
  <UiEntity
    uiTransform={{
      minHeight: '40',
      justifyContent: 'center',
      margin: { left: 6, right: 6 },
      display: messageLabelManager.isVisible() ? 'flex' : 'none'
    }}
    uiBackground={{ color: messageLabelManager.getBackgroundColor() }}
  >
    <Label
      value={messageLabelManager.getMessage()}
      color={messageLabelManager.getTextColor()}
      fontSize={28}
      font="serif"
      textAlign="middle-center"
    />
  </UiEntity>
)
