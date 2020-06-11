import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("welcom-scene");
  }

  preload(){

    this.load.image("background", "/assets/background_final.png");
    this.load.image('button', "/assets/button.png");
    this.load.image('room',"/assets/dude.png")
  }

  create(){

    this.add.image(300,200,'background');
    const buttonCreate = this.add.sprite(400,500,"button").setInteractive();    

    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */
    //let buttonJoin('button');

    let nameRoomIncrement = 0;

    buttonCreate.on('pointerdown',()=>
      {
        socket.emit('createRoom',`Room${ + nameRoomIncrement + 1}`);
        nameRoomIncrement++;

        const room = this.add.sprite(100,100,'room')
      }
    );
    

    socket.on('update',(data,idRoom = 111)=>
        {
            console.log('update',data);
            //create image and increment

            buttonCreate.on('onclick',()=> //image not button
              {
                socket.emit('join',idRoom);
              }
            );  
        }
    );


    socket.on('joinEvent',(idRoom)=> //boutton
        {
            buttonCreate.emit('join',idRoom);
        }
    );


    socket.on('playerJoinRoom',(data)=>
        {
            console.log('Player has join room',data); 
        }
    );


    socket.on("party_ready",()=>
        {
            console.log('finish');
        }
    );
  }

  update() {}
}

