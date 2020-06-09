import Phaser from "phaser";
import {socket} from '../main';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    socket.on("party_ready", (obj) => {
      console.log(obj);
      this.scene.start('hello-world');
    });
  }

  update() {}
}
