// # Quintus platformer example
//
// [Run the example](../quintus/examples/platformer/index.html)
// WARNING: this game must be run from a non-file:// url
// as it loads a level json file.
//
// This is the example from the website homepage, it consists
// a simple, non-animated platformer with some enemies and a 
// target for the player.
window.addEventListener("load",function() {


    // Set up an instance of the Quintus engine  and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = window.Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
    // Maximize this game to whatever the size of the browser is
        .setup({ width: 800, height: 450, maximize: true })
    // And turn on default input controls and touch input (for UI)
        .controls().touch()

    Q.input.keyboardControls();
    
    // ## Background Sprite
    Q.Sprite.extend("Background", {
	init: function(p) {
	    this._super(p, {
		type: Q.SPRITE_NONE
	    });
	}
    });
    
    // ## Player Sprite
    // The very basic player sprite, this is just a normal sprite
    // using the player sprite sheet with default controls added to it.
    Q.Sprite.extend("Player", {

	// the init constructor is called on creation
	init: function(p) {
	    
	    // You can call the parent's constructor with this._super(..)
	    this._super(p, {
		type: Q.SPRITE_PLAYER,
		sheet: "player",  // Setting a sprite sheet sets sprite width and height
		sprite: "player",
		x: 500,           // You can also set additional properties that can
		y: 100,            // be overridden on object creation
		jumpSpeed: -300,

		hp: 6,
		comboLevel: 0,      // combo level player is at. they get 3 combos (0-2)
		comboReady: true,   // whether or not player can do a combo right now
		comboActive: false      // whether or not player is doing a combo
	    });

	    
	    this.add('2d, platformerControls, keyboardControls, animation');

	    Q.input.on('fire', this, this.fireCombo);
	    Q.input.on('fireUp', this, this.armCombo);


	    // Write event handlers to respond hook into behaviors.
	    // hit.sprite is called everytime the player collides with a sprite
	    this.on("hit.sprite", function(collision) {

		// Check the collision, if it's the Tower, you win!
		if(collision.obj.isA("Tower")) {
		    Q.stageScene("endGame",1, { label: "You Won!" }); 
		    this.destroy();
		}
	    });

	    
	},

	step: function(dt) {

	    // make sure we only do one thing per step
	    // after doing a thing, processed needs to be set true
	    var processed = false;

	    // play ground combo if
	    //   - landed
	    //   - combo is active
	    if (!processed &&
		this.p.landed > 0 &&
		this.p.comboActive)
	    {
		var comboString = 'combo' + this.p.comboLevel + '_ground_' + this.p.direction;
		console.log('COMBO ANIM: ' + comboString);
		this.play("combo" + this.p.comboLevel + '_ground_' + this.p.direction);
		processed = true;
	    }

	    
	    // play idle if
	    //   - nothing has been done this step
            //   - landed
	    //   - no combo active
            //   - not moving left or right
	    if (!processed &&
		this.p.landed > 0 &&
		!this.p.comboActive &&
		this.p.vx == 0)
	    {
		this.play("idle_" + this.p.direction);
		processed = true;
	    }

	    // play run if
	    //   - nothing has been done this step
	    //   - on the ground (landed)
	    //   - moving left or right
	    if (!processed &&
		this.p.landed > 0 &&
		(this.p.vx > 0 || this.p.vx < 0))
	    {
		this.play("run_" + this.p.direction);
		processed = true;
	    }

	    // play jump if
	    //   - nothing has been done this step
	    //   - in the air
	    if (!processed &&
		this.p.landed <= 0)
	    {
		this.play("jump_" + this.p.direction);
		processed = true;
	    }
		

            // reset level if
	    //   - player fell below 2000px on the y-axis
	    if (this.p.y > 2000)
	    {
	      	this.resetLevel();
	    }
	},

	resetLevel: function() {
	    Q.stageScene("portalBattlefield");
	},

	armCombo: function() {
	    console.log('arm combo!');
	    if (this.p.comboLevel < 3) {
		this.p.comboReady = true;
		this.p.comboLevel++;
	    } else {
		console.log('out of combos');
		Q.input.off('fireUp');
	    }
	},
	
	fireCombo: function() {
	    if (this.p.comboLevel == 0 && this.p.comboReady) {
		this.p.comboReady == false;
		this.combo0();

	    } else if (this.p.comboLevel == 1 && this.p.comboReady) {
		this.p.comboReady == false;		
		this.combo1();
		
	    } else if (this.p.comboLevel == 2 && this.p.comboReady) {
		this.p.comboReady == false;		
		this.combo2();
	    } else {
		console.log('combo not ready');
	    }
	},

	combo0: function() {
	    console.log('COMBO0 firing');
	    this.p.comboActive = true;
	    // do the attack
	    console.log('new attack at');
	    console.dir(this.c.points);

	    if (this.p.direction == "right") {
		
		this.stage.insert(new Q.Attack({ x: this.c.points[0][0], y: this.c.points[0][1] }));
//	    } else {
//		this.stage.insert(new Q.Attack({ x: this.c.points[0][
	    }
	    this.p.comboActive = false;
	},
	
	combo1: function() {
	    console.log('COMBO1 firing');
	    this.p.comboActive = true;
	    // do the attack
	    this.p.comboActive = false;
	},

	combo2: function() {
	    console.log('COMBO2 firing');
	    this.p.comboActive = true;
	    // do the attack
	    this.p.comboActive = false;
	}

    });


    // ## Tower Sprite
    // Sprites can be simple, the Tower sprite just sets a custom sprite sheet
    Q.Sprite.extend("Tower", {
	init: function(p) {
	    this._super(p, { sheet: 'tower' });
	}
    });

    // ## Attack Sprite
    Q.Sprite.extend("Attack", {
	init: function(p) {
	    this._super(p, {
		type: Q.SPRITE_PLAYER,
		sheet: 'player',
		sprite: 'player'
	    });
	    this.add("2d, Anim");
	    this.on("hit.sprite", this, "collision");
	    //this.play('test');
	},

	collision: function(col) {
	    var hitObj = col.obj.p;

	    // hit object loses 1 hp if
	    //   - object is player
	    if (hitObj.type = Q.SPRITE_PLAYER)
	    {
		hitObjs.hp--;
		this.destroy();
	    }
	}
	    // // hit object dies if
	    // //   - object is a player
	    // //   - player's hitpoints are less than 1
	    // if (hitObj.type == Q.SPRITE_PLAYER &&
	    // 	hitObj.hp < 1)
	    // {
	    // 	col.obj.destroy();
	    // 	this.destroy();
	    // 	processed = true;
	    // }
    });
    
    // ## Enemy Sprite
    // Create the Enemy class to add in some baddies
    Q.Sprite.extend("Opponent", {
	init: function(p) {
	    this._super(p, {
		type: Q.SPRITE_PLAYER,
		sheet: 'leftpunch',
		vx: 0,

		hp: 6
	    });

	    // Enemies use the Bounce AI to change direction 
	    // whenver they run into something.
	    this.add('2d, Anim');

	    // Listen for a sprite collision, if it's the player,
	    // end the game unless the enemy is hit on top
	    this.on("bump.left,bump.right,bump.bottom",function(collision) {
		if(collision.obj.isA("Player")) {

		    //Q.stageScene("endGame",1, { label: "You Died" }); 
		    //collision.obj.destroy();
		}
	    });
	    
	    // If the enemy gets hit on the top, destroy it
	    // and give the user a "hop"
	    this.on("bump.top",function(collision) {
		if(collision.obj.isA("Player")) { 
		    this.destroy();
		    collision.obj.p.vy = -300;
		}
	    });
	}
    });
    
    // ## Level1 scene
    // Create a new scene called level 1
    Q.scene("portalBattlefield", function(stage) {

	// add background
	//stage.insert(new Q.Sprite({ asset: "background.png" , x: 400, y: 225 }));
	stage.insert(new Q.Background({ asset: "background.png", x: 432, y: 225 }));

	// Add in a tile layer, and make it the collision layer
	stage.collisionLayer(new Q.TileLayer({
            dataAsset: 'level.json',
            sheet:     'tiles' }));


	// connect to the server for multiplayer
	var socket = io.connect('http://' + document.domain + ':' + location.port);
	socket.on('info', function(info) {
	    // with this info, we can spawn.
	    // Create the player and add them to the stage
	    console.log('my id: ' + info.id + ' my team: ' + info.team);

	    if (info.team == 0) var player = stage.insert(new Q.Player({ sprite: 'knight' }));
	    if (info.team == 1) var player = stage.insert(new Q.Player({ sprite: 'robot' }));	    
	    player.p.team = info.team;
	});	
	
	// Give the stage a moveable viewport and tell it
	// to follow the player.
	//stage.add("viewport").follow(player);
	
	// Add in a couple of enemies
	stage.insert(new Q.Opponent({ x: 700, y: 0 }));
	stage.insert(new Q.Opponent({ x: 600, y: 0 }));

	Q.stageScene('hud', 1, Q('Opponent').first().p);
	
	// Finally add in the tower goal
	stage.insert(new Q.Tower({ x: 180, y: 50 }));


    });

    // ## Debug(?) hud
    Q.scene('hud', function(stage) {

	var container = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: 50, fill: "rgba(0,0,0,0.5)"	    
	}));

	var label = container.insert(
	    new Q.UI.Text({ x: 0,
			    y: 0,
			    label: "Opponent HP: " + stage.options.hp,
			    color: "green" }));

	container.fit(20);
    });

    
    
    // To display a game over / game won popup box, 
    // create a endGame scene that takes in a `label` option
    // to control the displayed message.
    Q.scene('endGame',function(stage) {
	var container = stage.insert(new Q.UI.Container({
	    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
	}));

	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
							label: "Play Again" }))         
	var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                    label: stage.options.label }));
	// When the button is clicked, clear all the stages
	// and restart the game.
	button.on("click",function() {
	    Q.clearStages();
	    Q.stageScene('portalBattlefield');
	});

	// Expand the container to visibily fit it's contents
	// (with a padding of 20 pixels)
	container.fit(20);
    });

    // ## Asset Loading and Game Launch
    // Q.load can be called at any time to load additional assets
    // assets that are already loaded will be skipped
    // The callback will be triggered when everything is loaded
    Q.load(["characters.png", "characters.json", "level.json", "tiles.png", "background.png"], function() {
	// return a Q.SpriteSheet or create a new sprite sheet
	Q.sheet("tiles", "tiles.png", { tilew: 32, tileh: 32 });

	// Or from a .json asset that defines sprite locations
	Q.compileSheets("characters.png","characters.json");

	Q.animations("player", {
	    idle_right: { frames: [0, 1], rate: 1/1, flip: false, loop: true },
	    idle_left:  { frames: [0, 1], rate: 1/1, flip: "x", loop: true },	    
	    run_right:  { frames: [16, 17, 18, 17], rate: 1/5, flip: false, loop: true },
	    run_left:   { frames: [16, 17, 18, 17], rate: 1/5, flip: "x", loop: true },
	    duck_right: { frames: [1, 11], rate: 1/3, flip: false , loop: false },
	    duck_left:  { frames: [1, 11], rate: 1/3, flip: "x", loop: false },
	    jump_right: { frames: [10, 12, 13], rate: 1/5, flip: false, loop: false },
	    jump_left:  { frames: [10, 12, 13], rate: 1/5, flip: "x", loop: false },
	    combo0_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo0_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo0_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo0_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo1_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo1_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo1_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo1_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo2_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo2_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo2_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo2_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    test: { frames: [24, 25], rate: 1/8, flip: false, loop: true }
	});

	Q.animations("knight", {
	    idle_right: { frames: [0, 1], rate: 1/1, flip: false, loop: true },
	    idle_left:  { frames: [0, 1], rate: 1/1, flip: "x", loop: true },	    
	    run_right:  { frames: [16, 17, 18, 17], rate: 1/5, flip: false, loop: true },
	    run_left:   { frames: [16, 17, 18, 17], rate: 1/5, flip: "x", loop: true },
	    duck_right: { frames: [1, 11], rate: 1/3, flip: false , loop: false },
	    duck_left:  { frames: [1, 11], rate: 1/3, flip: "x", loop: false },
	    jump_right: { frames: [10, 12, 13], rate: 1/5, flip: false, loop: false },
	    jump_left:  { frames: [10, 12, 13], rate: 1/5, flip: "x", loop: false },
	    combo0_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo0_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo0_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo0_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo1_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo1_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo1_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo1_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo2_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo2_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo2_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo2_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    test: { frames: [24, 25], rate: 1/8, flip: false, loop: true }
	});

	Q.animations("robot", {
	    idle_right: { frames: [0, 1], rate: 1/1, flip: false, loop: true },
	    idle_left:  { frames: [0, 1], rate: 1/1, flip: "x", loop: true },	    
	    run_right:  { frames: [16, 17, 18, 17], rate: 1/5, flip: false, loop: true },
	    run_left:   { frames: [16, 17, 18, 17], rate: 1/5, flip: "x", loop: true },
	    duck_right: { frames: [1, 11], rate: 1/3, flip: false , loop: false },
	    duck_left:  { frames: [1, 11], rate: 1/3, flip: "x", loop: false },
	    jump_right: { frames: [10, 12, 13], rate: 1/5, flip: false, loop: false },
	    jump_left:  { frames: [10, 12, 13], rate: 1/5, flip: "x", loop: false },
	    combo0_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo0_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo0_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo0_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo1_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo1_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo1_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo1_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    combo2_ground_left: { frames: [2, 1, 3], rate: 1/10, flip: "x", loop: false },
	    combo2_ground_right: { frames: [2, 1, 3], rate: 1/10, flip: false, loop: false },
	    combo2_air_left: { frames: [3, 1, 2], rate: 1/10, flip: "x", loop: false },
	    combo2_air_right: { frames: [3, 1, 2], rate: 1/10, flip: false, loop: false },
	    test: { frames: [24, 25], rate: 1/8, flip: false, loop: true }
	});	

	// Finally, call stageScene to run the game
	Q.stageScene("portalBattlefield");
	//Q.stageScene("endGame", 1, { label: "You Won!" }); 	



    });

    // ## Possible Experimentations:
    // 
    // The are lots of things to try out here.
    // 
    // 1. Modify level.json to change the level around and add in some more enemies.
    // 2. Add in a second level by creating a level2.json and a level2 scene that gets
    //    loaded after level 1 is complete.
    // 3. Add in a title screen
    // 4. Add in a hud and points for jumping on enemies.
    // 5. Add in a `Repeater` behind the TileLayer to create a paralax scrolling effect.

});
