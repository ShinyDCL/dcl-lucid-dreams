import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, UiEntity } from '@dcl/sdk/react-ecs'

import { colors } from '../common'
import { levelManager } from '../levelManager'
import { LevelInfoLabel } from './levelInfoLabel'
import { MessageLabel } from './messageLabel'

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
        uiBackground={{ color: colors.black }}
      >
        <Label
          value={levelManager.getCurrentLevel()}
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
