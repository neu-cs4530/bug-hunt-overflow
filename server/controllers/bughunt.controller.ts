import express, { Request, Response } from 'express';
import {
  compareBuggyFileLines,
  getHintLine,
  getBuggyFile,
  getDailyBugHuntScores,
  getConsecutiveDailyGames,
  getAllDailyGamesForPlayer,
  getDailyGameInstance,
} from '../services/bughunt.service';
import { BuggyFileValidateRequest } from '../types/types';

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
      return;
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

  /**
   * Endpoint to validate the buggy file against a "guess" of line numbers.
   * @param req The HTTP request containing the array of line numbers in the body {@link BuggyFileValidateRequest}.
   * @param res The HTTP response object to send back the array of correct lines or an error message.
   */
  router.post(
    '/buggyFiles/:id/validate',
    async (req: BuggyFileValidateRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id || typeof id !== 'string') {
        res.status(400).send('Missing buggy file id.');
        return;
      }

      const { lines } = req.body;
      if (!Array.isArray(lines) || lines.length === 0) {
        res.status(400).send('Missing `lines` array containing line numbers to validate');
        return;
      }
      try {
        const correctLines = await compareBuggyFileLines(id, lines);
        if (!correctLines) {
          res.status(404).send('No buggy file with that ID found.');
          return;
        }
        res.status(200).json(correctLines);
      } catch (error) {
        res.status(500).send(`Error fetching buggy file.`);
      }
    },
  );

  /**
   * Endpoint to reveal a line number that is not a bug based on the current known lines.
   * @param req The HTTP request containing the array of known line numbers in the body {@link BuggyFileValidateRequest}.
   * @param res The HTTP response object to send back a good hint or an error message.
   */
  router.post(
    '/buggyFiles/:id/hint',
    async (req: BuggyFileValidateRequest, res: Response): Promise<void> => {
      const { id } = req.params;
      const { lines } = req.body;
      if (!Array.isArray(lines)) {
        res.status(400).send('`knownLines` array of known line numbers needed');
        return;
      }
      try {
        const hintLine = await getHintLine(id, lines);
        if (!hintLine) {
          res.status(404).send('No buggy file with that ID found.');
          return;
        }
        res.status(200).json(hintLine);
      } catch (error) {
        res.status(500).send(`Error fetching buggy file.`);
      }
    },
  );

  /**
   * Endpoint to fetch the number of consecutive daily games a player has completed.
   * @param req The HTTP request object containing the playerID as a query parameter.
   * @param res The HTTP response object to send back the streak or an error message.
   */
  router.get('/getConsecutiveDailyGames', async (req: Request, res: Response): Promise<void> => {
    const { playerID, date } = req.query;

    if (!playerID || typeof playerID !== 'string') {
      res.status(400).send('Invalid or missing playerID parameter');
      return;
    }

    if (!date || typeof date !== 'string') {
      res.status(400).send('Invalid date parameter');
      return;
    }

    try {
      const streak = await getConsecutiveDailyGames(playerID, date);
      res.status(200).json({ streak });
    } catch (error) {
      res.status(500).send(`Error fetching consecutive daily games: ${(error as Error).message}`);
    }
  });

  /**
   * Endpoint to fetch all daily games a player has completed.
   * @param req The HTTP request object containing the playerID as a query parameter.
   * @param res The HTTP response object to send back the games or an error message.
   */
  router.get('/getAllDailyGamesForPlayer', async (req: Request, res: Response): Promise<void> => {
    const { playerID } = req.query;

    if (!playerID || typeof playerID !== 'string') {
      res.status(400).send('Invalid or missing playerID parameter');
      return;
    }

    try {
      const games = await getAllDailyGamesForPlayer(playerID);
      res.status(200).json(games);
    } catch (error) {
      res.status(500).send(`Error fetching daily games for player: ${(error as Error).message}`);
    }
  });

  /**
   * Endpoint to fetch todays BugHunt daily game instance.
   * @param req The HTTP request object containing the date as a query parameter.
   * @param res The HTTP response object to send back the scores or an error message.
   */
  router.get('/dailyInstance', async (req: Request, res: Response): Promise<void> => {
    try {
      const dailyInstance = await getDailyGameInstance();
      res.status(200).json(dailyInstance);
    } catch (error) {
      res
        .status(500)
        .send(`Error fetching todays BugHuntDaily instance: ${(error as Error).message}`);
    }
  });

  return router;
};

export default bugHuntScoresController;
