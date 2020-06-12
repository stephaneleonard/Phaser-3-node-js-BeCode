import Phaser, { Scene } from "phaser";

import GameScene from "./scenes/GameScene";
import Preload from "./scenes/preloadScene";
import HelloWorldScene from "./scenes/GameScene";

import WelcomeScene from "./scenes/WelcomScene";
// import smashGameScene from "./scenes/smashGameScene";
export const socket = io();
export let socketID = null;

//il a son id
//       -choix entre créer et rejoindre

socket.on("socketID", (obj) => {
  socketID = obj;
});

socket.on("party_ready", (obj) => {
  // update playerArray
  console.log("ready");
  console.log("playerArray" , obj);
  let playerArray = obj;
  let me = { ...obj[socketID] };
  delete playerArray[socketID];
  game.scene.start("hello-world", { playerArray: playerArray, me: me });
});

socket.on("playerJoinRoom", (data) => {
  console.log("Player has join room", data);
  console.log(data);
  game.scene.start("game-scene");
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
  scene: [WelcomeScene, Preload, GameScene],
};
const game = new Phaser.Game(config);
