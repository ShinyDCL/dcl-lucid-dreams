import { Animator, AudioSource, engine, Entity, GltfContainer, Transform, TransformType } from '@dcl/sdk/ecs'

import { addInteraction, defaultAnimation, modelFolders, playSound, sounds } from '../common'

export class Lever {
  private entity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const lever = engine.addEntity()
    GltfContainer.create(lever, { src: `${modelFolders.lostInDream}/lever.glb` })
    Transform.create(lever, { parent, ...transform })
    Animator.create(lever, {
      states: [{ clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
    })

    AudioSource.create(lever, {
      audioClipUrl: sounds.lever,
      loop: false,
      playing: false
    })

    this.entity = lever
  }

  addOnClick = (hoverText: string, onClick: () => void) =>
    addInteraction(this.entity, hoverText, () => {
      playSound(this.entity)
      Animator.playSingleAnimation(this.entity, defaultAnimation)
      onClick()
    })
}
