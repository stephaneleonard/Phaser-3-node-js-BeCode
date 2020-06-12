import Phaser from "phaser";
import { socket, socketID } from "../main";
let enter;
const musicConfigThunder = {
    mute: false,
    volume: 1,
    rate: 1,
    detune:0,
    seek:0,
    loop:false,
    delay:0
  }
export default class End extends Phaser.Scene {
  constructor() {
    super("end");
  }
  preload(){
    this.load.image('startBackground','/assets/start.png');
    this.load.audio('thunder', '/assets/thundr04.mp3');
  }

  create() {

    // music system
    this.background = this.add.image(-120,0,'startBackground');
    this.background.setOrigin(0,0);
    this.background.setScale(0.8);
    this.thunder = this.sound.add('thunder');
    this.thunder.play(musicConfigThunder)

    enter = this.input.keyboard.addKey('Enter');


    this.add.text(300,400,"GAME OVER!", {color: "black", fontSize:'25px'});
    this.add.text(230,450,"press enter to refresh", {color: "black", fontSize:'25px'});

    
  }

  update() {

    if(Phaser.Input.Keyboard.JustDown(enter)){
      this.scene.start('welcome');
    }

  }
}
