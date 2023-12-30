import { AudioSource, Entity, InputAction, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'

/*
 * Shuffles elements in array in random order
 */
export const shuffleArray = (arr: string[]): string[] =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)

/*
 * Returns random Int between 0 (inclusive) and max (exclusive)
 */
export const getRandomInt = (max: number) => Math.floor(Math.random() * max)

/*
 * Hides entity by scaling it down
 */
export const hideEntity = (entity: Entity) => {
  Transform.getMutable(entity).scale = Vector3.create(0, 0, 0)
}

/*
 * Shows entity by scaling it up
 */
export const showEntity = (entity: Entity, scale?: Vector3.MutableVector3) => {
  Transform.getMutable(entity).scale = scale || Vector3.create(1, 1, 1)
}

export const addInteraction = (entity: Entity, hoverText: string, onClick: () => void) => {
  pointerEventsSystem.onPointerDown({ entity, opts: { button: InputAction.IA_POINTER, hoverText } }, onClick)
}

export const playSound = (entity: Entity) => {
  const audioSource = AudioSource.getMutable(entity)
  audioSource.playing = true
}

export const stopSound = (entity: Entity) => {
  const audioSource = AudioSource.getMutable(entity)
  audioSource.playing = false
}
