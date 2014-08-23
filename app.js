var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);



var port = 8080;

app.use(express.static(__dirname + '/client'));

server.listen(port);
console.log('server listening on port ' + port);
