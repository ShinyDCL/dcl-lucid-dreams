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
import { modelFolders, defaultAnimation, sounds } from '../common'

export class Lever {
  private entity: Entity

  constructor(parent: Entity, transform: Partial<TransformType>) {
    const lever = engine.addEntity()
    GltfContainer.create(lever, { src: `${modelFolders.lostInDream}/lever.glb` })
    Transform.create(lever, { parent, ...transform })
    Animator.create(lever, {
      states: [{ name: defaultAnimation, clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
    })

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
