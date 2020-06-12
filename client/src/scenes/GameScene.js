import Phaser from "phaser";
import {
  socket,
  socketID
} from "../main";

let player;
let otherPlayer = {};
let platforms;
let cursors;
let hit;
let direction = 1;
let arrayText = [];
let jumpCount = 2;
let damage = [];

const backgroundTab = [
  "/assets/background_final.png",
  "/assets/Map_2.png",
  "/assets/Map_3.png",
];

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }



  /*
   * preload the sprites and images
   * input: none
   * output: none
   */
  preload() {
    this.load.image("background", backgroundTab[this.randomNumber(3)]);
    this.load.image("ground", "/assets/plateforme2.png");
    this.load.spritesheet("dude", "./assets/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.audio('themeSong','/assets/theme.ogg');
  }



  /*
   * create the elements
   * input: none
   * output: none
   */
  create() {
    cursors = this.input.keyboard.createCursorKeys();
    hit = this.input.keyboard.addKey("c");
    let myDamage = this.me.damage;


    const musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune:0,
      seek:0,
      loop:true,
      delay:0
    }
    this.music = this.sound.add('themeSong');
    this.music.play(musicConfig);
  
    //on playerPosition event update the playerArray
    socket.on("playerPosition", (obj) => {
      this.updatePlayerArray(obj);
    });

    socket.on("hit", (obj) => {
      // obj id damage
      this.updateDamage(obj);
      this.updateText();
    });
    //texte

    //display
    this.background = this.add.image(0, 0, "background");
    this.background.setScale(0.7);
    this.background.setOrigin(0, 0);
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 400, "ground").setScale(0.2).refreshBody();

    this.pushDamageInArray()

    //update display damage
    arrayText[0] = (this.addText(this, 50, "#ff0044", "player 1 \n" + myDamage + "%"));
    arrayText[1] = (this.addText(this, 250, "#F0FF00", "player 2 \n" + damage[0] + "%"));
    arrayText[2] = (this.addText(this, 450, "#c920f6", "player 3 \n" + damage[1] + "%"));
    arrayText[3] = (this.addText(this, 650, "#E0B3C5", "player 4 \n " + damage[2] + "%"));

    //physics
    player = this.physics.add.sprite(250, 200, "dude");
    player.direction = "right";
    player.setCollideWorldBounds(false);
    this.physics.add.collider(player, platforms);
    this.displayOtherPlayer(this);

    //animation spritesheet
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 118,
        end: 125,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 144,
        end: 151,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{
        key: "dude",
        frame: 131,
      }, ],
      frameRate: 24,
    });

    this.anims.create({
      key: "hit_left",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 66,
        end: 72,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "hit_right",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 92,
        end: 98,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }


  /*
   * update the elements and send player position via socket.io
   * input: none
   * output: none
   */
  update() {
    if (this.me.knockback != 0) {
      this.knockBack();
      socket.emit("position", [player.x, player.y]);

    } else if (cursors.left.isDown) {
      this.moveLeft()
      socket.emit("position", [player.x, player.y]);

    } else if (cursors.right.isDown) {
      this.moveRight()
      socket.emit("position", [player.x, player.y]);

    } else {
      this.turn()
      socket.emit("position", [player.x, player.y]);
    }

    this.doubleJump()
    this.animeAttack()
    this.deadPlayer(player.x, player.y);
    this.updateDisplayedOtherPlayerPosition();
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

      if(otherPlayer[e].x > this.playerArray[e].positionX){
        otherPlayer[e].x = this.playerArray[e].positionX;
        otherPlayer[e].y = this.playerArray[e].positionY;
        otherPlayer[e].anims.play('left');
      }
      else if(otherPlayer[e].x < this.playerArray[e].positionX){
        otherPlayer[e].x = this.playerArray[e].positionX;
        otherPlayer[e].y = this.playerArray[e].positionY;
        otherPlayer[e].anims.play('right');
      }else{
        otherPlayer[e].x = this.playerArray[e].positionX;
        otherPlayer[e].y = this.playerArray[e].positionY;
        otherPlayer[e].anims.play('turn');
      }
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


  /*
   * get all players Damage
   * input: none
   * output: none
   */
  updateText() {
    arrayText[0].setText("player 1 \n" + this.me.damage + "%");
    let newDamage = [];
    for (const key in this.playerArray) {
      if (this.playerArray.hasOwnProperty(key)) {
        let element = this.playerArray[key];
        element = element.damage;
        newDamage.push(element);
      }
      console.log(arrayText);

      arrayText[1].setText("player 2 \n" + newDamage[0] + "%");
      arrayText[2].setText("player 3 \n" + newDamage[1] + "%");
      arrayText[3].setText("player 4 \n" + newDamage[2] + "%");
    }
  }

  moveLeft() {
    player.direction = "left";
    player.setVelocityX(-160);
    player.anims.play("left", true);
  }
  moveRight() {
    player.direction = "right";
    player.setVelocityX(160);
    player.anims.play("right", true);
  }
  turn() {
    player.setVelocityX(0);
    player.anims.play("turn");
  }
  animeAttack() {
    if (Phaser.Input.Keyboard.JustDown(hit)) {
      if (player.direction == "left") {
        player.anims.play("hit_left", true);
      } else {
        player.anims.play("hit_right", true);
      }
      this.hitPlayer(player, direction);
    }
  }
  hitPlayer(player, direction) {
    if (player.direction == "right") {
      direction = 1;
    } else {
      direction = 0;
    }
    console.log(
      `i try to kill you in position ${player.x}, ${player.y}, ${player.direction}`
    );
    socket.emit("hit", direction);
  }

  updateDamage(obj) {
    // obj[0] = id , obj[1] = damage , obj[2] = direction
    if (this.me.socketID == obj[0]) {
      this.me.damage = obj[1];
      console.log("outch");
      if (obj[2] == 1) {
        this.me.knockback = 10;
      } else {
        this.me.knockback = -10;
      }
    } else {
      this.playerArray[obj[0]].damage = obj[1];
    }
  }

  randomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  deadPlayer(positionX, positionY) {
    if (positionY > 700) {
      player.destroy();
      this.music.stop();
      this.scene.start('Welcome');
      socket.emit('die');
      console.log("you died");
    } else if (positionY < -200) {
      player.destroy();
      this.music.stop();
      this.scene.start('Welcome');
      socket.emit('die');
      console.log("you died");
    }

    if (positionX > 1000) {
      player.destroy();
      this.music.stop();
      this.scene.start('Welcome');
      socket.emit('die');
      console.log("you're die");
    } else if (positionX < -200) {
      player.destroy();
      this.music.stop();
      this.scene.start('Welcome');
      console.log("you died");
    }
  }
  doubleJump() {

    if (player.body.onFloor()) {
      jumpCount = 2;
    }
    const didPressJump = Phaser.Input.Keyboard.JustDown(cursors.up);
    if (didPressJump) {

      if (player.body.onFloor()) {
        jumpCount--
        this.canDoubleJump = true;
        player.body.setVelocityY(-200);
      } else if (!player.body.onFloor() && jumpCount > 0) {
        this.canDoubleJump = true;
        jumpCount--;
        player.body.setVelocityY(-200);

        if (this.canDoubleJump) {

          this.canDoubleJump = false;
          player.body.setVelocityY(-200);
        }
      }
    }
  }
  knockBack() {
    if (this.me.knockback < 0) {
      player.direction = "left";
      player.setVelocityX(-10 * this.me.damage);
      player.anims.play("left", true);
      this.me.knockback++;
    } else {
      player.direction = "right";
      player.setVelocityX(10 * this.me.damage);
      socket.emit("position", [player.x, player.y]);
      player.anims.play("right", true);
      this.me.knockback--;
    }

  }

  /*
   * get all players damage 
   * input: none
   * output: none
   */
  pushDamageInArray() {
    for (const key in this.playerArray) {
      if (this.playerArray.hasOwnProperty(key)) {
        let element = this.playerArray[key];
        element = element.damage;
        damage.push(element);
      }
    }
  }


  /*
   * display damage % 
   * input: none
   * output: none
   */
  addText(scene, x, fill, text) {
    var style = {
      font: "25px Arial",
      fill: fill,
    };
    return scene.add.text(x, 440, text, style);
  }
}