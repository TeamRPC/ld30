function Player() {

    var sprite = PIXI.Sprite.fromImage("img/test.png");

    sprite.position.x = 50;
    sprite.position.y = 50;

}

Player.constructor = Player;
Player.prototype = Object.create(PIXI.Sprite.prototype);

