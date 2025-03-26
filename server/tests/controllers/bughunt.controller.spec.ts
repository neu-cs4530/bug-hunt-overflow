import supertest from 'supertest';
import { app } from '../../app';
import * as bughuntService from '../../services/bughunt.service';

describe('BugHunt Controller', () => {
  describe('GET /bughunt/getDailyScores', () => {
    const getDailyBugHuntScoresSpy = jest.spyOn(bughuntService, 'getDailyBugHuntScores');

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 and the daily scores when a valid date is provided', async () => {
      const mockDate = '2025-03-25';
      const mockScores = [
        { player: 'player1', timeMilliseconds: 1200, accuracy: 95 },
        { player: 'player2', timeMilliseconds: 1500, accuracy: 90 },
      ];

      getDailyBugHuntScoresSpy.mockResolvedValueOnce(mockScores);

      const response = await supertest(app).get(`/api/bughunt/getDailyScores?date=${mockDate}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockScores);
      expect(getDailyBugHuntScoresSpy).toHaveBeenCalledWith(mockDate);
    });

    it('should return 400 if the date parameter is missing', async () => {
      const response = await supertest(app).get('/api/bughunt/getDailyScores');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid or missing date parameter');
      expect(getDailyBugHuntScoresSpy).not.toHaveBeenCalled();
    });

    it('should return 400 if the date parameter is not a string', async () => {
      const response = await supertest(app).get('/api/bughunt/getDailyScores?date=12345');

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid or missing date parameter');
      expect(getDailyBugHuntScoresSpy).not.toHaveBeenCalled();
    });

    it('should return 200 and an empty array if no games are found', async () => {
      const mockDate = '2025-03-25';
      getDailyBugHuntScoresSpy.mockResolvedValueOnce([]); // Simulate no games found
    
      const response = await supertest(app).get(`/api/bughunt/getDailyScores?date=${mockDate}`);
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]); // Expect an empty array
    });

    it('should return 500 if the service throws an error', async () => {
      const mockDate = '2025-03-25';
      getDailyBugHuntScoresSpy.mockRejectedValueOnce(new Error('Service error'));

      const response = await supertest(app).get(`/api/bughunt/getDailyScores?date=${mockDate}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching daily BugHunt scores: Service error');
      expect(getDailyBugHuntScoresSpy).toHaveBeenCalledWith(mockDate);
    });
  });
});