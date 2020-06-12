module.exports = class Room
{
    constructor(id,name,displayX,displayY)
    {
        this.id =id;
        this.name = name;
        this.playerArray = {};
        this.length = 0;
        this.displayX = displayX;
        this.displayY = displayY;
    }

    join =(player)=>
    {
        this.playerArray[player.socketID] = player;
        this.length ++;
    }
    
}