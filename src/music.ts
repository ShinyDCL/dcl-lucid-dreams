import { AudioStream, engine, InputAction, inputSystem, PointerEventType } from '@dcl/sdk/ecs'

import { audioStreamUrl } from './common'

export const setUpMusic = () => {
  engine.addSystem(onFirstUserAction)
}

/*
 * Starts playing music on first user action
 */
const onFirstUserAction = () => {
  if (inputSystem.isTriggered(InputAction.IA_ANY, PointerEventType.PET_DOWN)) {
    const streamEntity = engine.addEntity()
    AudioStream.create(streamEntity, {
      url: audioStreamUrl,
      playing: true,
      volume: 0.3
    })

    engine.removeSystem(onFirstUserAction)
  }
}
