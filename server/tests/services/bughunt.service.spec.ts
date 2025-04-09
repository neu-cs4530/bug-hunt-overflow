import BugHuntModel from '../../models/bughunt.model';
import BuggyFileModel from '../../models/buggyFile.model';
import {
  getDailyBugHuntScores,
  getConsecutiveDailyGames,
  getHintLine,
  getBuggyFile,
} from '../../services/bughunt.service';
import { BuggyFile } from '../../types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockingoose = require('mockingoose');

describe('BugHunt Service', () => {
  const mockBuggyFileGameID = '123456789';
  let mockBuggyFile: BuggyFile;

  beforeEach(() => {
    mockingoose.resetAll();
    jest.clearAllMocks();

    mockBuggyFile = {
      _id: mockBuggyFileGameID,
      code: `class this line is not useful {
    this line is not a bug
    this line is the bug
    this line is not a bug
    this line is not a bug
    this line is not a bug
    this line is not a bug
  )
}`,
      description: 'Buggy Code',
      buggyLines: [3],
    };
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

  describe('getHintLine', () => {
    it('should return a valid ', async () => {
      const randomSpy = jest.spyOn(Math, 'random');

      const mockKnownLines = [6, 7];

      mockingoose(BuggyFileModel).toReturn(mockBuggyFile, 'findOne');
      randomSpy.mockReturnValueOnce(0);
      const result = await getHintLine(mockBuggyFileGameID, mockKnownLines);

      expect(result).toEqual(2);
    });

    it('should return a valid ', async () => {
      const mockGameID = '123456789';
      const mockKnownLines = [2, 4, 5, 6, 7];

      mockingoose(BuggyFileModel).toReturn(mockBuggyFile, 'findOne');
      const result = await getHintLine(mockGameID, mockKnownLines);

      expect(result).toEqual(-1);
    });

    it('should throw an error if a no buggyfile with id exists', async () => {
      const mockGameID = '123456789';
      const mockKnownLines = [2, 4, 5, 6, 7];
      mockingoose(BuggyFileModel).toReturn(null, 'findOne');
      await expect(getHintLine(mockGameID, mockKnownLines)).rejects.toThrow(
        'Error retrieving buggy file: Error: No buggyfile with given id',
      );
    });

    it('should throw an error if a database error occurs', async () => {
      const mockGameID = '123456789';
      const mockKnownLines = [2, 4, 5, 6, 7];
      mockingoose(BuggyFileModel).toReturn(new Error('Hint error'), 'findOne');
      await expect(getHintLine(mockGameID, mockKnownLines)).rejects.toThrow(
        'Error retrieving buggy file: Error: Hint error',
      );
    });
  });
  describe('BugHunt Service - getConsecutiveDailyGames', () => {
    it('should return the correct streak for consecutive daily games', async () => {
      const mockPlayerID = 'player1';
      const mockDate = '2025-03-30'; // Match the most recent game's date
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

      const result = await getConsecutiveDailyGames(mockPlayerID, mockDate);

      expect(result).toBe(3); // Expect a streak of 3 days
    });

    it('should return 0 if no games are found', async () => {
      const mockPlayerID = 'player1';
      const mockDate = '2025-03-25';

      mockingoose(BugHuntModel).toReturn([], 'find'); // Simulate no games found

      const result = await getConsecutiveDailyGames(mockPlayerID, mockDate);

      expect(result).toBe(0); // Expect a streak of 0
    });

    it('should break the streak if there is a gap in consecutive days', async () => {
      const mockPlayerID = 'player1';
      const mockDate = '2025-03-30'; // Match the most recent game's date

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

      const result = await getConsecutiveDailyGames(mockPlayerID, mockDate);

      expect(result).toBe(1); // Expect a streak of 1 day
    });

    it('should throw an error if a database error occurs', async () => {
      const mockPlayerID = 'player1';
      const mockDate = '2025-03-25';

      mockingoose(BugHuntModel).toReturn(new Error('Database error'), 'find');

      await expect(getConsecutiveDailyGames(mockPlayerID, mockDate)).rejects.toThrow(
        'Error retrieving consecutive daily games: Error: Database error',
      );
    });
  });

  describe('getBuggyFile', () => {
    it('should return a buggy file', async () => {
      mockingoose(BuggyFileModel).toReturn(mockBuggyFile, 'findOne');

      const resFile = await getBuggyFile(mockBuggyFile._id);

      expect(resFile?.description).toBe(mockBuggyFile.description);
      expect(resFile?.code).toBe(mockBuggyFile.code);
      expect(resFile?.numberOfBugs).toBe(mockBuggyFile.buggyLines.length);
    });
  });
});
