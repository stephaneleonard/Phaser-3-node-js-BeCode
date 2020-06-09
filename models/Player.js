module.exports = class Player {
  constructor(socket) {
    this.socketID = socket;
    this.positionX = 100;
    this.positionY = 100;
    //player damage
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
  }

  /*
   * send player damage counter
   * input: none
   * output: int
   */
  gettPlayerDamage() {
    // send player damage
  }
};
