import Phaser from "phaser";
import { socket, socketID } from "../main";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("welcomescene");
  }

  preload() {
    this.load.image("background", "/assets/background_final.png");
    this.load.image("button", "/assets/button.png");
    this.load.image("room", "/assets/star.png");
  }

  create() {
    this.add.image(300, 200, "background");
    console.log("coucou");

    const buttonCreate = this.add.sprite(400, 500, "button").setInteractive();

    /*
     * when party is ready launch next scene and pass it the array with the other players object
     *
     */
    //let buttonJoin('button');

    buttonCreate.on("pointerdown", () => {
      socket.emit("createRoom");

      // roomImage = this.add.sprite(displayRoomX,displayRoomY,'room').setInteractive();
      // displayRoomY += 20;
    });

    let roomImage;

    //let inputRoomImage = {};
    socket.on("update", (data) => {
      data.forEach((element) => {
        if (element) {
          const roomID = element.id;
          console.log("update", element);
          console.log("dataY", element.displayY);

          roomImage = this.add
            .sprite(element.displayX, element.displayY, "room")
            .setInteractive();
          //inputRoomImage[data.name] = roomImage
          //log increment
          console.log("roomimage", roomImage);

          roomImage.on("pointerdown", () => {
            socket.emit("join", roomID);
            console.log("pointerdown room image", roomImage);
          });
        }
      });
    });

    socket.on(
      "joinEvent",
      (
        idRoom //boutton
      ) => {
        buttonCreate.emit("join", idRoom);
      }
    );

    socket.on("party_ready", () => {
      console.log("finish");
    });
  }

  update() {}
}
