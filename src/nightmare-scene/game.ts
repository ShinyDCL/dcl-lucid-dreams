import { Entity } from '@dcl/sdk/ecs'
import { createWordSection } from './wordSection'
import { getShuffledWordList } from './words'
import { createLetterSection } from './letterSection'
import { TileWithLetter, revealTiles, selectTile } from './tile'

export const startGame = (parent: Entity) => {
  const wordList = getShuffledWordList()
  const word = wordList.pop()

  if (!word) return

  const letters = word.split('').map((letter) => letter.toUpperCase())
  const wordTiles = createWordSection(parent, letters)

  createLetterSection(parent, (tileWithLetter: TileWithLetter) => {
    const isCorrectLetter = letters.includes(tileWithLetter.letter)

    selectTile(tileWithLetter, isCorrectLetter)
    revealTiles(wordTiles.filter(({ letter }) => letter === tileWithLetter.letter))
  })
}
