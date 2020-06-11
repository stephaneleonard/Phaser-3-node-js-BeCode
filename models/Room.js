module.exports = class Room
{
    constructor(id,name)
    {
        this.id =id;
        this.name = name;
        this.playerArray = [];
        this.length = 0;
    }

    join =(player)=>
    {
        this.playerArray[player.socketID] = player;
        this.length ++;
    }
}