export default class Winner extends Phaser.Scene {
  constructor() {
    super("Winner");
  }

  init() {}

  preload() {}

  create() {
    // add sky background
    this.add.image(400, 300, "sky").setScale(0.555);
    //add text
    this.GameText = this.add.text(265, 300, "GANASTE", {
      fontSize: "60px",
      fill: "#000",
    });
  }

  update() {}
}
