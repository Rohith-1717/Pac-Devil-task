import Phaser from "phaser";

class Game extends Phaser.Scene{player!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;coins!: Phaser.Physics.Arcade.Group;
  score = 0;best = 0;
  scoreText!: Phaser.GameObjects.Text;bestText!: Phaser.GameObjects.Text;

  constructor(){super("game")}

  preload(){
    this.load.image("bg", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.spritesheet("coinSpin", "assets/coin_sheet.png", {frameWidth: 384,frameHeight: 1024
    });
  }

  create(){
    this.add.image(0, 0, "bg").setOrigin(0).setDisplaySize(800, 600);
    this.player = this.physics.add.sprite(400, 300, "player");
    this.player.setScale(0.1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({ key: "coin-spin",frames: this.anims.generateFrameNumbers("coinSpin", { start: 0, end: 3 }),
      frameRate: 8, repeat: -1});

    this.coins = this.physics.add.group();
    const positions = [];

  for(let i = 0; i < 6; i++){
    const x = Math.floor(Math.random() * 760) + 20;
    const y = Math.floor(Math.random() * 560) + 20;
    positions.push({ x: x, y: y });}

  positions.forEach(p=>{
    const c = this.coins.create(p.x, p.y, "coinSpin"); c.setScale(0.1); c.play("coin-spin");});
    this.physics.add.overlap(this.player, this.coins, this.collectCoin as any, undefined, this);
    this.scoreText = this.add.text(650, 550, "Score: 0",{ color: "#fff",fontSize: "20px"});
    this.best = parseInt(localStorage.getItem("bestScore") || "0");
    this.bestText = this.add.text(650, 575, `Best: ${this.best}`, { color: "#ff0",fontSize: "20px"});
    this.physics.world.setBounds(0, 0, 800, 600);
    this.player.setCollideWorldBounds(true);
  }

  update(){
    const speed = 150;
    this.player.setVelocity(0);
    if(this.cursors.left?.isDown){
      this.player.setVelocityX(-speed);
    } 
    else if(this.cursors.right?.isDown){
      this.player.setVelocityX(speed);
    }

    if(this.cursors.up?.isDown){
      this.player.setVelocityY(-speed);
    } 
    else if(this.cursors.down?.isDown){
      this.player.setVelocityY(speed);
    }
  }

  collectCoin(player: any, coin: any){
    coin.destroy();
    this.score += 10;
    this.scoreText.setText("Score: " + this.score);

    if(this.score > this.best){
      this.best = this.score;
      localStorage.setItem("bestScore", this.best.toString());
      this.bestText.setText("Best: " + this.best);
    }
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000",
  physics:{default: "arcade",
    arcade:
    {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: Game
});
