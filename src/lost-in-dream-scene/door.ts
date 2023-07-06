import { Animator, Entity, GltfContainer, Transform, TransformType, engine } from '@dcl/sdk/ecs'
import { LevelComponent } from '../common'
import { defaultAnimation, modelFolders, levels } from '../resources'

export class Door {
  private entity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const door = engine.addEntity()
    GltfContainer.create(door, { src: `${modelFolders.lostInDream}/door.glb` })
    Transform.create(door, { parent, ...transform })
    Animator.create(door, {
      states: [{ name: defaultAnimation, clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
    })
    LevelComponent.create(door, { level: levels.second })

    this.entity = door
  }

  playAnimation = () => {
    const clip = Animator.getClipOrNull(this.entity, defaultAnimation)
    if (clip) clip.playing = true
  }
}
