import supertest from 'supertest';
import { app } from '../../app';
import * as bugHuntService from '../../services/bughunt.service';

const getDailyBugHuntScoresSpy = jest.spyOn(bugHuntService, 'getDailyBugHuntScores');
const getConsecutiveDailyGamesSpy = jest.spyOn(bugHuntService, 'getConsecutiveDailyGames');

describe('BugHunt Controller', () => {
  describe('GET /bughunt/getDailyScores', () => {
    it('should return 200 with daily BugHunt scores for a valid date', async () => {
      const mockDate = '2025-03-25';
      const mockScores = [
        { player: 'user1', timeMilliseconds: 1200, accuracy: 95 },
        { player: 'user2', timeMilliseconds: 1500, accuracy: 90 },
      ];

      getDailyBugHuntScoresSpy.mockResolvedValueOnce(mockScores);

      const response = await supertest(app)
        .get('/bughunt/getDailyScores')
        .query({ date: mockDate });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockScores);
      expect(getDailyBugHuntScoresSpy).toHaveBeenCalledWith(mockDate);
    });

    it('should return 400 if the date parameter is missing', async () => {
      const response = await supertest(app).get('/bughunt/getDailyScores');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid or missing date parameter');
      expect(getDailyBugHuntScoresSpy).not.toHaveBeenCalled();
    });

    it('should return 500 if the service throws an error', async () => {
      const mockDate = '2025-03-25';

      getDailyBugHuntScoresSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .get('/bughunt/getDailyScores')
        .query({ date: mockDate });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error fetching daily BugHunt scores: Database error');
      expect(getDailyBugHuntScoresSpy).toHaveBeenCalledWith(mockDate);
    });
  });

  describe('GET /bughunt/getConsecutiveDailyGames', () => {
    it('should return 200 with the streak for a valid playerID', async () => {
      const mockPlayerID = 'player1';
      const mockStreak = 3;

      getConsecutiveDailyGamesSpy.mockResolvedValueOnce(mockStreak);

      const response = await supertest(app)
        .get('/bughunt/getConsecutiveDailyGames')
        .query({ playerID: mockPlayerID });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ streak: mockStreak });
      expect(getConsecutiveDailyGamesSpy).toHaveBeenCalledWith(mockPlayerID);
    });

    it('should return 400 if the playerID parameter is missing', async () => {
      const response = await supertest(app).get('/bughunt/getConsecutiveDailyGames');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid or missing playerID parameter');
      expect(getConsecutiveDailyGamesSpy).not.toHaveBeenCalled();
    });

    it('should return 500 if the service throws an error', async () => {
      const mockPlayerID = 'player1';

      getConsecutiveDailyGamesSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .get('/bughunt/getConsecutiveDailyGames')
        .query({ playerID: mockPlayerID });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error fetching consecutive daily games: Database error');
      expect(getConsecutiveDailyGamesSpy).toHaveBeenCalledWith(mockPlayerID);
    });
  });
});
