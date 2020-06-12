module.exports = class Room {
  constructor(id, name, displayX, displayY) {
    this.id = id;
    this.name = name;
    this.playerArray = {};
    this.length = 0;
    this.numberOfDead = 0;
    this.displayX = 100;
    this.displayY = 100+20*this.id;
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
  dead = () => {
      this.numberOfDead ++;
      console.log('numberofDead',this.numberOfDead);
      return this.numberOfDead == 1;
  }
};
