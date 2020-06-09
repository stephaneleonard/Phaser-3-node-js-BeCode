import Phaser from 'phaser';
import { socket } from "../main.js";
import Player from "../../../models/Player";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
const game = new Phaser.Game(config);


let player;
let cursors;
let platforms;

 function preload ()
{
    this.load.image('background', '/assets/background.png');
    this.load.image('ground', '/assets/platform.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

 function create ()
{
    this.background = this.add.image(0, 0, 'background');
    this.background.setOrigin(0,0)
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 400, 'ground');
    platforms.setOrigin(0,0);

    socket.on('socketID', ()=>{
        console.log('coucou');
        this.player = this.physics.add.sprite(250, 300, 'dude');
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(player, platforms);
    })

    // player = this.physics.add.sprite(250, 300, 'dude');

    // player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    // this.physics.add.collider(player, platforms);

    //this.physics.add.collider(player2,platforms);

    //animation spritesheet
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
}

    function update ()
{
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        socket.emit("position",[player.x, player.y]);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        socket.emit("position",[player.x, player.y]);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
        socket.emit("position",[player.x, player.y]);

    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}
