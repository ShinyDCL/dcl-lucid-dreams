export const parcelCount = 4 // 4 rows, 4 columns
export const parcelSize = 16
export const sceneSize = parcelCount * parcelSize
export const sceneMiddle = sceneSize / 2
export const yOffset = 0.1

export const nightmareModels = 'models/nightmare-scene'
export const sweetDreamModels = 'models/sweet-dream-scene'

export const firstLevel = 1

export const skyBoxFolders = {
  nightmare: 'models/nightmare-scene',
  lostInDream: 'lost-in-dream',
  sweetDream: 'models/nightmare-scene'
}

export const modelFolders = {
  nightmare: 'models/nightmare-scene',
  lostInDream: 'models/lost-in-dream',
  sweetDream: 'models/nightmare-scene'
}

export const levels = {
  first: 1,
  second: 2,
  third: 3
} as const

export const sounds = {
  click: 'sounds/click.mp3',
  lever: 'sounds/lever.mp3'
} as const

export const defaultAnimation = 'Animation'
