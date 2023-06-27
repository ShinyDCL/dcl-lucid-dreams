import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { MessageLabel } from './message-label'

export const Root = () => (
  <UiEntity
    uiTransform={{
      width: '100%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 24
    }}
  >
    <MessageLabel />
  </UiEntity>
)
