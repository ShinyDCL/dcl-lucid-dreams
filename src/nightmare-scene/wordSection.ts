import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { nightmareModels } from '../resources'
import { TileWithLetter, createTile, tileSize } from './tile'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

const spaceSize = 0.02

export const createWordSection = (parent: Entity, word: string[]): TileWithLetter[] => {
  const wordSection = engine.addEntity()
  Transform.create(wordSection, { position: Vector3.create(0, 3.2, 0), parent })

  const wordSectionTitle = engine.addEntity()
  Transform.create(wordSectionTitle, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: wordSection })
  GltfContainer.create(wordSectionTitle, { src: `${nightmareModels}/textWord.glb` })

  const letterList = engine.addEntity()
  Transform.create(letterList, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: wordSection })

  const firstLetter = word[0]
  const lastLetter = word[word.length - 1]

  return word.map((letter, index) => {
    const column = index * (spaceSize + tileSize)
    const text = letter === firstLetter || letter === lastLetter || letter === ' ' ? letter : '_'
    const { tileEntity, letterEntity } = createTile(letterList, Vector3.create(column, 0, 0), text)
    return { tileEntity, letterEntity, letter }
  })
}
