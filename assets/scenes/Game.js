// import ENUMS from "../utils.js";
import {
  PLAYER_MOVEMENTS,
  SHAPE_DELAY,
  SHAPES,
  TRIANGULO,
  ROMBO,
  CUADRADO,
  BOMBA,
  POINTS_PERCENTAGE,
  POINTS_PERCENTAGE_VALUE_START,
} from "../../utils.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.shapesRecolected = {
        "Triangulo": { count: 0, score: 30 },
        "Cuadrado": { count: 0, score: 30 },
        "Rombo": { count: 0, score: 30 },
        "Bomba": { count: 0, score: -30 },
    };

    this.isWinner = false;
    this.isGameOver = false;
    this.timer = 60;
    this.score = 0; 
  }

  preload() {
    // cargar fondo, plataformas, formas, jugador
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("player", "./assets/images/Ninja.png");
    this.load.image(TRIANGULO, "./assets/images/Triangulo.png");
    this.load.image(ROMBO, "./assets/images/Rombo.png");
    this.load.image(CUADRADO, "./assets/images/Cuadrado.png");
    this.load.image(BOMBA,"./assets/images/Bomba.png");
  }

  create() {
    // create game objects
    // add sky background
    this.add.image(400, 300, "sky").setScale(0.555);

    // agregado con fisicas
    // add sprite player
    this.player = this.physics.add.sprite(400, 500, "player");

    // add platforms static group
    this.platformsGroup = this.physics.add.staticGroup();
    this.platformsGroup.create(400, 568, "platform").setScale(2).refreshBody();
    this.platformsGroup.create(-100, 400, "platform").setScale(2).refreshBody();
    this.platformsGroup.create(900, 200, "platform").setScale(2).refreshBody();

  

    // add shapes group
    this.shapesGroup = this.physics.add.group();

    // add collider between player and platforms
    this.physics.add.collider(this.player, this.platformsGroup);
  
    

    // add collider between platforms and shapes
    this.physics.add.collider(this.shapesGroup, this.platformsGroup);


    // add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape, // funcion que llama cuando player choca con shape
      null, //dejar fijo por ahora
      this //dejar fijo por ahora
    );

    this.physics.add.overlap(this.shapesGroup, this.platformsGroup, this.reduce, null, this); 

    // create cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // create event to add shapes
    this.time.addEvent({
      delay: SHAPE_DELAY,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });
  

    //add text
    this.scoreText = this.add.text(16, 16, "T: 0 / C: 0 / R:0 / PUNTOS:0", {
      fontsize: "32 px",
      fill: "#ffff",
    });

    //create 
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true,
    });

    console.log(this.timer);

  }

  update() {
    //check if game over or win

    if (this.isWinner) {
      this.scene.start("Winner");
    }

    if (this.isGameOver) {
      this.scene.start("gameOver");
    }

    // update game objects
    // check if not game over or win

    // update player left right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_MOVEMENTS.x);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_MOVEMENTS.x);
    } else {
      this.player.setVelocityX(0);
    }

    // update player jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-PLAYER_MOVEMENTS.y);
    }
  }

  collectShape(jugador, figuraChocada) {
    // remove shape from screen
    console.log("figura recolectada");
    figuraChocada.disableBody(true, true);

    const shapeName = figuraChocada.texture.key;
    this.shapesRecolected[shapeName].count++;
    const percentage = figuraChocada.getData(POINTS_PERCENTAGE);

    this.score = this.score + this.shapesRecolected[shapeName].score * percentage;
    


    //update score text
    this.scoreText.setText(
      "T: " +
        this.shapesRecolected[TRIANGULO].count +
        " / C: " +
        this.shapesRecolected[CUADRADO].count +
        " / R: " +
        this.shapesRecolected[ROMBO].count +
        "/ PUNTOS: " + this.score
        
    );

    //check if winner
    //take two of each shape

    if (
      this.score >= 100
    ) {
      this.isWinner = true;
    }

    console.log(this.shapesRecolected);
  }
  
  addShape() {
    // get random shape
    const randomShape = Phaser.Math.RND.pick(SHAPES);

    // get random position x
    const randomX = Phaser.Math.RND.between(0, 800);

    // add shape to screen
    this.shapesGroup.create(randomX, 0, randomShape) 
    .setCircle(32,0,0)
    .setBounce(0.8)
    .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);

    console.log("shape is added", randomX, randomShape);
  }

  updateTimer() {
    this.timer = this.timer - 1;
    console.log(this.timer);
    this.add.text(16, 40, this.timer);
    if (this.timer == 0) {
      this.scene.start("gameOver");
    }
  }
  reduce(shape, platform){
    const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
    console.log(shape.texture.key, newPercentage);
    shape.setData(POINTS_PERCENTAGE, newPercentage);
    if (newPercentage <= 0) {
      shape.disableBody(true,true);
      return;
  }
  const text = this.add.text(shape.body.position.x+10, shape.body.position.y, "-25%", {
    fontSize: "22px",
    fontStyle: "bold",
    fill: "red",
  });
  setTimeout(() => {
    text.destroy();
  }, 200);
}
}
