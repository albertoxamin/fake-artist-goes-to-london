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
    }

    startGame(topics) {
        if (this.players.length < 3) {
            throw new Error('Not enough players');
        }

        this.gameStarted = true;
        const fakeArtistIndex = Math.floor(Math.random() * this.players.length);
        this.topic = topics[Math.floor(Math.random() * topics.length)];

        this.players.forEach((playerId, index) => {
            this.playersRoles[playerId] = index === fakeArtistIndex ? 'Fake Artist' : 'Artist';
        });

        return { topic: this.topic, playersRoles: this.playersRoles };
    }

    // Additional methods as needed...
}

const gameManager = {
    rooms: {},
    topics: ['Animals', 'Places', 'Objects', 'Food'],

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

    // Additional methods as needed...
};

module.exports = { Room, gameManager };