import Phaser, { Scene } from "phaser";

import GameScene from "./scenes/GameScene";
import WelcomeScene from "./scenes/Welcome";
import Preload from "./scenes/preloadScene";
// import smashGameScene from "./scenes/smashGameScene";
export const socket = io();
export let socketID = null;

socket.on("socketID", (obj) => {
  socketID = obj;
});

socket.on("party_ready", (obj) => {
  // update playerArray
  console.log("ready");
  let playerArray = obj;
  let me = { ...obj[socketID] };
  delete playerArray[socketID];
  game.scene.start("hello-world", { playerArray: playerArray, me: me });
});

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false,
    },
  },
  scene: [Preload, GameScene],
};
const game = new Phaser.Game(config);
