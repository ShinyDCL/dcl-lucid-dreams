import { Animator, engine, Entity, GltfContainer, Transform, TransformType } from '@dcl/sdk/ecs'

import { defaultAnimation, modelFolders } from '../common'

export class Door {
  private entity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const door = engine.addEntity()
    GltfContainer.create(door, { src: `${modelFolders.lostInDream}/door.glb` })
    Transform.create(door, { parent, ...transform })
    Animator.create(door, {
      states: [{ clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
    })

    this.entity = door
  }

  open = () => Animator.playSingleAnimation(this.entity, defaultAnimation)
}
