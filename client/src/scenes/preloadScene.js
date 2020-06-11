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
    //this.backgroundRoom = this.add.image(0,0,'startBackground');
    socket.on("party_ready", (obj) => {
      // update playerArray
      let playerArray = obj;
      let me = { ...obj[socketID]};
      delete playerArray[socketID];
      this.scene.start("hello-world", { playerArray: playerArray , me: me });
    });
  }

  update() {}
}
