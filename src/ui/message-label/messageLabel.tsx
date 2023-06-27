import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { messageLabelManager } from './messageLabelManager'

// Message label displayed at the top of the screen
export const MessageLabel = () => (
  <UiEntity
    uiTransform={{
      width: '50%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      display: messageLabelManager.isVisible() ? 'flex' : 'none'
    }}
    uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
  >
    <Label
      value={messageLabelManager.getMessage()}
      color={Color4.White()}
      fontSize={29}
      font="serif"
      textAlign="middle-center"
    />
  </UiEntity>
)
