import Phaser from "phaser";
import {
  socket
} from "../main";

let player;
let otherPlayer = {};
let platforms;
let cursors;
let hit;
let direction = 1;

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }

  /*
   * load the otherPlayer array into this scene
   * input: otherPlayerArray from the previous scene
   * output: none
   */
  init(data) {
    this.playerArray = data.playerArray;
    this.me = data.me;
  }

  /*
   * preload the sprites and images
   * input: none
   * output: none
   */
  preload() {
    this.load.image("background", "/assets/background.png");
    this.load.image("ground", "/assets/platform.png");
    this.load.spritesheet("dude", "./assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  /*
   * create the elements
   * input: none
   * output: none
   */
  create() {
    console.log('me' , this.me);
    //on playerPosition event update the playerArray
    socket.on("playerPosition", (obj) => {
      this.updatePlayerArray(obj);
    });
    socket.on('hit' , (obj)=>{
      console.log(obj);
      // obj id damage
    })
    //texte

    //personnages
    this.add.image(400, 300, "background");

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 400, "ground");
    // texte = "Player 1 \n 20%";
    // // style si nécessaire ->     
    addText(this, 50, "#ff0044", "player 1 \n 20%")
    addText(this, 250, "#F0FF00", "player 2 \n 25%")
    addText(this, 450, "#6c4c7b", "player 3 \n 30%")
    addText(this, 650, "#E0B3C5", "player 4 \n 40%")

    player = this.physics.add.sprite(250, 300, "dude");
    player.direction = 'right';

    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    hit = this.input.keyboard.addKey('c');

    this.physics.add.collider(player, platforms);
    this.displayOtherPlayer(this);
    console.log(otherPlayer);

    //animation spritesheet
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 0,
        end: 3
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 5,
        end: 8
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{
        key: "dude",
        frame: 4
      }],
      frameRate: 20,
    });
  }

  /*
   * update the elements and send player position via socket.io
   * input: none
   * output: none
   */
  update() {
    if (cursors.left.isDown) {
      player.direction = 'left'
      player.setVelocityX(-160);
      socket.emit("position", [player.x, player.y]);
      player.anims.play("left", true);
    } else if (cursors.right.isDown) {
      player.direction = 'right';
      player.setVelocityX(160);
      socket.emit("position", [player.x, player.y]);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
      socket.emit("position", [player.x, player.y]);
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }

    if(Phaser.Input.Keyboard.JustDown(hit)){
        this.hitPlayer(player,direction);
    }
    this.updateDisplayedOtherPlayerPosition();
  }

  /*
   * create other player sprites and add them to the other player array
   * input: none
   * output: none
   */
  displayOtherPlayer(self) {
    console.log("playerArray", self.playerArray);

    Object.keys(this.playerArray).forEach((e) => {
      let pl = self.physics.add.sprite(270, 300, "dude");
      pl.setCollideWorldBounds(true);
      this.physics.add.collider(pl, platforms);
      otherPlayer[e] = pl;
    });
  }

  /*
   * display the ohterPlayers to their current position
   * input: none
   * output: none
   */
  updateDisplayedOtherPlayerPosition() {
    Object.keys(this.playerArray).forEach((e) => {
      otherPlayer[e].x = this.playerArray[e].positionX;
      otherPlayer[e].y = this.playerArray[e].positionY;
    });
  }


  /*
   * get the new position from the server and update it in the playerArray
   * input: an array of [socketID , posX , posY];
   * output: none
   */
  updatePlayerArray(obj) {
    this.playerArray[obj[0]].positionY = obj[2];
    this.playerArray[obj[0]].positionX = obj[1];
  }

  hitPlayer(player,direction){
    if(player.direction == 'right'){
      direction = 1;
    }else{
      direction =0;
    }
    console.log(`i try to kill you in position ${player.x}, ${player.y}, ${player.direction}`);
    socket.emit('hit',direction);
  }
}

function addText(scene, x, fill, text) {
  var style = {
    font: "25px Arial",
    fill: fill,

  };
  scene.add.text(x, 440, text, style)
}