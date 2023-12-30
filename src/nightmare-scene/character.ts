import { Animator, engine, Entity, GltfContainer, Transform } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

import { defaultAnimation, hideEntity, modelFolders, showEntity } from '../common'

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

export const characterModels: Record<CharacterPart, string> = {
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

/*
 * Creates a character from multiple parts which can be made visible by playing animations
 */
export class Character {
  private stand: Entity
  private characterParts: CharacterPartWithEntity[]

  constructor(parent: Entity) {
    const characterStand = engine.addEntity()
    GltfContainer.create(characterStand, { src: `${modelFolders.nightmare}/stand.glb` })
    Transform.create(characterStand, {
      position: Vector3.create(-1.8, 0, 0),
      rotation: Quaternion.fromEulerDegrees(0, 180, 0),
      parent
    })
    this.stand = characterStand

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

      GltfContainer.create(entity, { src: `${modelFolders.nightmare}/${characterModels[part]}` })
      Animator.create(entity, {
        states: [{ clip: defaultAnimation, playing: false, loop: false, shouldReset: true }]
      })

      return { part, entity }
    })
  }

  /*
   * Plays animation for single character part (scales and becomes visible)
   */
  showPart = (partIndex: number) => {
    const part = this.characterParts[partIndex]
    if (!part) return

    showEntity(part.entity)
    Animator.playSingleAnimation(part.entity, defaultAnimation)
  }

  /*
   * Resets animations for all character parts (scales down and makes invisible)
   */
  reset = () =>
    this.characterParts.forEach((part) => {
      Animator.stopAllAnimations(part.entity)
      hideEntity(part.entity)
    })

  /*
   * Gets count of character parts
   */
  getCharacterPartCount = () => this.characterParts.length

  remove = () => engine.removeEntityWithChildren(this.stand)
}
