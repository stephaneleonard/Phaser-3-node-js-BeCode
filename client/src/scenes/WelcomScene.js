import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("welcom-scene");
  }

  

  preload(){

    this.load.image("background", "/assets/start.png");
    this.load.image("background2", "/assets/backgroundroom.png")
    this.load.image('button', "/assets/button.png");
    this.load.image('room',"/assets/Map_2.png");
    this.load.image('room1',"/assets/Map_3.png");
    this.load.image('room2',"/assets/background_final.png");
    
  }

  create(){


    socket.emit('log')
    this.add.image(350,300,'background');
    let buttonCreate = this.add.sprite(400,500,"button").setInteractive();   
    buttonCreate.setScale(0.7);
    let label_button = this.add.text( 120 , 500, 'click to create room', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    label_button.setColor('green')

    let title = this.add.text(300 , 0, `Welcome to the game`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
    title.setColor('black');
    title.setFontSize(30)

    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */
    //let buttonJoin('button');
    
    
    buttonCreate.on('pointerdown',()=>
      {
        socket.emit('createRoom');

        let background2 = this.add.image(350,300,'background2');
        background2.setScale(5)

        // let buttonCreate = this.add.sprite(400,500,"button").setInteractive();   
        // buttonCreate.setScale(0.7);
        // let label_button = this.add.text( 120 , 500, 'click to create room', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        // label_button.setColor('green')

        let labelJoin = this.add.text(30 , 30, `Join a Room`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
        labelJoin.setColor('green');
        //labelJoin.setSize('large');

        // roomImage = this.add.sprite(displayRoomX,displayRoomY,'room').setInteractive();
        // displayRoomY += 20;

      }
    );



    const imageParties = ['room','room1','room2'];
    let roomImage
    let image = 0;

    //let inputRoomImage = {};
    socket.on('update',(data)=>
      {
        

         console.log('update',data);
        // console.log('dataY',data.displayY);
        data.forEach(element => {
              
          roomImage = this.add.sprite(element.displayX,element.displayY,imageParties[image]).setInteractive();
          roomImage.setScale(0.1);
          
      
          let text = this.add.text(element.displayX - 70 , element.displayY+50, `Welcom to the room${element.name}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
          //let text2 = this.add.text(element.displayX -70 , element.displayY+70, `Nombre de participant : ${element.length}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
          text.setColor('green')
          //text2.setColor('green')

        //inputRoomImage[data.name] = roomImage
        //log increment
        console.log(image);

        image < imageParties.length-1 ? image ++ : image = 0;

        roomImage.on('pointerdown',()=> 
          {
            socket.emit('join',roomImage);
            console.log('pointerdown room image',roomImage); 
          }
        );
      } 
    );
});

    socket.on('joinEvent',(idRoom)=> //boutton
        {
          buttonCreate.emit('join',idRoom);
        }
    );


    socket.on("party_ready",()=>
        {
          console.log('finish');
        }
    );


    socket.on("go",()=>
        {
          console.log('finish');
        }
    );
  }

  update() {}
}





// socket.on('playerJoinRoom',(data)=>
    //     {
    //       console.log('Player has join room',data);
    //       console.log(data);
           
    //     }
    // );




// socket.on('log',(data)=>
    //   {
    //     console.log('connection',data);
        
    //     console.log('update',data);
    //     console.log('dataY',data.displayY);

    //     data.forEach(element => {
    //       roomImage = this.add.sprite(element.displayX,element.displayY,'room').setInteractive();
    //     });
        
    //     //inputRoomImage[data.name] = roomImage
    //     //log increment
    //     console.log(roomImage);
        

    //     roomImage.on('pointerdown',()=> 
    //       {
    //         socket.emit('join',roomImage);
    //         console.log('pointerdown room image',roomImage); 
    //       }
    //     ); 
    //   }
    // );