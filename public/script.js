const socket = io();

const roomCodeInput = document.getElementById('roomCode');
const createRoomButton = document.getElementById('createRoom');
const joinRoomButton = document.getElementById('joinRoom');
const startGameButton = document.getElementById('startGame');
const gameStatusDiv = document.getElementById('gameStatus');
const playerRoleDiv = document.getElementById('playerRole');

startGameButton.style.display = 'none';

createRoomButton.addEventListener('click', () => {
	const roomCode = roomCodeInput.value;
	socket.emit('createRoom', roomCode);
});

joinRoomButton.addEventListener('click', () => {
	const roomCode = roomCodeInput.value;
	socket.emit('joinRoom', roomCode);
});

startGameButton.addEventListener('click', () => {
	const roomCode = roomCodeInput.value;
	socket.emit('startGame', roomCode);
});

function hideRoomActions() {
	createRoomButton.style.display = 'none';
	joinRoomButton.style.display = 'none';
	roomCodeInput.style.display = 'none';
	startGameButton.style.display = 'block';
}

socket.on('roomCreated', (roomCode) => {
	gameStatusDiv.innerText = `Room created: ${roomCode}`;
	hideRoomActions();
	const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?roomCode=' + roomCode;
	window.history.pushState({ path: newurl }, '', newurl);
});

socket.on('joinedRoom', (roomCode) => {
	gameStatusDiv.innerText = `Joined room: ${roomCode}`;
	hideRoomActions();
});

socket.on('gameStarted', (data) => {
	gameStatusDiv.innerText = `Game started.`;
});

const roleCardDiv = document.getElementById('roleCard');
const playerRoleP = document.getElementById('playerRole');
const gameTopicP = document.getElementById('gameTopic');

socket.on('role', (data) => {
	playerRoleP.innerText = `Your role: ${data.role}`;
	if (data.topic) {
		gameTopicP.innerText = `Topic: ${data.topic}`;
	} else {
		gameTopicP.innerText = '';
	}
	roleCardDiv.style.display = 'block'; // Show the card
});

const playerCountDiv = document.getElementById('playerCount');


socket.on('playerCount', (count) => {
	playerCountDiv.innerText = `Players in room: ${count}`;
});


socket.on('isFirstPlayer', (isFirstPlayer) => {
	if (isFirstPlayer) {
		startGameButton.style.opacity = 1;
	} else {
		startGameButton.style.opacity = 0;
	}
});


socket.on('error', (message) => {
	alert(message);
});


window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomCode = urlParams.get('roomCode');
    if (roomCode) {
        roomCodeInput.value = roomCode;
        socket.emit('joinRoom', roomCode);
    }
};

