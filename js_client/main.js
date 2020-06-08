var config = {
  type : Phaser.AUTO,
  width : 800,
  height : 600,
  scene : {
    preload : preload,
    create : create,
    update : update
  },
  physics : {
    default : "arcade",
    arcade : {
      gravity : {y : 500}
    }
  }

}

var player = null;
let player1 = null;
let player2 = null;
var clickBoutonHaut = false;
var clickBoutonBas = false;
var cursor = null;
var Vkey;
var boutonBas;
var boutonHaut;
var isLeftDown = false;
var isRightDown = false;
var isKickDown = false;
var isReadyToKick = true;

const game = new Phaser.Game(config);

function preload(){
  this.load.image("joueur","player.png");
  this.load.image("joueur2","player.png");
  this.load.image("joueur3","player.png");

  this.load.image("joueur_cdp","player_kick.png");
  this.load.image("joueur_walk1","player_walk1.png");
  this.load.image("joueur_walk2","player_walk2.png");
  this.load.image("haut","haut.png");
  this.load.image("bas","bas.png");
  this.load.image("castle","castle.png");
  this.load.image("snail", "snailWalk1.png");
  this.load.image("sol" , "sol.png");

  this.load.spritesheet("zombieSPS","ZombieSpriteSheet.png", {frameWidth : 80, frameHeight : 110});

  this.load.audio("kick","kick.ogg");
  this.load.audio("ready","ready.ogg");
}

function create(){
  this.sound.play("ready");
  var positionCameraCentreX = this.cameras.main.centerX;
  var positionCameraCentreY = this.cameras.main.centerY;
  this.add.sprite(positionCameraCentreX,positionCameraCentreY,"castle");
  player = this.physics.add.sprite(positionCameraCentreX,positionCameraCentreY,"joueur");
  player1 = this.physics.add.sprite(positionCameraCentreX,positionCameraCentreY,"joueur");
  player2 = this.physics.add.sprite(positionCameraCentreX,positionCameraCentreY,"joueur");



  var platforms = this.physics.add.staticGroup();
  var sol1 = this.add.sprite(100, 550, "sol");
  var sol2 = this.add.sprite(positionCameraCentreX, 550, "sol");
  platforms.add(sol1);
  platforms.add(sol2);

  this.physics.add.collider(platforms, player);
  this.physics.add.collider(platforms, player1);
  this.physics.add.collider(platforms, player2);



  var policeTitre = {
    fontSize : "52px",
    color : "#FF0000",
    fontFamily : "Coiny"
  }
  this.add.text (positionCameraCentreX , 30, "Coucou", policeTitre);

  var snail = this.add.sprite(500,positionCameraCentreY,"snail");
  snail.flipX = true;
  var tween = this.tweens.add({
    targets : snail,
    x : 700,
    ease : "Linear",
    duration : 1000,
    yoyo : true,
    repeat : -1,
    onStart : function (){},
    onComplete : function (){},
    onYoyo : function (){ snail.flipX = !snail.flipX},
    onRepeat : function (){snail.flipX = !snail.flipX}
  });

  boutonBas = this.add.sprite(50,50,"bas").setInteractive();
  boutonHaut = this.add.sprite(100,50,"haut").setInteractive();

  grossirPlayer();
  cursor = this.input.keyboard.createCursorKeys();
  Vkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);

  genererAnimations();

  this.add.sprite(300,300).play("zombieWalk");

}

function update(time, delta){
  updateGrossirPlayer();
  deplacementPlayer();   
  //posx(data);

 
}

function genererAnimations(){
  game.anims.create({
    key : "playerWalk",
    frames : [
      {key : "joueur_walk1"},
      {key : "joueur_walk2",}
    ],
    frameRate : 8,
    repeat : -1
  });

  game.anims.create({
    key : "zombieWalk",
    frames : game.anims.generateFrameNumbers("zombieSPS",{start:2, end:3}),
    frameRate : 8,
    repeat : -1
  })

  game.anims.create({
    key : "zombieStand",
    frames : [{key:"zombieSPS",frame:1}],
    frameRate : 8,
    repeat : -1
  })

  game.anims.create({
    key : "zombieIdle",
    frames : game.anims.generateFrameNumbers("zombieSPS",{start:0, end:1}),
    frameRate : 8,
    repeat : -1
  })
}

function grossirPlayer(){
  boutonBas.on("pointerdown",function(){
    clickBoutonBas = true;
  });
  boutonBas.on("pointerup",function(){
    clickBoutonBas = false;
  })
  boutonBas.on("pointerout",function(){
    clickBoutonBas = false;
  })
  boutonHaut.on("pointerdown",function(){
    clickBoutonHaut = true;
  });
  boutonHaut.on("pointerup",function(){
    clickBoutonHaut = false;
  })
  boutonHaut.on("pointerout",function(){
    clickBoutonHaut = false;
  })
}

function updateGrossirPlayer(){
  if(clickBoutonHaut){
    player.setScale(player.scaleX + 0.1, player.scaleY + 0.1);
  }
  if(clickBoutonBas){
    player.setScale(player.scaleX - 0.1, player.scaleY - 0.1);
  }
}

function deplacementPlayer(){
  if(isKickDown && isReadyToKick){
    game.sound.play("kick");
    isReadyToKick = false;
    player.setTexture("joueur_cdp");
  } else if(isLeftDown){
    player.x = player.x - 5;
    player.anims.play("playerWalk",true);
    player.setFlip(true,false);
  } else if(isRightDown){
    player.x += 5;
    player.anims.play("playerWalk",true);
    player.setFlip(false,false);
  } else {
    player.setTexture("joueur");
  }
  if(cursor.left.isDown){
    isLeftDown = true;
  } 
  if(cursor.right.isDown){
    isRightDown = true;
  }
  if(Vkey.isDown && isReadyToKick){
    isKickDown = true;
  }
  if(Vkey.isUp){
    isKickDown = false;
    isReadyToKick = true;
  }
  if(cursor.left.isUp){
    isLeftDown = false;
  }
  if(cursor.right.isUp){
    isRightDown = false;
  }
}

const posx = (data)=>
{
  player.x = data;
}