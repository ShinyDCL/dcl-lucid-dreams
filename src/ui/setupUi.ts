import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'
import { Root } from './root'

export const setupUi = () => {
  ReactEcsRenderer.setUiRenderer(Root)
}
