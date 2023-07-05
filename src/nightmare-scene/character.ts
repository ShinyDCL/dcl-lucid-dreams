import { Animator, Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { nightmareModels } from '../resources'

export enum CharacterPart {
  Top = 'Top',
  Head = 'Head',
  Body = 'Body',
  RightLeg = 'RightLeg',
  LeftLeg = 'LeftLeg',
  RightArm = 'RightArm',
  LeftArm = 'LeftArm'
}

export type CharacterPartKey = keyof typeof CharacterPart

export const characterPartKeys = Object.keys(CharacterPart) as CharacterPartKey[]
export const characterPartEnums: CharacterPart[] = characterPartKeys.map((key) => CharacterPart[key])

export const characterModels: { [key in CharacterPart]: string } = {
  [CharacterPart.Top]: 'characterTop.glb',
  [CharacterPart.Head]: 'characterHead.glb',
  [CharacterPart.Body]: 'characterBody.glb',
  [CharacterPart.RightLeg]: 'characterLeg.glb',
  [CharacterPart.LeftLeg]: 'characterLeg.glb',
  [CharacterPart.RightArm]: 'characterArm.glb',
  [CharacterPart.LeftArm]: 'characterArm.glb'
}

export interface CharacterPartWithEntity {
  part: CharacterPart
  entity: Entity
}

export const animation = 'Animation'

export class Character {
  private characterParts: CharacterPartWithEntity[]

  constructor(parent: Entity) {
    const characterStand = engine.addEntity()
    GltfContainer.create(characterStand, { src: `${nightmareModels}/stand.glb` })
    Transform.create(characterStand, {
      position: Vector3.create(-1.8, 0.2, 0),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0),
      parent
    })

    const character = engine.addEntity()
    Transform.create(character, { parent: characterStand })

    this.characterParts = characterPartEnums.map((part) => {
      const entity = engine.addEntity()
      const transform = Transform.create(entity, {
        position: Vector3.create(0, 2, 0),
        parent: character
      })

      // Rotate models for right arm and right leg
      if ([CharacterPart.RightArm, CharacterPart.RightLeg].includes(part))
        transform.rotation = Quaternion.fromEulerDegrees(0, 180, 0)

      GltfContainer.create(entity, { src: `${nightmareModels}/${characterModels[part]}` })
      Animator.create(entity, {
        states: [{ name: animation, clip: animation, playing: false, loop: false, shouldReset: true }]
      })

      return { part, entity }
    })
  }

  playAnimation = (partIndex: number) => {
    const part = this.characterParts[partIndex]
    if (!part) return

    const clip = Animator.getClipOrNull(part.entity, animation)
    if (clip) {
      clip.playing = true
    }
  }

  reset = () => {
    this.characterParts.forEach((part) => {
      const clip = Animator.getClipOrNull(part.entity, animation)
      if (clip) {
        clip.playing = false
        clip.shouldReset
      }
    })
  }

  getCharacterPartCount = () => this.characterParts.length
}
