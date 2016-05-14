var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

/**
 * Set up a basic Express server.
 */
app.set('port', 3000);
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
    response.render('index.html');
});

server.listen(app.get('port'), function() {
    console.log('Express server listening.');
});

/**
 * Declare some variables for later use.
 */
var onlineUsers = {};
var sentMessages = [];

/**
 * Listen for a new connection on the server.
 */
io.on('connection', function(socket) {
    console.log('Socket connected with ID of ' + socket.id);

    /**
     * This will be fired when a user enters a username. The server will
     * associate the username with the socket ID and store it in,
     * $onlineUsers then emit a message to the client which
     * will in turn output a "XYZ has joined" message to
     * all connected users.
     */
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

    /**
     * This will get fired whenever a user submits a message to the chat. The
     * server will create a message object to store all of the various
     * metadata and store it in $sentMessages. It will then emit a
     * message to the client to tell it to output the message
     * in the chat to all users.
     */
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

    /**
     * Listens for when an admin clicks the "kick" link on the online users list.
     * The server will try to find the socket associated with the given username
     * and disconnect it if it exists.
     */
    socket.on('kick user', function(username) {
        var socketId = Object.keys(onlineUsers).filter(function(key) {
            return onlineUsers[key] == username;
        })[0];

        if (io.sockets.sockets[socketId]) {
            io.sockets.sockets[socketId].disconnect();
        }

        console.log('%s has been kicked from the chat.', username);
    });

    /**
     * Gets fired when a user leaves the page. It will remove their session
     * from $onlineUsers and broadcast a message to the client to alert
     * everyone in the chat that the user has disconnected.
     */
    socket.on('disconnect', function() {
        var username = onlineUsers[socket.id];

        delete onlineUsers[socket.id];

        console.log('%s has disconnected from the chat.', username);

        io.emit('user left', {
            socketId: socket.id,
            username: username,
            timestamp: new Date,
            type: 'alert',
            message: username + ' has disconnected from the chat!'
        });
    });
});