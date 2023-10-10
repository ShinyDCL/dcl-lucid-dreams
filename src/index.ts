import { levelManager } from './levelManager'
import { setUpMusic } from './music'
import { setUpUi } from './ui'

export function main() {
  setUpUi()
  setUpMusic()
  levelManager.startCurrentLevel()
}
