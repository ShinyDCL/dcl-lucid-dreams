import { ReactEcsRenderer } from '@dcl/sdk/react-ecs'

import { Root } from './root'

export const setUpUi = () => {
  ReactEcsRenderer.setUiRenderer(Root)
}
