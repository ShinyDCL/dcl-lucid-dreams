import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math'
import { MessageLabel } from './messageLabel'
import { LevelInfoLabel } from './levelInfoLabel'

export const Root = () => (
  <UiEntity
    uiTransform={{
      width: '100%',
      minWidth: 300,
      height: 82,
      margin: { left: 320, right: 320 },
      flexDirection: 'column',
      flexGrow: 0
    }}
  >
    <UiEntity
      uiTransform={{
        flexDirection: 'row'
      }}
    >
      <UiEntity
        uiTransform={{
          margin: 6,
          justifyContent: 'center',
          height: 30,
          flexGrow: 1
        }}
        uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
      >
        <Label
          value="Level - 3 (Sweet dream)"
          color={Color4.White()}
          fontSize={22}
          font="serif"
          textAlign="middle-center"
        />
      </UiEntity>
      <LevelInfoLabel />
    </UiEntity>
    <MessageLabel />
  </UiEntity>
)
