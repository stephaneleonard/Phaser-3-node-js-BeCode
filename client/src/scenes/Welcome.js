import Phaser from "phaser";
import { socket, socketID } from "../main";
let enter;
export default class Welcome extends Phaser.Scene {
  constructor() {
    super("Welcome");
  }
  preload(){
    this.load.image('startBackground','/assets/start.png');
  }

  create() {

    // music system
    this.background = this.add.image(-120,0,'startBackground');
    this.background.setOrigin(0,0);
    this.background.setScale(0.8);

    enter = this.input.keyboard.addKey('Enter');


    this.add.text(300,400,"press ENTER", {color: "black", fontSize:'25px'});
    
  }

  update() {

    if(Phaser.Input.Keyboard.JustDown(enter)){
      this.scene.start('game-scene');
    }

  }
}
