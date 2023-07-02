const wordList = [
  'Decentralization',
  'Cryptocurrency',
  'Bitcoin',
  'Ethereum',
  'Polygon',
  'Collectible',
  'Blockchain',
  'Marketplace',
  'Token',
  'Ownership',
  'Rarity',
  'Minting',
  'Metaverse',
  'Decentraland',
  'Avatar',
  'Virtual world',
  'Virtual reality',
  'Digital identity',
  'Augmented reality',
  'Wallet',
  'Network',
  'Altcoin',
  'Portfolio',
  'Smart contract',
  'Digital asset',
  'Wearable',
  'Transaction',
  'Security',
  'Rug pull',
  'Governance',
  'Whitelist',
  'Bear market',
  'Bull market',
  'Community',
  'Private key',
  'Public key',
  'Liquidity',
  'Staking',
  'Transaction fee',
  'Protocol',
  'Interoperability',
  'Zero knowledge',
  'Scalability',
  'Bytecode',
  'Optimistic rollup',
  'Value layer',
  'User experience',
  'Sidechain'
]

export const getShuffledWordList = (): string[] => shuffleArray([...wordList])

export const shuffleArray = (arr: string[]): string[] =>
  arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
