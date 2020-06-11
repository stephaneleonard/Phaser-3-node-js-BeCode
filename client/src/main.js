import Phaser, { Scene } from "phaser";

import HelloWorldScene from "./scenes/GameScene";
import GameScene from "./scenes/preloadScene";

import WelcomeScene from "./scenes/WelcomScene";
// import smashGameScene from "./scenes/smashGameScene";
export const socket = io();
export let socketID = null;

//il a son id
 //       -choix entre créer et rejoindre 

socket.on("socketID", (obj) => {
  socketID = obj;
});


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 550,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: false
    }
  },
  scene: [WelcomeScene,GameScene, HelloWorldScene],
};
const game = new Phaser.Game(config);