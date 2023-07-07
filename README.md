# Project description

This project contains interactive scene created for Decentraland Game Jam 2023 based on the theme 'Lucid Dreams'. It is written using Decentraland SDK version 7. All of the code and models have been created during the contest period. Scene doesn't connect to external servers.

Currently deployed under Decentraland name `LucidDreams`. Follow [this link](https://play.decentraland.org/?realm=LucidDreams.dcl.eth) or type in the Decentraland chatbox `/changerealm LucidDreams.dcl.eth` to visit the scene.

Experience consists of three levels, each with a mini-game that needs to be completed in order to move on to the next level. There are no instructions in-game as I tried to create the experience self-explanatory. I usually don't read instructions myself and quickly click through dialogs when talking with NPCs.

#### Level 1 - Nightmare

User needs to correctly guess 5 words by playing word guessing game 'Hangman'. Word selection for this game is stored in this repository.
![Level 1 - Nightmare](screenshots/game-level1.png)

#### Level 2 - Lost in dream

User needs to find exit to maze by opening doors with levers.
![Level 2 - Lost in dream](screenshots/game-level2.png)

#### Level 3 - Sweet dream

User needs to complete 10 rounds of reaction game by stepping on the tile with correct color and symbol before time runs out.
![Level 3 - Sweet dream](screenshots/game-level3.png)

## Use of AI

#### Blockade Labs Skybox AI Tool

Skybox for each level generated using [Blockade Labs Skybox AI Tool](https://skybox.blockadelabs.com/)

- First level [skybox](https://skybox.blockadelabs.com/c969b36096aa7556ec4c58293257422e)
  ![Level 1 - Skybox](screenshots/skybox-level1.png)

- Second level [skybox](https://skybox.blockadelabs.com/31344ff34f0fa14a7c30093f0abc740f)
  ![Level 2 - Skybox](screenshots/skybox-level2.png)

- Third level [skybox](https://skybox.blockadelabs.com/36833a73d3793e69c6d7e5cdc8b85663)
  ![Level 3 - Skybox](screenshots/skybox-level3.png)

#### Midjourney

Textures for second level maze generated using [Midjourney](https://www.midjourney.com/)

- Bricks - bottom right image
  ![Brick texture generated using Midjourney](screenshots/midjourney-bricks.png)

- Grass - top left image
  ![Bricks with moss texture generated using Midjourney](screenshots/midjourney-grass.png)

#### ChatGPT

Advice and code fragments from my colleague [ChatGPT](https://chat.openai.com/)

- Helping me with a base code for the color game
  ![ChatGPT code](screenshots/chat-gpt-code.png)

- Giving me some ideas for mini-games
  ![ChatGPT games](screenshots/chat-gpt-games.png)

- Helping me come up with words for 'Hangman' game
  ![ChatGPT words](screenshots/chat-gpt-words.png)

## Copyright info

This scene is protected with a standard Apache 2 licence. See the terms and conditions in the [LICENSE](/LICENSE) file.
