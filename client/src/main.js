import Phaser from "phaser";

import HelloWorldScene from "./scenes/HelloWorldScene";
import GameScene from "./scenes/GameScene";
import smashGameScene from "./scenes/smashGameScene";
const socket = io();

document.addEventListener("keypress", (e) => {
  if (e.code == "KeyW") {
    socket.emit("keypress", 1);
  }
  if (e.code == "KeyS") {
    socket.emit("keypress", 2);
  }
  if (e.code == "KeyA") {
    socket.emit("keypress", 3);
  }
  if (e.code == "KeyD") {
    socket.emit("keypress", 4);
  }
});

socket.on("playerPosition", (obj) => {
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
  scene: [smashGameScene],
};
