import { Animator, Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { Vector3, Quaternion } from '@dcl/sdk/math'
import { LevelComponent, levels, modelFolders } from '../common'

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

/*
 * Creates a character from multiple parts which can be made visible by playing animations
 */
export class Character {
  private characterParts: CharacterPartWithEntity[]

  constructor(parent: Entity) {
    const characterStand = engine.addEntity()
    GltfContainer.create(characterStand, { src: `${modelFolders.nightmare}/stand.glb` })
    Transform.create(characterStand, {
      position: Vector3.create(-1.8, 0.2, 0),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0),
      parent
    })
    LevelComponent.create(characterStand, { level: levels.first })

    const character = engine.addEntity()
    Transform.create(character, { parent: characterStand })
    LevelComponent.create(character, { level: levels.first })

    this.characterParts = characterPartEnums.map((part) => {
      const entity = engine.addEntity()
      const transform = Transform.create(entity, {
        position: Vector3.create(0, 2, 0),
        parent: character
      })

      // Rotate models for right arm and right leg
      if ([CharacterPart.RightArm, CharacterPart.RightLeg].includes(part))
        transform.rotation = Quaternion.fromEulerDegrees(0, 180, 0)

      GltfContainer.create(entity, { src: `${modelFolders.nightmare}/${characterModels[part]}` })
      Animator.create(entity, {
        states: [{ name: animation, clip: animation, playing: false, loop: false, shouldReset: true }]
      })
      LevelComponent.create(entity, { level: levels.first })

      return { part, entity }
    })
  }

  /*
   * Plays animation for single character part (scales and becomes visible)
   */
  playAnimation = (partIndex: number) => {
    const part = this.characterParts[partIndex]
    if (!part) return

    const clip = Animator.getClipOrNull(part.entity, animation)
    if (clip) {
      clip.playing = true
    }
  }

  /*
   * Resets animations for all character parts (scales down and makes invisible)
   */
  reset = () => {
    this.characterParts.forEach((part) => {
      const clip = Animator.getClipOrNull(part.entity, animation)
      if (clip) {
        clip.playing = false
      }
    })
  }

  /*
   * Gets count of character parts
   */
  getCharacterPartCount = () => this.characterParts.length
}
