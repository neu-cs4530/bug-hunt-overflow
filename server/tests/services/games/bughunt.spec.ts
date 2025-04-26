import { ObjectId } from 'mongodb';
import BuggyFileModel from '../../../models/buggyFile.model';
import BugHuntGame from '../../../services/games/bughunt';
import { BUGHUNT_HINT_PENALTY } from '../../../types/constants';
import {
  GameInstance,
  GameMove,
  BugHuntGameState,
  BugHuntMove,
  BuggyFile,
} from '../../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('BugHuntGame tests', () => {
  let bugHuntGame: BugHuntGame;

  beforeEach(() => {
    bugHuntGame = new BugHuntGame('BugHunt');
  });

  describe('constructor', () => {
    it('creates a blank game', () => {
      expect(bugHuntGame.id).toBeDefined();
      expect(bugHuntGame.id).toEqual(expect.any(String));
      expect(bugHuntGame.state.status).toBe('WAITING_TO_START');
      expect(bugHuntGame.state.moves).toEqual([]);
      expect(bugHuntGame.state.logs).toEqual([]);
      expect(bugHuntGame.state.scores).toEqual([]);
      expect(bugHuntGame.state.winners).toBeUndefined();
      expect(bugHuntGame.state.createdAt).toEqual(expect.any(Date));
      expect(bugHuntGame.state.updatedAt).toEqual(expect.any(Date));
      expect(bugHuntGame.gameType).toEqual('BugHunt');
    });
  });

  describe('toModel', () => {
    it('should return a representation of the current game state', () => {
      const gameState: GameInstance<BugHuntGameState> = {
        state: {
          moves: [],
          status: 'WAITING_TO_START',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          logs: [],
          scores: [],
        },
        gameID: expect.any(String),
        players: [],
        gameType: 'BugHunt',
      };

      expect(bugHuntGame.toModel()).toEqual(gameState);
    });

    it('should return a representation of the current game state', async () => {
      mockingoose(BuggyFileModel).toReturn(
        [
          {
            _id: '67f42bffada65b7ff17dae09',
            code: `code\ncode\ncode\ncode\n`,
            description: `The purpose of this program.`,
            buggyLines: [2, 3, 4],
          } as BuggyFile,
        ],
        'find',
      );
      const gameState1: GameInstance<BugHuntGameState> = {
        state: {
          moves: [],
          status: 'WAITING_TO_START',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          logs: [
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'CREATED_GAME',
            },
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'JOINED',
            },
          ],
          scores: [],
        },
        gameID: expect.any(String),
        players: ['player1'],
        gameType: 'BugHunt',
      };

      const gameState2: GameInstance<BugHuntGameState> = {
        state: {
          moves: [],
          status: 'IN_PROGRESS',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          logs: [
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'CREATED_GAME',
            },
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'JOINED',
            },
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'STARTED',
            },
          ],
          scores: [],
          buggyFile: expect.any(ObjectId),
        },
        gameID: expect.any(String),
        players: ['player1'],
        gameType: 'BugHunt',
      };

      const gameState3: GameInstance<BugHuntGameState> = {
        state: {
          moves: [],
          status: 'IN_PROGRESS',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          logs: [
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'CREATED_GAME',
            },
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'JOINED',
            },
            {
              createdAt: expect.any(Date),
              player: 'player1',
              type: 'STARTED',
            },
          ],
          scores: [],
          buggyFile: expect.any(ObjectId),
        },
        gameID: expect.any(String),
        players: ['player1'],
        gameType: 'BugHunt',
      };

      bugHuntGame.join('player1');

      expect(bugHuntGame.toModel()).toEqual(gameState1);

      await bugHuntGame.start('player1');

      expect(bugHuntGame.toModel()).toEqual(gameState2);

      bugHuntGame.leave('player1');

      expect(bugHuntGame.toModel()).toEqual(gameState3);
    });
  });

  describe('join', () => {
    it('adds player1 to the game', () => {
      expect(bugHuntGame.state.logs).toEqual([]);

      bugHuntGame.join('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('WAITING_TO_START');
    });

    it('player1 rejoining has no effect', () => {
      expect(bugHuntGame.state.logs).toEqual([]);

      bugHuntGame.join('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('WAITING_TO_START');
      bugHuntGame.join('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('WAITING_TO_START');
    });

    it('throws an error if trying to join an in progress game', async () => {
      mockingoose(BuggyFileModel).toReturn(
        [
          {
            _id: '67f42bffada65b7ff17dae09',
            code: `code\ncode\ncode\ncode\n`,
            description: `The purpose of this program.`,
            buggyLines: [2, 3, 4],
          } as BuggyFile,
        ],
        'find',
      );
      // assemble
      bugHuntGame.join('player1');
      expect(bugHuntGame.state.status).toEqual('WAITING_TO_START');
      await bugHuntGame.start('player1');
      expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
      expect(() => bugHuntGame.join('player2')).toThrow('Cannot join game: already started');
      expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
    });
  });

  describe('start', () => {
    it('starts game successfully', async () => {
      mockingoose(BuggyFileModel).toReturn(
        [
          {
            _id: '67f42bffada65b7ff17dae09',
            code: `code\ncode\ncode\ncode\n`,
            description: `The purpose of this program.`,
            buggyLines: [2, 3, 4],
          } as BuggyFile,
        ],
        'find',
      );
      expect(bugHuntGame.state.logs).toEqual([]);

      bugHuntGame.join('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('WAITING_TO_START');
      await bugHuntGame.start('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'STARTED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
    });
    it('throws an error if trying to start while in progress', async () => {
      mockingoose(BuggyFileModel).toReturn(
        [
          {
            _id: '67f42bffada65b7ff17dae09',
            code: `code\ncode\ncode\ncode\n`,
            description: `The purpose of this program.`,
            buggyLines: [2, 3, 4],
          } as BuggyFile,
        ],
        'find',
      );
      bugHuntGame.join('player1');
      await bugHuntGame.start('player1');
      expect(() => bugHuntGame.start('player1')).rejects.toThrow(
        'Cannot start game: game already started',
      );
    });

    it('throws an error if trying to start but cant find buggy file', async () => {
      mockingoose(BuggyFileModel).toReturn([], 'find');
      bugHuntGame.join('player1');
      expect(() => bugHuntGame.start('player1')).rejects.toThrow(
        'Cannot select buggy file: no files found',
      );
    });

    it('throws an error if trying to start nim manually', () => {
      expect(() => bugHuntGame.start('player1')).rejects.toThrow('Cannot start game: no players');
    });

    it('throws an error if trying to start nim manually', () => {
      bugHuntGame.join('player1');
      bugHuntGame.join('player2');
      expect(() => bugHuntGame.start('player2')).rejects.toThrow(
        'Cannot start game: not game admin',
      );
    });
  });

  describe('leave', () => {
    it('throws an error if trying to join a game the player is not in', () => {
      // act
      expect(() => bugHuntGame.leave('player1')).toThrow(
        'Cannot leave game: player player1 is not in the game.',
      );
    });
  });

  describe('applyMove', () => {
    describe('Moves with multiple players', () => {
      const baseMove: GameMove<BugHuntMove> = {
        move: { selectedLines: [1, 2, 3] },
        playerID: 'player1',
        gameID: 'testGameID',
      };

      beforeEach(async () => {
        mockingoose(BuggyFileModel).toReturn(
          [
            {
              _id: '67f42bffada65b7ff17dae09',
              code: `code\ncode\ncode\ncode\n`,
              description: `The purpose of this program.`,
              buggyLines: [2, 3, 4],
            } as BuggyFile,
          ],
          'find',
        );
        bugHuntGame.join('player1');
        bugHuntGame.join('player2');
        await bugHuntGame.start('player1');
        expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
        expect(bugHuntGame.state.moves).toEqual([]);
      });

      it('should apply a valid move', () => {
        bugHuntGame.applyMove(baseMove);

        expect(bugHuntGame.state.moves.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([baseMove]);
        expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
      });

      it('should apply a valid move with selecting 1 line', () => {
        const oneLine: GameMove<BugHuntMove> = {
          move: { selectedLines: [1] },
          playerID: 'player1',
          gameID: 'testGameID',
        };

        bugHuntGame.applyMove(oneLine);

        expect(bugHuntGame.state.moves.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([oneLine]);
        expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
      });

      it('should apply a valid move with selecting max lines', () => {
        const threeLines: GameMove<BugHuntMove> = {
          move: { selectedLines: [1, 2, 5] },
          playerID: 'player1',
          gameID: 'testGameID',
        };

        bugHuntGame.applyMove(threeLines);

        expect(bugHuntGame.state.moves.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([threeLines]);
        expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
      });

      it('multiple winners', () => {
        const win1: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const win2: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player2',
          gameID: 'testGameID',
        };

        bugHuntGame.applyMove(win1);
        bugHuntGame.applyMove(win2);

        expect(bugHuntGame.state.moves.length).toEqual(2);
        expect(bugHuntGame.state.winners!.length).toEqual(2);
        expect(bugHuntGame.state.status).toEqual('OVER');
      });

      it('should throw an error if the game has not started', () => {
        const unstartedBugHuntGame = new BugHuntGame('BugHunt');
        unstartedBugHuntGame.join('player1');
        const move: GameMove<BugHuntMove> = {
          move: { selectedLines: [1, 2, 5] },
          playerID: 'player1',
          gameID: 'testGameID',
        };

        expect(() => unstartedBugHuntGame.applyMove(move)).toThrow(
          'Invalid move: game is not in progress',
        );
      });

      it('should throw an error if the player is not in the game', () => {
        const move: GameMove<BugHuntMove> = {
          move: { selectedLines: [1, 2, 5] },
          playerID: 'player4',
          gameID: 'testGameID',
        };
        expect(() => bugHuntGame.applyMove(move)).toThrow(
          'Invalid move: player is not in the game',
        );
      });

      it('should throw an error if the player has already won', () => {
        const move: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move);
        expect(() => bugHuntGame.applyMove(move)).toThrow('Invalid move: player has already won');
      });

      it('should throw an error if the player has already lost', () => {
        const move: GameMove<BugHuntMove> = {
          move: { selectedLines: [2] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move);
        bugHuntGame.applyMove(move);
        bugHuntGame.applyMove(move);
        expect(() => bugHuntGame.applyMove(move)).toThrow(
          'Invalid move: player already guessed the maximum number of times',
        );
      });
    });
    describe('Game ending moves', () => {
      beforeEach(async () => {
        mockingoose(BuggyFileModel).toReturn(
          [
            {
              _id: '67f42bffada65b7ff17dae09',
              code: `code\ncode\ncode\ncode\n`,
              description: `The purpose of this program.`,
              buggyLines: [2, 3, 4],
            } as BuggyFile,
          ],
          'find',
        );
        bugHuntGame.join('player1');
        await bugHuntGame.start('player1');
        expect(bugHuntGame.state.status).toEqual('IN_PROGRESS');
        expect(bugHuntGame.state.moves).toEqual([]);
      });

      it('should win game with perfect score', () => {
        const winMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(winMove);

        expect(bugHuntGame.state.moves.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([winMove]);
        expect(bugHuntGame.state.scores).toEqual([
          { accuracy: 1, player: 'player1', timeMilliseconds: expect.any(Number) },
        ]);
        expect(bugHuntGame.state.status).toEqual('OVER');
      });

      it('should win game with perfect score minus hint penalties', () => {
        const winMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const hintMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [], isHint: true },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(hintMove);
        bugHuntGame.applyMove(hintMove);
        bugHuntGame.applyMove(winMove);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.moves).toEqual([hintMove, hintMove, winMove]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: 1 + 2 * BUGHUNT_HINT_PENALTY,
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);

        expect(bugHuntGame.state.status).toEqual('OVER');
      });

      it('should win game with nonperfect score with multi guesses', () => {
        const move1: GameMove<BugHuntMove> = {
          move: { selectedLines: [2] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move2: GameMove<BugHuntMove> = {
          move: { selectedLines: [3] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move3: GameMove<BugHuntMove> = {
          move: { selectedLines: [4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move1);
        bugHuntGame.applyMove(move2);
        bugHuntGame.applyMove(move3);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.winners!.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([move1, move2, move3]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: expect.closeTo(0.33, 2),
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);
        expect(bugHuntGame.state.status).toEqual('OVER');
      });
      it('should lose game with nonperfect score with multi guesses', () => {
        const move1: GameMove<BugHuntMove> = {
          move: { selectedLines: [2] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move2: GameMove<BugHuntMove> = {
          move: { selectedLines: [3] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move3: GameMove<BugHuntMove> = {
          move: { selectedLines: [8] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move1);
        bugHuntGame.applyMove(move2);
        bugHuntGame.applyMove(move3);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.moves).toEqual([move1, move2, move3]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: expect.closeTo(0.22, 2),
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);
        expect(bugHuntGame.state.status).toEqual('OVER');
      });
    });
  });
});

describe('BugHuntGame Daily tests', () => {
  let bugHuntGame: BugHuntGame;

  beforeEach(() => {
    bugHuntGame = new BugHuntGame('BugHuntDaily');
  });

  describe('constructor', () => {
    it('creates a blank game', () => {
      expect(bugHuntGame.id).toBeDefined();
      expect(bugHuntGame.id).toEqual(expect.any(String));
      expect(bugHuntGame.state.status).toBe('DAILY');
      expect(bugHuntGame.state.moves).toEqual([]);
      expect(bugHuntGame.state.logs).toEqual([]);
      expect(bugHuntGame.state.scores).toEqual([]);
      expect(bugHuntGame.state.winners).toBeUndefined();
      expect(bugHuntGame.state.createdAt).toEqual(expect.any(Date));
      expect(bugHuntGame.state.updatedAt).toEqual(expect.any(Date));
      expect(bugHuntGame.gameType).toEqual('BugHuntDaily');
    });
  });

  describe('toModel', () => {
    it('should return a representation of the current game state', () => {
      const gameState: GameInstance<BugHuntGameState> = {
        state: {
          moves: [],
          status: 'DAILY',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          logs: [],
          scores: [],
        },
        gameID: expect.any(String),
        players: [],
        gameType: 'BugHuntDaily',
      };

      expect(bugHuntGame.toModel()).toEqual(gameState);
    });
  });

  describe('start', () => {
    it('starts game successfully', async () => {
      mockingoose(BuggyFileModel).toReturn(
        [
          {
            _id: '67f42bffada65b7ff17dae09',
            code: `code\ncode\ncode\ncode\n`,
            description: `The purpose of this program.`,
            buggyLines: [2, 3, 4],
          } as BuggyFile,
        ],
        'find',
      );
      expect(bugHuntGame.state.logs).toEqual([]);

      bugHuntGame.join('player1');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('DAILY');
      await bugHuntGame.start('this should not matter');

      expect(bugHuntGame.state.logs).toEqual([
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'CREATED_GAME',
        },
        {
          createdAt: expect.any(Date),
          player: 'player1',
          type: 'JOINED',
        },
        {
          createdAt: expect.any(Date),
          player: 'this should not matter',
          type: 'STARTED',
        },
      ]);
      expect(bugHuntGame.state.status).toEqual('DAILY');
    });
  });

  describe('applyMove', () => {
    describe('Game ending moves', () => {
      beforeEach(async () => {
        mockingoose(BuggyFileModel).toReturn(
          [
            {
              _id: '67f42bffada65b7ff17dae09',
              code: `code\ncode\ncode\ncode\n`,
              description: `The purpose of this program.`,
              buggyLines: [2, 3, 4],
            } as BuggyFile,
          ],
          'find',
        );
        bugHuntGame.join('player1');
        await bugHuntGame.start('player1');
        expect(bugHuntGame.state.status).toEqual('DAILY');
        expect(bugHuntGame.state.moves).toEqual([]);
      });

      it('should win game with perfect score', () => {
        const winMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(winMove);

        expect(bugHuntGame.state.moves.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([winMove]);
        expect(bugHuntGame.state.scores).toEqual([
          { accuracy: 1, player: 'player1', timeMilliseconds: expect.any(Number) },
        ]);
        expect(bugHuntGame.state.status).toEqual('DAILY');
      });

      it('should win game with perfect score minus hint penalties', () => {
        const winMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [2, 3, 4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const hintMove: GameMove<BugHuntMove> = {
          move: { selectedLines: [], isHint: true },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(hintMove);
        bugHuntGame.applyMove(hintMove);
        bugHuntGame.applyMove(winMove);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.moves).toEqual([hintMove, hintMove, winMove]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: 1 + 2 * BUGHUNT_HINT_PENALTY,
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);

        expect(bugHuntGame.state.status).toEqual('DAILY');
      });

      it('should win game with nonperfect score with multi guesses', () => {
        const move1: GameMove<BugHuntMove> = {
          move: { selectedLines: [2] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move2: GameMove<BugHuntMove> = {
          move: { selectedLines: [3] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move3: GameMove<BugHuntMove> = {
          move: { selectedLines: [4] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move1);
        bugHuntGame.applyMove(move2);
        bugHuntGame.applyMove(move3);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.winners!.length).toEqual(1);
        expect(bugHuntGame.state.moves).toEqual([move1, move2, move3]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: expect.closeTo(0.33, 2),
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);
        expect(bugHuntGame.state.status).toEqual('DAILY');
      });
      it('should lose game with nonperfect score with multi guesses', () => {
        const move1: GameMove<BugHuntMove> = {
          move: { selectedLines: [2] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move2: GameMove<BugHuntMove> = {
          move: { selectedLines: [3] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        const move3: GameMove<BugHuntMove> = {
          move: { selectedLines: [8] },
          playerID: 'player1',
          gameID: 'testGameID',
        };
        bugHuntGame.applyMove(move1);
        bugHuntGame.applyMove(move2);
        bugHuntGame.applyMove(move3);

        expect(bugHuntGame.state.moves.length).toEqual(3);
        expect(bugHuntGame.state.moves).toEqual([move1, move2, move3]);
        expect(bugHuntGame.state.scores).toEqual([
          {
            accuracy: expect.closeTo(0.22, 2),
            player: 'player1',
            timeMilliseconds: expect.any(Number),
          },
        ]);
        expect(bugHuntGame.state.status).toEqual('DAILY');
      });
    });
  });
});
