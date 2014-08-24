var moveSpeed = 3;

console.log('creating stuff');

var Q = window.Q = Quintus()
    .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI")
    .setup({ maximize: true })
    .controls().touch();


/**
 * Player. Extends sprite.
 */
Q.Sprite.extend("Player", {
    init: function(p) {
	this._super(p, {
	    // sheet is the frame from used from the atlas
	    sheet: "",
	    x: 64,
	    y: 64
	});
	
	this.add('2d, platformerControls');
	
	this.on("hit.sprite", function(collision) {
	    if(collision.obj.isA("Opponent")) {
		
		Q.stageScene("info", 1, {
		    label: "you collided with opponent"
		});
		
	    }
	});
    }
});


Q.Sprite.extend("Opponent", {
    init: function(p) {
	this._super(p, { sheet: 'test' });
    }
});




/**
 * Scene - Battlefield
 */
Q.scene("portalBattlefield", function(stage) {
    
    // tiles for the ground of this map
    stage.collisionLayer(new Q.TileLayer({
	dataAsset: 'portalBattlefield.json',
	sheet: 'test' }));
    
    // create the player
    var player = stage.insert(new Q.Player());
    
    stage.insert(new Q.Opponent({ x: 200, y: 100 }));
    stage.insert(new Q.Opponent({ x: 300, y: 200 }));
    
});

Q.scene('info', function(stage) {
    var container = stage.insert(new Q.UI.Container({
	x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
    }));
    
    var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#00FF00",
						    label: "DERP" }));
    var label = container.insert(new Q.UI.Text({ x: 10, y: -10 -button.p.h,
						 label: stage.options.label }));
    
    container.fit(20);
});

// load assets
Q.load("/img/characters.png", "/img/characters.json", "/img/portalBattlefield.json", "/img/tiles.png", function() {

    
    Q.sheet("tiles", "/img/tiles.png", { tilew: 32, tileh: 32 });
    
    // when assets loaded, compile sprites from atlas
    Q.compileSheets("chracters.png", "characters.json");
    
    // start scene
    Q.stageScene("portalBattlefield");
});
