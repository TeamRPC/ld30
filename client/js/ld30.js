var moveSpeed = 3;


var stage = new PIXI.Stage(0x66FF99);
var renderer = new PIXI.autoDetectRenderer(
    640,
    480
);
var loader = new PIXI.AssetLoader(
    [
	'/img/test.png',
	'/img/characters.json'
    ],
    false);

loader.addEventListener('onLoaded', function(e) {
    console.log('e: onLoaded: All files loaded');
});

loader.addEventListener('onProgress', function(e) {
    console.log('e: onProgress: file loading in progress');
});

loader.addEventListener('onComplete', function(e) {
    console.log('e: onComplete: all assets hav loaded');
});

loader.onComplete = onAssetsLoaded;

loader.load();


function onAssetsLoaded() {

    console.log('creating stuff');

    var characterAtlas = PIXI.AtlasLoader('/img/characters.json', false);
    var player = PIXI.Texture.fromFrame('player.png');
    var test = PIXI.Texture.fromFrame('test.png');

    testguy = new PIXI.Sprite(player);

    testguy.position.x = 50;
    testguy.position.y = 50;
    
    stage.addChild(testguy);
    
    // add background
    // add ground
    // add structures
    // add knight
    // add robot

    renderer.render(stage);
    
    
}


function updateScreen() {
    renderer.render(stage);
    
}    


document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
	console.log('left was pressed');
	testguy.position.x -= moveSpeed;
	updateScreen();
    }
    else if(event.keyCode == 39) {
	console.log('right was pressed');
	testguy.position.x += moveSpeed;
	updateScreen();	
    }
});

document.body.appendChild(renderer.view);


