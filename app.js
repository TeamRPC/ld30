var express = require('express');
var http = require('http');
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);



// Serve the game html css js
// ==========================

var port = 8080;

app.use(express.static(__dirname + '/client'));

server.listen(port);
console.log('server listening on port ' + port);




// Handle the game multiplayer
// ===========================

var players = {};

var getUID = function getUID() {
    // thanks to http://stackoverflow.com/a/1349426/1004931

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    // get a unique string

    var provenUnique = false;
    while (!provenUnique) {
	var id = "";
	for (var i = 0; i < 5; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	if (!players[id]) provenUnique = true;
    }
    return id;
}



io.on('connection', function(socket) {

    // {
    // 	asdfsd: {id: 3, team: 0},
	
    // },
      
    
    var player = {};
    player['id'] = getUID();

    // pick team for player
    // pick the opposite team from the last player who joined
    // or if there are no players in the game right now, choose at random

    if (players.length > 0) {
	// other people are in game
	// get the last team assignment and choose the opposite
	if (players[players.length - 1].team == 0) {
	    player['team'] = 1;
	} else {
	    player['team'] = 0;
	}
	
    } else {
	// nobody is in game, choose a random team
	player['team'] = Math.floor(Math.random() * 2);
    }


    // add this player to array holding current players
    console.log('new player ' + player.id + ' added to team ' + player.team);
    players[player.id] = { id: player.id, team: player.team };
    console.dir(players);

    
    
    socket.emit('info', { id: player.id,
			  team: player.team,
			});

    
    socket.on('move', function(p) {
	player['x'] = p.x;
	player['y'] = p.y;
	
	socket.broadcast('move', { id: p.id,
				   x: p.x,
				   y: p.y
				 });
    });
    

    // player disconnect
    socket.on('disconnect', function(p) {
	console.log('player ' + player.id + ' disconnect');
	delete players[player.id]
    });
});


