import { Color4 } from '@dcl/sdk/math'

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

export const sounds = {
  click: 'sounds/click.mp3',
  lever: 'sounds/lever.mp3',
  countdown: 'sounds/countdown.mp3'
} as const

export const colors = {
  green: Color4.create(0, 1, 0, 0.6),
  red: Color4.create(1, 0, 0, 0.6),
  blue: Color4.create(0, 0, 1, 0.7),
  pink: Color4.create(1, 0, 1, 0.7),
  black: Color4.create(0, 0, 0, 0.8)
} as const

export const defaultAnimation = 'Animation'

export const audioStreamUrl = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3'
