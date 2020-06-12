const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Player = require("./models/Player");

const Room = require("./models/Room");

const playerArray = {};
const rooms = [];

let roomCount = 0;
let incrementName = 1;
let nameRoom = 'Room'+incrementName
let displayRoomX = 100;
let displayRoomY = 100

app.use(express.static("public"));
// app.use(express.static("/phaser3-parcel-template/dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  const id = socket.id;
  const player = new Player(id);
  io.to(id).emit("socketID", id);


  //io.sockets.emit('update',rooms)


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
  socket.on("createRoom", () =>
    {
      console.log("event createRoom");
      
      const room = new Room(roomCount, incrementName ,displayRoomX,displayRoomY);
      displayRoomY +=20;
      incrementName ++;
      console.log('incrementName',incrementName);
      
      roomCount++;
      rooms.push(room);
      console.log('rooms' , rooms);

      io.sockets.emit("update", room);
    }
  );

    //test room

  socket.on('join',(data)=>
    {
      //console.log('data',data,rooms);
      
      const select = rooms.filter(room => room.displayY === data.y);

      console.log('select1',select);
      //console.log(player);
      
      select[0].playerArray[player.socketID] = player;

      select[0].length ++;
      
      //console.log('select',select);
      

      io.sockets.emit('playerJoinRoom',rooms)
      //app.use('/')

      if (select[0].playerArray.length >= 3)
      {
        io.emit("party_ready", select[0].playerArray);

        io.sockets.emit("party_ready", select[0].playerArray)

        rooms.splice(rooms.indexOf(select),1);

       // console.log(rooms);
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

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running`);
});
