import Phaser, { Scene } from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";
import GameScene from "./scenes/GameScene";
import SmashGameScene from "./scenes/SmashGameScene";
import SceneStart from "./scenes/SceneStart";
export const socket = io();

document.addEventListener("keypress", (e) => {
  if (e.code == "KeyW") {
    socket.emit("position", [100,100]);
  }
  if (e.code == "KeyS") {
    socket.emit("position", [100,100]);
  }
  if (e.code == "KeyA") {
    socket.emit("position", [100,100]);
  }
  if (e.code == "KeyD") {
    socket.emit("position", [100,100]);
  }
});

socket.on("playerPosition", (obj) => {
  console.log(obj);
});

socket.on("socketID", (obj) => {
  console.log(obj);
});

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [SmashGameScene],
};
