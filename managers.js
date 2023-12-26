class Room {
	constructor(code) {
		this.code = code;
		this.players = [];
		this.gameStarted = false;
		this.playersRoles = {};
		this.topic = null;
	}

	addPlayer(playerId) {
		this.players.push(playerId);
		console.log('Player', playerId, 'joined room', this.code);
	}

	startGame(topics) {
		if (this.players.length < 3) {
			throw new Error('Not enough players');
		}
		console.log('Starting game in room', this.code);

		this.gameStarted = true;
		const fakeArtistIndex = Math.floor(Math.random() * this.players.length);
		this.topic = topics[Math.floor(Math.random() * topics.length)];

		this.players.forEach((playerId, index) => {
			this.playersRoles[playerId] = index === fakeArtistIndex ? 'Fake Artist' : 'Artist';
		});

		return { topic: this.topic, playersRoles: this.playersRoles };
	}

	removePlayer(playerId) {
		this.players = this.players.filter(player => player !== playerId);
	}
}

const gameManager = {
	rooms: {},
	topics: [
		'Apple',
		'Car',
		'Cat',
		'Chair',
		'Chicken',
		'Clock',
		'Dog',
		'Egg',
		'Elephant',
		'Fire',
		'Fish',
		'Flower',
		'Frog',
		'Grass',
		'House',
		'Leaf',
		'Milk',
		'Money',
		'Monkey',
		'Moon',
		'Motorcycle',
		'Mountain',
		'Pants',
		'Pencil',
		'Pizza',
		'Plant',
		'Potato',
		'Rain',
		'Road',
		'Rock',
		'Sandwich',
		'School',
		'Ship',
		'Snake',
		'Snow',
		'Socks',
		'Stairs',
		'Streetlight',
		'Sun',
		'Sword',
		'Table',
		'Tree',
		'Water',
		'Window',
	],

	createRoom(code) {
		const newRoom = new Room(code);
		this.rooms[code] = newRoom;
		return newRoom;
	},

	getRoom(code) {
		return this.rooms[code];
	},

	startGameInRoom(code) {
		const room = this.getRoom(code);
		if (!room) {
			throw new Error('Room does not exist');
		}
		return room.startGame(this.topics);
	},

	removeRoom(code) {
		delete this.rooms[code];
	}
};

module.exports = { Room, gameManager };