import Phaser from "phaser";


export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  create() {
    this.background = this.add.image(0,0,'background');
    this.background.setOrigin(0,0);
  }

  createPlatforms() {
    
  }

  createPlayer() {
  }

  update() {}
}
