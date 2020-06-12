import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.image("startBackground", "/assets/start.png");
  }
  create() {
    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */

    this.background = this.add.image(-120, 0, "startBackground");
    this.background.setOrigin(0, 0);
    this.background.setScale(0.8);
    this.add.text(250, 400, "Waiting for other players", {
      color: "black",
      fontSize: "25px",
    });
  }

  update() {}
}
