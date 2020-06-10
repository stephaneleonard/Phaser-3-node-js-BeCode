module.exports = class Player {
  constructor(socket) {
    this.range = 20;
    this.socketID = socket;
    this.positionX = 100;
    this.positionY = 100;
    //player damage
    this.damage = 5;
  }

  move(array) {

    this.positionX = array[0];
    this.positionY = array[1];
  }

  /*
   * update player damage counter
   * input: int
   * output: none
   */
  setPlayerDamage(damage) {
    //add damage taken to the damage property
    this.damage += damage;
  }

  /*
   * send player damage counter
   * input: none
   * output: int
   */
  getPlayerDamage() {
    // send player damage
    return this.damage;
  }

  hasHitOtherPlayer(playerArray, direction) {
    const self = this;
    let distance;
    // 0 = right 1 = left
    if (direction) {
      distance = this.positionX + 32 + this.range;
    } else {
      distance = this.positionX - 32 - this.range;
    }
    Object.keys(playerArray).forEach((e) => {
      //if it's not the same player calculate
      if (self.socketID != e) {
        // 0 = right 1 = left
        if (!direction) {
          distance = this.positionX + 32 + this.range;
          //if in range and not behind player
          if (self.positionX < playerArray[e].positionX && distance >= playerArray[e].positionX) {
            // this player has been hit
            console.log(`player: ${e} in ${playerArray[e].positionX} has been hit by ${self.socketID} on ${self.positionX}`);
          }
        } else {
          distance = this.positionX - 32 - this.range;
          if (self.positionX > playerArray[e].positionX >= distance) {
            // this player has been hit
            console.log(`player: ${e} in ${playerArray[e].positionX} has been hit by ${self.socketID} on ${self.positionX}`);
          }
        }
      }
    });
  }
};