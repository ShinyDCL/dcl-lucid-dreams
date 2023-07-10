import * as utils from '@dcl-sdk/utils'
import { AudioStream, Transform, engine } from '@dcl/sdk/ecs'
import { audioStreamUrl, sceneMiddle, yOffset } from './common'

/*
 * Creates one time trigger for starting music when user enters it
 */
export const setupMusic = () => {
  const triggerEntity = engine.addEntity()
  Transform.create(triggerEntity)

  utils.triggers.oneTimeTrigger(
    triggerEntity,
    utils.NO_LAYERS,
    utils.LAYER_1,
    [
      {
        type: 'box',
        position: { x: sceneMiddle, y: sceneMiddle + yOffset - 1, z: sceneMiddle + 1 },
        scale: { x: 14, y: 2, z: 1 }
      }
    ],
    () => {
      const streamEntity = engine.addEntity()
      AudioStream.create(streamEntity, {
        url: audioStreamUrl,
        playing: true,
        volume: 0.8
      })
    }
  )
}
