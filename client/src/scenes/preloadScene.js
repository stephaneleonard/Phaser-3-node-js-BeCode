import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */
    socket.on("party_ready", (obj) => {
      // update playerArray
      let playerArray = obj;
      delete playerArray[socketID];
      this.scene.start("hello-world", { playerArray: playerArray });
    });
  }

  update() {}
}
