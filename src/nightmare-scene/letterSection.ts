import { Entity, GltfContainer, Transform, engine } from '@dcl/sdk/ecs'
import { nightmareModels } from '../resources'
import { TileWithLetter, createTile, tileSize } from './tile'
import { Quaternion, Vector3 } from '@dcl/sdk/math'

const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]
const rows = 3
const columns = Math.ceil(letters.length / rows)
const spaceSize = 0.02

export const createLetterSection = (
  parent: Entity,
  onLetterSelected: (tileWithLetter: TileWithLetter) => void
): TileWithLetter[] => {
  const letterSection = engine.addEntity()
  Transform.create(letterSection, { position: Vector3.create(0, 2.2, 0), parent })

  const letterSectionTitle = engine.addEntity()
  Transform.create(letterSectionTitle, { rotation: Quaternion.fromEulerDegrees(0, 180, 0), parent: letterSection })
  GltfContainer.create(letterSectionTitle, { src: `${nightmareModels}/textLetters.glb` })

  const letterList = engine.addEntity()
  Transform.create(letterList, { position: Vector3.create(tileSize / 2, -0.4, 0), parent: letterSection })

  return letters.map((letter, index) => {
    const row = Math.floor(index / columns) * (spaceSize + tileSize)
    const column = (index % columns) * (spaceSize + tileSize)
    return createTile(letterList, Vector3.create(column, -row, 0), letter, onLetterSelected)
  })
}
