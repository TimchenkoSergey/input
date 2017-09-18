var express = require('express');
var http = require('http');
var fs = require('fs');
var socketIO = require('socket.io');
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();

var expressApp = express();
var privateKey = fs.readFileSync(__dirname + '/certs/client.key').toString();
var certificate = fs.readFileSync(__dirname + '/certs/client.crt').toString();
var options = { key: privateKey, cert: certificate };
var app = http.createServer(/*options,*/ expressApp).listen(8080, /*'0.0.0.0',*/ () => console.log('All start'));
var io = socketIO.listen(app);

expressApp.use(express.static(__dirname + '/public'));
expressApp.use(bodyParser.urlencoded({ extended : true }));
expressApp.use(bodyParser.json());

client.on('connect', function() {
    console.log('Connected to redis');
});

expressApp.get('/:roomId', function(req, res, next) {
    var roomId = req.params.roomId;

    client.exists(roomId, function(err, reply) {
        if (reply === 1) {
            res.sendFile(__dirname + '/public/index.html');
        } else {
            res.sendFile(__dirname + '/public/error.html');
        }
    });
});

expressApp.post('/init-room', function (req, res, next) {
	var roomTTL = req.body.room_ttl;
	var roomSecretKey = req.body.room_secret_key;

    client.set(roomSecretKey, roomSecretKey);
    client.expire(roomSecretKey, +roomTTL);

    res.send('OK');
});

io.sockets.on('connection', function (socket) {
	socket.on('message', function (message) {
        socket.broadcast.to(message.roomId).emit('message', message);
	});

	socket.on('join', function (room) {
        socket.join(room.roomId);
	});
});
