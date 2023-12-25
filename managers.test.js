const { Room, gameManager } = require('./managers');

describe('Room and gameManager', () => {
    let room;
    const roomCode = 'testRoom';

    beforeEach(() => {
        room = new Room(roomCode);
    });

    test('should create a new room with correct initial state', () => {
        expect(room.code).toBe(roomCode);
        expect(room.players).toEqual([]);
        expect(room.gameStarted).toBe(false);
    });

    test('should add players to a room', () => {
        room.addPlayer('player1');
        room.addPlayer('player2');
        expect(room.players).toEqual(['player1', 'player2']);
    });

    test('should start the game with enough players', () => {
        room.addPlayer('player1');
        room.addPlayer('player2');
        room.addPlayer('player3');
        const gameInfo = room.startGame(gameManager.topics);

        expect(room.gameStarted).toBe(true);
        expect(Object.keys(room.playersRoles).length).toBe(3);
        expect(gameManager.topics).toContain(gameInfo.topic);
    });

    test('should throw error if starting game with less than 3 players', () => {
        room.addPlayer('player1');
        expect(() => room.startGame(gameManager.topics)).toThrow('Not enough players');
    });

    // Additional tests as needed...
});
