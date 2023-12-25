const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const topics = ['Animals', 'Places', 'Objects', 'Food']; // Example topics

const {gameManager} = require('./managers');

io.on('connection', (socket) => {
    socket.on('createRoom', (roomCode) => {
        gameManager.createRoom(roomCode);
        socket.join(roomCode);
        // Handle room creation acknowledgment...
    });

    socket.on('joinRoom', (roomCode) => {
        const room = gameManager.getRoom(roomCode);
        if (room) {
            room.addPlayer(socket.id);
            socket.join(roomCode);
            // Handle player joined acknowledgment...
        } else {
            // Handle error...
        }
    });

    socket.on('startGame', (roomCode) => {
        try {
            const gameInfo = gameManager.startGameInRoom(roomCode);
            // Notify players with their roles and topic (if not fake artist)...
        } catch (error) {
            // Handle error...
        }
    });

    // Additional event handlers...
});

server.listen(3000, () => {
	console.log('Listening on *:3000');
});
