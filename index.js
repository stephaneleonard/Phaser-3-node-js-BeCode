const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Player = require('./models/Player');

const playerArray = {};

app.use(express.static("public"));
// app.use(express.static("/phaser3-parcel-template/dist/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/phaser3-parcel-template/dist/index.html");
});

io.on("connection", (socket) => {
  const id = socket.id
  const player = new Player(id);
  playerArray[id] = player;
  console.log(playerArray);
  console.log('new connection')
  socket.on("keypress", (obj) => {
    const player = playerArray[socket.id];
    player.move(obj);
    io.emit("playerPosition", [id , player.positionX , player.positionY]);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running`);
});
