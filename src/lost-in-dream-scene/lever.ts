import {
  Animator,
  AudioSource,
  Entity,
  GltfContainer,
  InputAction,
  Transform,
  TransformType,
  engine,
  pointerEventsSystem
} from '@dcl/sdk/ecs'
import { LevelComponent } from '../common'
import { sounds, modelFolders, defaultAnimation, levels } from '../resources'

export class Lever {
  entity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const lever = engine.addEntity()
    GltfContainer.create(lever, { src: `${modelFolders.lostInDream}/lever.glb` })
    Transform.create(lever, { parent, ...transform })
    Animator.create(lever, {
      states: [{ name: defaultAnimation, clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
    })
    LevelComponent.create(lever, { level: levels.second })

    AudioSource.create(lever, {
      audioClipUrl: sounds.lever,
      loop: false,
      playing: false
    })

    this.entity = lever
  }

  setOnClick = (hoverText: string, onClick: () => void) => {
    pointerEventsSystem.onPointerDown(
      { entity: this.entity, opts: { button: InputAction.IA_POINTER, hoverText } },
      () => {
        pointerEventsSystem.removeOnPointerDown(this.entity)
        this.playAudio()
        this.playAnimation()
        onClick()
      }
    )
  }

  playAudio = () => {
    const audioSource = AudioSource.getMutableOrNull(this.entity)
    if (audioSource) audioSource.playing = true
  }

  playAnimation = () => {
    const clip = Animator.getClipOrNull(this.entity, defaultAnimation)
    if (clip) clip.playing = true
  }
}
