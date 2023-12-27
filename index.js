const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { gameManager } = require('./managers');

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = socketIo(server, {
	connectionStateRecovery: {}
});

let playerRoomMap = {};


io.on('connection', (socket) => {
	socket.emit(
		'openRooms',
		Object.keys(gameManager.rooms).filter(roomCode => !gameManager.rooms[roomCode].gameStarted)
	)

	socket.on('createRoom', (roomCode) => {
		if (gameManager.getRoom(roomCode)) {
			socket.emit('error', 'Room already exists');
			return;
		}
		const room = gameManager.createRoom(roomCode);
		socket.join(roomCode);
		socket.emit('roomCreated', roomCode);
		room.addPlayer(socket.id);
		playerRoomMap[socket.id] = roomCode; // Store player's room
		io.to(roomCode).emit('playerCount', room.players.length);
		socket.emit('isFirstPlayer', true);
	});

	socket.on('joinRoom', (roomCode) => {
		const room = gameManager.getRoom(roomCode);
		if (room) {
			room.addPlayer(socket.id);
			socket.join(roomCode);
			socket.emit('joinedRoom', roomCode);
			io.to(roomCode).emit('playerCount', room.players.length);
			playerRoomMap[socket.id] = roomCode; // Store player's room
			socket.emit('isFirstPlayer', room.players[0] === socket.id);
		} else {
			socket.emit('error', 'Room does not exist');
		}
	});

	socket.on('startGame', (roomCode) => {
		try {
			const room = gameManager.getRoom(roomCode);
			const gameInfo = room.startGame(gameManager.topics);
			io.to(roomCode).emit('gameStarted', { topic: gameInfo.topic });
			room.players.forEach(playerId => {
				const role = room.playersRoles[playerId];
				io.to(playerId).emit('role', { role: role, topic: role === 'Artist' ? gameInfo.topic : undefined });
			});
		} catch (error) {
			socket.emit('error', error.message);
		}
	});

	socket.on('disconnect', () => {
		const roomCode = playerRoomMap[socket.id];
		if (roomCode) {
			const room = gameManager.getRoom(roomCode);
			if (room) {
				room.removePlayer(socket.id);
				delete playerRoomMap[socket.id];
				io.to(roomCode).emit('playerCount', room.players.length);
				if (room.players.length === 0) {
					gameManager.removeRoom(roomCode);
				}
			}
		}
	});
});

server.listen(3000, () => {
	console.log('Server listening on port 3000');
});
