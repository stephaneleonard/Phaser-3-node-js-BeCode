import Phaser, { Scene } from "phaser";

import HelloWorldScene from "./scenes/GameScene";
import GameScene from "./scenes/preloadScene";
// import smashGameScene from "./scenes/smashGameScene";
export const socket = io();
export let socketID = null;

socket.on("socketID", (obj) => {
  socketID = obj;
});

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: [GameScene, HelloWorldScene],
};
const game = new Phaser.Game(config);
