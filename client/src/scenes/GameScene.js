import Phaser from "phaser";
import {
  socket, socketID
} from "../main";

let player;
let otherPlayer = {};
let platforms;
let cursors;
let hit;
let direction = 1;
let arrayText = []

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
    this.load.image("background", "/assets/background_final.png");
    this.load.image("ground", "/assets/plateforme_final.png");
    this.load.spritesheet("dude", "./assets/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  /*
   * create the elements
   * input: none
   * output: none
   */
  create() {
    console.log('me', this.me);
    //on playerPosition event update the playerArray
    socket.on("playerPosition", (obj) => {
      this.updatePlayerArray(obj);
    });
    socket.on('hit', (obj) => {
      this.updateDamage(obj);
      this.updateText()
      // obj id damage
    })
    //texte

    //personnages
    this.background = this.add.image(0,0, "background");
    this.background.setScale(0.8);
    this.background.setOrigin(0,0);

    platforms = this.physics.add.staticGroup();
    platforms.create(400, 400, "ground").setScale(0.2).refreshBody();

    let damage = []
    let myDamage = this.me.damage;
    for (const key in this.playerArray) {
      if (this.playerArray.hasOwnProperty(key)) {
        let element = this.playerArray[key];
        element = element.damage
        damage.push(element)
      }
    }

    arrayText.push(addText(this, 50, "#ff0044", "player 1 \n" + myDamage + "%"))
    arrayText.push(addText(this, 250, "#F0FF00", "player 2 \n" + damage[0] + "%"))
    arrayText.push(addText(this, 450, "#6c4c7b", "player 3 \n" + damage[1] + "%"))
    arrayText.push(addText(this, 650, "#E0B3C5", "player 4 \n " + damage[2] + "%"))


    player = this.physics.add.sprite(250, 200, "dude");
    player.direction = 'right';
    player.setCollideWorldBounds(false);

    cursors = this.input.keyboard.createCursorKeys();
    hit = this.input.keyboard.addKey('c');

    this.physics.add.collider(player, platforms);
    this.displayOtherPlayer(this);
    console.log(otherPlayer);

    //animation spritesheet
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 118,
        end: 125
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", {
        start: 144,
        end: 151
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{
        key: "dude",
        frame: 131
      }],
      frameRate: 24,
    });
    this.anims.create({
      key:'hit_left',
      frames: this.anims.generateFrameNumbers('dude',{
        start:65,
        end:73
      }),
      frameRate:12,
    })
    this.anims.create({
      key:'hit_right',
      frames: this.anims.generateFrameNumbers('dude',{
        start:92,
        end:99
      }),
      frameRate:12,
    })
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
      if(player.direction == "left"){
        player.anims.play('hit_left',true);
      }
      else{
        player.anims.play('hit_right',true);
      }
      this.hitPlayer(player,direction);
    }
    
    //this.deadPlayer(player.x,player.y);
    this.updateDisplayedOtherPlayerPosition();
    
    // this.updateDamage();
    
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

  updateText() {
    console.log(this.me.damage);
    
    arrayText[0].setText("player 1 \n" + this.me.damage + "%");
    let newDamage=[]
    for (const key in this.playerArray) {
      if (this.playerArray.hasOwnProperty(key)) {
        let element = this.playerArray[key];
        element = element.damage
        newDamage.push(element)
      }
      console.log(arrayText);
      
      arrayText[1].setText("player 2 \n" + newDamage[0] + "%")
      arrayText[2].setText("player 3 \n" + newDamage[1] + "%")
      arrayText[3].setText("player 4 \n" + newDamage[2] + "%")
  }
}


  hitPlayer(player, direction) {
    if (player.direction == 'right') {
      direction = 1;
    } else {
      direction = 0;
    }
    console.log(`i try to kill you in position ${player.x}, ${player.y}, ${player.direction}`);
    socket.emit('hit', direction);
  }

  updateDamage(obj) {
    if (this.me.socketID == obj[0]) {
      this.me.damage = obj[1]
    } else {
      this.playerArray[obj[0]].damage = obj[1];
    }
    
  }

  deadPlayer(positionX,positionY){

    if(positionY > 700 ){
      player.destroy();
      console.log('you died');
    }
    else if(positionY< -200){
      player.destroy();
      console.log('you died');
    }

    if(positionX > 900 ){
      player.destroy();
      console.log("you're die");
    }
    else if(positionX< -200){
      player.destroy();
      console.log('you died');
    }
  }
}


function addText(scene, x, fill, text) {
  var style = {
    font: "25px Arial",
    fill: fill,

  };
  return scene.add.text(x, 440, text, style)

}