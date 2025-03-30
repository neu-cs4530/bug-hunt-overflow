import BugHuntModel from '../../models/bughunt.model';
import { getDailyBugHuntScores , getConsecutiveDailyGames} from '../../services/bughunt.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('BugHunt Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  describe('getDailyBugHuntScores', () => {
    it('should return scores for daily BugHunt games on a specific date', async () => {
      const mockDate = '2025-03-25';
      const mockGames = [
        {
          state: {
            status: 'DAILY',
            scores: [
              { player: 'player1', timeMilliseconds: 1200, accuracy: 95 },
              { player: 'player2', timeMilliseconds: 1500, accuracy: 90 },
            ],
          },
          createdAt: new Date(`${mockDate}T10:00:00.000Z`),
        },
      ];

      mockingoose(BugHuntModel).toReturn(mockGames, 'find');

      const result = await getDailyBugHuntScores(mockDate);

      expect(result).toEqual([
        { player: 'player1', timeMilliseconds: 1200, accuracy: 95 },
        { player: 'player2', timeMilliseconds: 1500, accuracy: 90 },
      ]);
    });

    it('should return an empty array if no games are found for the date', async () => {
      const mockDate = '2025-03-25';
      mockingoose(BugHuntModel).toReturn([], 'find'); // Simulate no games found

      const result = await getDailyBugHuntScores(mockDate);

      expect(result).toEqual([]); // Expect an empty array
    });

    it('should throw an error if a database error occurs', async () => {
      const mockDate = '2025-03-25';
      mockingoose(BugHuntModel).toReturn(new Error('Database error'), 'find');
      await expect(getDailyBugHuntScores(mockDate)).rejects.toThrow(
        'Error retrieving daily BugHunt scores: Error: Database error',
      );
    });
  });
});

describe('BugHunt Service - getConsecutiveDailyGames', () => {
  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();
  });

  it('should return the correct streak for consecutive daily games', async () => {
    const mockPlayerID = 'player1';
    const mockGames = [
      {
        state: {
          status: 'DAILY',
          createdAt: new Date('2025-03-30T10:00:00.000Z'),
        },
      },
      {
        state: {
          status: 'DAILY',
          createdAt: new Date('2025-03-29T10:00:00.000Z'),
        },
      },
      {
        state: {
          status: 'DAILY',
          createdAt: new Date('2025-03-28T10:00:00.000Z'),
        },
      },
    ];

    mockingoose(BugHuntModel).toReturn(mockGames, 'find');

    const result = await getConsecutiveDailyGames(mockPlayerID);

    expect(result).toBe(3); // Expect a streak of 3 days
  });

  it('should return 0 if no games are found', async () => {
    const mockPlayerID = 'player1';

    mockingoose(BugHuntModel).toReturn([], 'find'); // Simulate no games found

    const result = await getConsecutiveDailyGames(mockPlayerID);

    expect(result).toBe(0); // Expect a streak of 0
  });

  it('should break the streak if there is a gap in consecutive days', async () => {
    const mockPlayerID = 'player1';
    const mockGames = [
      {
        state: {
          status: 'DAILY',
          createdAt: new Date('2025-03-30T10:00:00.000Z'),
        },
      },
      {
        state: {
          status: 'DAILY',
          createdAt: new Date('2025-03-28T10:00:00.000Z'),
        },
      },
    ];

    mockingoose(BugHuntModel).toReturn(mockGames, 'find');

    const result = await getConsecutiveDailyGames(mockPlayerID);

    expect(result).toBe(1); // Expect a streak of 1 day
  });

  it('should throw an error if a database error occurs', async () => {
    const mockPlayerID = 'player1';

    mockingoose(BugHuntModel).toReturn(new Error('Database error'), 'find');

    await expect(getConsecutiveDailyGames(mockPlayerID)).rejects.toThrow(
      'Error retrieving consecutive daily games: Error: Database error',
    );
  });
});