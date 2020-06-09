import Phaser from 'phaser';

export default class SceneStart extends Phaser.Scene{
    constructor(){
        super('bootGame');
    }
    
    preload(){
        
        this.load.image('background', '/assets/background.png')
        this.load.image('ground', '/assets/platform.png');
        this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }
    create(){

    this.add.text(200,200, 'Farting Ponies',{color:"red", fontSize:"50px" });
    this.add.text(200,300,"press ENTER", {color: "black", fontSize:'25px'});
}
}