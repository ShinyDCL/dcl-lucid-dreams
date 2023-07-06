export const parcelCount = 4 // 4 rows, 4 columns
export const parcelSize = 16
export const sceneSize = parcelCount * parcelSize
export const sceneMiddle = sceneSize / 2
export const yOffset = 0.1

export const skyBoxFolders = {
  nightmare: 'nightmare-scene',
  lostInDream: 'lost-in-dream-scene',
  sweetDream: 'sweet-dream-scene'
} as const

export const modelFolders = {
  nightmare: 'models/nightmare-scene',
  lostInDream: 'models/lost-in-dream-scene',
  sweetDream: 'models/sweet-dream-scene'
} as const

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
