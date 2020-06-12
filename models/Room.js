module.exports = class Room {
  constructor(id, name, displayX, displayY) {
    this.id = id;
    this.name = name;
    this.playerArray = {};
    this.length = 0;
    this.displayX = displayX;
    this.displayY = displayY;
  }

  join = (player) => {
    if (this.length < 2) {
      this.playerArray[player.socketID] = player;
      this.length++;
      return true;
    }
    else{
        return false;
    }
  };
};
