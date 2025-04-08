import supertest from 'supertest';
import { app } from '../../app';
import * as bugHuntService from '../../services/bughunt.service';

const getDailyBugHuntScoresSpy = jest.spyOn(bugHuntService, 'getDailyBugHuntScores');
const getConsecutiveDailyGamesSpy = jest.spyOn(bugHuntService, 'getConsecutiveDailyGames');
const getHintLineSpy = jest.spyOn(bugHuntService, 'getHintLine');

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
      const mockDate = '2025-03-25';

      getConsecutiveDailyGamesSpy.mockResolvedValueOnce(mockStreak);

      const response = await supertest(app)
        .get('/bughunt/getConsecutiveDailyGames')
        .query({ playerID: mockPlayerID, date: mockDate });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ streak: mockStreak });
      expect(getConsecutiveDailyGamesSpy).toHaveBeenCalledWith(mockPlayerID, mockDate);
    });

    it('should return 400 if the playerID parameter is missing', async () => {
      const response = await supertest(app).get('/bughunt/getConsecutiveDailyGames');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid or missing playerID parameter');
      expect(getConsecutiveDailyGamesSpy).not.toHaveBeenCalled();
    });

    it('should return 500 if the service throws an error', async () => {
      const mockPlayerID = 'player1';
      const mockDate = '2025-03-25';

      getConsecutiveDailyGamesSpy.mockRejectedValueOnce(new Error('Database error'));

      const response = await supertest(app)
        .get('/bughunt/getConsecutiveDailyGames')
        .query({ playerID: mockPlayerID, date: mockDate });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error fetching consecutive daily games: Database error');
      expect(getConsecutiveDailyGamesSpy).toHaveBeenCalledWith(mockPlayerID, mockDate);
    });
  });

  describe('POST /bughunt/buggyFiles/:id/hint', () => {
    it('should return 200 with a valid hint line from a buggy file', async () => {
      const knownLines = [2, 4, 16, 33];
      const mockHintLine = 27;
      const mockID = '123456789';

      getHintLineSpy.mockResolvedValueOnce(mockHintLine);

      const response = await supertest(app)
        .post(`/bughunt/buggyFiles/${mockID}/hint`)
        .send({ lines: knownLines });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockHintLine);
      expect(getHintLineSpy).toHaveBeenCalledWith(mockID, knownLines);
    });

    it('should return 400 if the known lines parameter is missing', async () => {
      const response = await supertest(app).post('/bughunt/buggyFiles/123456789/hint');

      expect(response.status).toBe(400);
      expect(response.text).toBe('`knownLines` array of known line numbers needed');
      expect(getHintLineSpy).not.toHaveBeenCalled();
    });

    it('should return 404 if the gameID is invalid', async () => {
      const knownLines = [2, 4, 16, 33];
      const mockID = '123456789';

      getHintLineSpy.mockResolvedValueOnce(null);

      const response = await supertest(app)
        .post(`/bughunt/buggyFiles/${mockID}/hint`)
        .send({ lines: knownLines });

      expect(response.status).toBe(404);
      expect(response.text).toBe('No buggy file with that ID found.');
      expect(getHintLineSpy).toHaveBeenCalledWith(mockID, knownLines);
    });

    it('should return 500 if the service throws an error', async () => {
      const knownLines = [2, 4, 16, 33];
      const mockID = '123456789';

      getConsecutiveDailyGamesSpy.mockRejectedValueOnce(new Error('Unknown error'));

      const response = await supertest(app)
        .post(`/bughunt/buggyFiles/${mockID}/hint`)
        .send({ lines: knownLines });

      expect(response.status).toBe(500);
      expect(response.text).toContain('Error fetching buggy file.');
      expect(getHintLineSpy).toHaveBeenCalledWith(mockID, knownLines);
    });
  });
});
