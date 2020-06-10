module.exports = class Player {
  constructor(socket) {
    this.socketID = socket;
    this.positionX = 100;
    this.positionY = 100;
<<<<<<< HEAD
=======
    //player damage
    this.damage = 5; 
>>>>>>> master
  }

  move(array){

    this.positionX = array[0];
    this.positionY = array[1];
  }
};

<<<<<<< HEAD
  //     if(key == 1){
  //         this.positionX += 2;
  //     }
  //     else if(key == 2){
  //       this.positionX -= 2;
  //     }
  //     else if(key == 3){
  //       this.positionY += 2;
  //     }
  //     else if(key == 4){
  //       this.positionY -= 2;
  //     }
  // }

=======
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
};
>>>>>>> master
