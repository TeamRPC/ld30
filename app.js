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

var players = [];

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
	if (players.indexOf(id) == -1) provenUnique = true;
    }
    return id;    
}



io.on('connection', function(socket) {
    socket.emit('info', { id: getUID() });
//    socket.on('my other event', function(data) {
//	console.log(data);
//    });
});


