import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("welcom-scene");
  }

  preload(){
    

    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
    game.load.image('background','assets/misc/starfield.jpg');

  }

  create(){
    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */
    //let buttonJoin('button');


    socket.emit('createRoom','data');


    socket.on('update',(data,idRoom = 111)=>
        {
            console.log('update',data);
            
            socket.emit('join',idRoom);
        }
    );


    socket.on('joinEvent',(idRoom)=> //boutton
        {
            socket.emit('join',idRoom);
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

