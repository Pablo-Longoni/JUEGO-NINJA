// import ENUMS from "../utils.js";
import {
  PLAYER_MOVEMENTS,
  SHAPE_DELAY,
  SHAPES,
  TRIANGULO,
  ROMBO,
  CUADRADO,
} from "../../utils.js";

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("game");
  }

  init() {
    this.shapesRecolected = {
      ["Triangulo"]: { count: 0, score: 10 },
      ["Cuadrado"]: { count: 0, score: 20 },
      ["Rombo"]: { count: 0, score: 30 },
    };
  }

  preload() {
    // cargar fondo, plataformas, formas, jugador
    this.load.image("sky", "./assets/images/Cielo.png");
    this.load.image("platform", "./assets/images/platform.png");
    this.load.image("player", "./assets/images/Ninja.png");
    this.load.image(TRIANGULO, "./assets/images/Triangulo.png");
    this.load.image(ROMBO, "./assets/images/Rombo.png");
    this.load.image(CUADRADO, "./assets/images/Cuadrado.png");
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

    // create cursors
    this.cursors = this.input.keyboard.createCursorKeys();

    // create event to add shapes
    this.time.addEvent({
      delay: SHAPE_DELAY,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
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

    console.log(this.shapesRecolected);
  }

  addShape() {
    // get random shape
    const randomShape = Phaser.Math.RND.pick(SHAPES);

    // get random position x
    const randomX = Phaser.Math.RND.between(0, 800);

    // add shape to screen
    this.shapesGroup.create(randomX, 0, randomShape);

    console.log("shape is added", randomX, randomShape);
  }
}
