import express, { Request, Response } from 'express';
import { getBuggyFile, getDailyBugHuntScores } from '../services/bughunt.service';

/**
 * Controller for handling BugHunt scores-related routes.
 * @returns An Express router with endpoints for BugHunt scores actions.
 */
const bugHuntScoresController = () => {
  const router = express.Router();

  /**
   * Endpoint to fetch daily BugHunt scores for a specific date.
   * @param req The HTTP request object containing the date as a query parameter.
   * @param res The HTTP response object to send back the scores or an error message.
   */
  router.get('/getDailyScores', async (req: Request, res: Response): Promise<void> => {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      res.status(400).send('Invalid or missing date parameter');
      return;
    }

    try {
      const scores = await getDailyBugHuntScores(date);
      res.status(200).json(scores);
    } catch (error) {
      res.status(500).send(`Error fetching daily BugHunt scores: ${(error as Error).message}`);
    }
  });

  /**
   * Endpoint to fetch buggy file for BugHunt games.
   * @param req The HTTP request containing the buggy file id in path params.
   * @param res The HTTP response object to send back the buggy file or an error message.
   */
  router.get('/buggyFiles/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      res.status(400).send('Missing buggy file id.');
    }

    try {
      const buggyFile = await getBuggyFile(id);
      if (!buggyFile) {
        res.status(404).send('No buggy file with that ID found.');
        return;
      }
      res.status(200).json(buggyFile);
    } catch (error) {
      res.status(500).send(`Error fetching buggy file.`);
    }
  });

  return router;
};

export default bugHuntScoresController;
