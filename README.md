# Armed Bandit (Slot Machine)
## Built with Cocos Creator V2.4.4, inspired by https://github.com/FlavioFS/slot-test-client/tree/dependabot/npm_and_yarn/slotclient/axios-0.21.1
![alt text](https://github.com/NigelCusc/ArmedBandit/blob/main/armed_bandit_image.jpg?raw=true)
Nigel Cuschieri

## Functionality:
- The slot machine consists of three winning lines.
- Number of reels may be adjusted on the Bandit Node. This will generate the reels automatically.
- Tiles are also modular. Save any other images in the 'Texture/Tiles' folder, increase the Tile Count in 'Main' node and in Tile Prefab. Link the texture on Tile Prefab as well.
- Responsive UI.

## Steps:
- Open application via browser or simulator. 
- Press spin button to start the spinning of the reels and press the stop button to stop their spinning. This will give us a random result. 
- Matching winning lines will temporarily glow after spin is complete.

## TO DO: 
- Add tests using Jest
- Create Docker Container
