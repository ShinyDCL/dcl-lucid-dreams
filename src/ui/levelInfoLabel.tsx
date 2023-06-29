import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { ContentManager } from './contentManager'

export const levelInfoLabelManager = new ContentManager()

export const LevelInfoLabel = () => (
  <UiEntity
    uiTransform={{
      margin: 6,
      justifyContent: 'center',
      height: 30,
      flexGrow: 1,
      display: levelInfoLabelManager.isVisible() ? 'flex' : 'none'
    }}
    uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
  >
    <Label
      value={levelInfoLabelManager.getMessage()}
      color={Color4.White()}
      fontSize={22}
      font="serif"
      textAlign="middle-center"
      uiBackground={{ color: Color4.create(220, 220, 220, 0.3) }}
    />
  </UiEntity>
)
