const gameLevels = ['Level 1 - Nightmare', 'Level 2 - Lost in a dream', 'Level 3 - Sweet dream']
let currentGameLevel = 0

export const getCurrentGameLevel = (): string => gameLevels[currentGameLevel]
export const startNextLevel = () => {
  currentGameLevel++
}
