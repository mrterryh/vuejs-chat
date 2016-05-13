var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.set('port', 3000);
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
    response.render('index.html');
});

server.listen(app.get('port'), function() {
    console.log('Express server listening.');
});

var onlineUsers = {};
var sentMessages = [];

io.on('connection', function(socket) {
    console.log('Socket connected with ID of ' + socket.id);

    socket.on('user logged in', function(username) {
        console.log('%s has joined the chat!', username);

        onlineUsers[socket.id] = username;

        io.emit('user joined', {
            socketId: socket.id,
            username: username,
            timestamp: new Date,
            type: 'alert',
            message: username + ' has joined the chat!'
        });
    });

    socket.on('send message', function(message) {
        var senderUsername = onlineUsers[socket.id];

        var messageObject = {
            socketId: socket.id,
            username: senderUsername,
            timestamp: new Date,
            type: 'message',
            message: message
        };

        console.log('%s: %s', senderUsername, message);

        sentMessages.push(messageObject);

        io.emit('message received', messageObject);
    });

    socket.on('kick user', function(username) {
        var socketId = Object.keys(onlineUsers).filter(function(key) {
            return onlineUsers[key] == username;
        })[0];

        if (io.sockets.sockets[socketId]) {
            io.sockets.sockets[socketId].disconnect();
        }

        console.log('%s has been kicked from the chat.', username);
    });
});