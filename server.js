var express = require('express');
var https = require('https');
var fs = require('fs');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');

var expressApp = express();
var privateKey = fs.readFileSync(__dirname + '/certs/client.key').toString();
var certificate = fs.readFileSync(__dirname + '/certs/client.crt').toString();
var options = { key: privateKey, cert: certificate };
var app = https.createServer(options, expressApp).listen(8080, '0.0.0.0');
var io = socketIO.listen(app);

expressApp.use(express.static(__dirname + '/public'));
expressApp.use(bodyParser.urlencoded({ extended : true }));
expressApp.use(bodyParser.json());

expressApp.get('/:roomId', function(req, res, next) {
    var roomId = req.params.roomId;
});

expressApp.post('/init-room', function (req, res, next) {
    console.log('init-room');
});


io.sockets.on('connection', function (socket) {

	socket.on('message', function (message) {
		socket.broadcast.emit('message', message);
	});

	socket.on('join', function (room) {

	});
});
