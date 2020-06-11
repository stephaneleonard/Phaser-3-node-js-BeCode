import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("welcom-scene");
  }




  create() {
    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */

    
     
    socket.emit('createRoom',{name:'hombre'})
   
  }

  update() {}
}

