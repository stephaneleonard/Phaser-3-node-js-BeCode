module.exports = class Player {
  constructor(socket) {
    this.socketID = socket;
    this.positionX = 100;
    this.positionY = 100;
  }

  move(key){
      if(key == 1){
          this.positionX += 2;
      }
      else if(key == 2){
        this.positionX -= 2;
      }
      else if(key == 3){
        this.positionY += 2;
      }
      else if(key == 4){
        this.positionY -= 2;
      }
  }
};
