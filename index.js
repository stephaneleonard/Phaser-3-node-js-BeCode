const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Player = require("./models/Player");

const Room = require("./models/Room");

const playerArray = {};
const rooms = [];

let roomCount = 0;

app.use(express.static("public"));
// app.use(express.static("/phaser3-parcel-template/dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  const id = socket.id;
  const player = new Player(id);
  io.to(id).emit("socketID", id);

  //add player to the playerArray
  playerArray[id] = player;
  console.log(playerArray);
  if (Object.keys(playerArray).length >= 2) {
    io.emit("party_ready", playerArray);
    //console.log("test");
  }
  //console.log(`player ${id} connected`);

  //get the new position from a client
  socket.on("position", (obj) => {
    const player = playerArray[socket.id];
    player.move(obj);
   }); 


    socket.broadcast.emit("playerPosition", [
      id,
      player.positionX,
      player.positionY,
    ]);

    
  //test room
    socket.on("createRoom", (data) => {
      console.log("event createRoom");

      //data.name
      const room = new Room(roomCount, data);
      roomCount++;
      rooms.push(room);
      console.log('rooms' , rooms);

      io.sockets.emit("update", rooms);
    });

    //test room

  socket.on('join',(data)=>
    {
      const select = rooms.filter(room => data.id === room.id);
      Object.keys(playerArray).push(player);
      select.length ++;
      
      console.log(select);
      

      socket.emit('playerJoinRoom',rooms)


      if (Object.keys(playerArray).length >= 2) {
        io.emit("party_ready", playerArray);

        console.log("game");
      }
    }
  );
    
  

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

  
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running`);
});
