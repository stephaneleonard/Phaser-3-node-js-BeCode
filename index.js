const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Player = require("./models/Player");

const Room = require("./models/Room");

const playerArray = {};
const rooms = [null, null, null, null, null, null, null, null, null, null];

let roomCount = 0;
let incrementName = 1;
let nameRoom = "Room" + incrementName;

app.use(express.static("public"));
// app.use(express.static("/phaser3-parcel-template/dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  const id = socket.id;
  const player = new Player(id);
  let roomID = null;

  io.to(id).emit("socketID", id);

  //add player to the playerArray
  playerArray[id] = player;
  console.log(playerArray);

  //get the new position from a client
  socket.on("position", (obj) => {
    const player = playerArray[socket.id];
    player.move(obj);

    socket.broadcast
      .to(roomID)
      .emit("playerPosition", [id, player.positionX, player.positionY]);
  });
  socket.on("Imlog", () => {
    io.sockets.emit("log", rooms);
  });

  //test room
  socket.on("createRoom", () => {
    console.log("event createRoom");
    let found = false;
    for (let i = 0; found == false && i<10; i++) {
      if (rooms[i] == null) {
        const room = new Room(i, incrementName);
        incrementName++;
        console.log("incrementName", incrementName);
        roomCount++;
        rooms[i] = room;
        found = true;
      }
    }
    console.log("rooms", rooms);

    io.sockets.emit("update", rooms);
  });

  //test room

  socket.on("join", (data) => {
    //console.log('data',data,rooms);

    const select = rooms[data];

    console.log("select1", select);

    //Add player to the room if possible
    const res = select.join(player);
    console.log(select);
    if (res) {
      roomID = select.id;
      socket.join(roomID);
      console.log("roomID", roomID);

      //console.log('select',select);

      socket.emit("playerJoinRoom", rooms);
      //app.use('/')

      if (select.length >= 4) {
        io.sockets.in(roomID).emit("party_ready", select.playerArray);

        //rooms.splice(rooms.indexOf(select),1);

        // console.log(rooms);
        console.log("game");
      }
    }
  });

  socket.on("hit", (dir) => {
    // check if hit
    player.hasHitOtherPlayer(playerArray, dir, io);
    //console.log(playerArray);
    // update damage count on players hit and send this value to those player
  });

  socket.on("disconnect", () => {
    //console.log(`player ${id} disconected`);
    // delete this player from the array
    delete playerArray[id];
  });

  socket.on("die", () => {
    console.log("roomID", roomID);
    console.log("dead");
    //update number of dead in the game
    const res = rooms[roomID].dead();
    if (res) {
      io.sockets.in(roomID).emit("party_ended");
      socket.leave(roomID);
      rooms[roomID] = null;
      roomCount--;
      console.log("rooms after delete", rooms);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running`);
});
