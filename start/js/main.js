//初期設定
PlayState = {};

window.onload = function (){
  let game = new Phaser.Game(960,600,Phaser.AUTO,'game');
  game.state.add('play',PlayState );
  game.state.start('play');
};

PlayState.init = function () {
  this.game.renderer.renderSession.roundPixels = true;
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT
  });
};

PlayState.preload = function(){
  this.game.load.image('background', 'images/background.png');
  //土台
  this.game.load.json('level:1', 'data/level01.json');
  this.game.load.image('ground', 'images/ground.png');
  this.game.load.image('grass:8x1', 'images/grass_8x1.png');
  this.game.load.image('grass:6x1', 'images/grass_6x1.png');
  this.game.load.image('grass:4x1', 'images/grass_4x1.png');
  this.game.load.image('grass:2x1', 'images/grass_2x1.png');
  this.game.load.image('grass:1x1', 'images/grass_1x1.png');
  // キャラ
  this.game.load.image('hero','images/hero_stopped.png')
};

//ゲーム開始前の画像やキャラ配置

PlayState.create = function(){
  this.game.add.image(0,0,'background');
  this._loadLevel(this.game.cache.getJSON('level:1'))
}

PlayState._loadLevel = function(data){
  data.platforms.forEach(this._spawnPlatform,this);
  this._spawnCharacters({hero: data.hero});
}

PlayState._spawnPlatform = function(platform){
  this.game.add.sprite(platform.x, platform.y,platform.image)
}

PlayState._spawnCharacters = function(data){
  this.hero = new Hero(this.game, data.hero.x, data.hero.y);
  this.game.add.existing(this.hero);
}

//キャラクター関連

function Hero(game, x,y){
  Phaser.Sprite.call(this, game, x,y,'hero')
  this.anchor.set(0.5,0.5);
  this.game.physics.enable(this)
  this.body.collideWorldBounds = true;//画面がらはみ出ない
}
Hero.prototype = Object.create(Phaser.Sprite.prototype)
Hero.prototype.constructor = Hero;

Hero.prototype.move = function(direction){
  const SPEED = 200;
  this.body.velocity.x = direction * SPEED;
  this.x += direction * 2.5;
}


//操作関連
PlayState.update = function (){
  this._handleInput();
}

PlayState._handleInput = function(){
  if (this.keys.left.isDown){//move hero left
    this.hero.move(-1);
  }
  else if(this.keys.right.isDown){//move hero right
    this.hero.move(1);
  }
  else {//stop
    this.hero.move(0)
  }
};
