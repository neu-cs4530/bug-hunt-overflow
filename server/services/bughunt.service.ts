import { BuggyFile, SafeBuggyFile, GameInstance, GameState } from '@fake-stack-overflow/shared';
import BuggyFileModel from '../models/buggyFile.model';
import BugHuntModel from '../models/bughunt.model';
import GameManager from './games/gameManager';

const makeBuggyFileSafe = (buggyFile: BuggyFile): SafeBuggyFile => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, code, description, buggyLines } = buggyFile;
  return {
    _id,
    code,
    description,
    numberOfBugs: buggyLines.length,
  };
};

/**
 * Fetches the scores and player names for BugHunt games marked as 'DAILY' for a specific date.
 * @param date The date to filter games by (in YYYY-MM-DD format).
 * @returns An array of objects containing player names and scores or an error message if no games are found.
 */
export const getDailyBugHuntScores = async (date: string) => {
  try {
    // Parse the date to create a range for the day
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    // Query for games with status 'DAILY' and within the specified date range
    const games = await BugHuntModel.find(
      {
        'state.status': 'DAILY',
        'state.createdAt': { $gte: startOfDay, $lte: endOfDay },
      },
      'state.scores',
    ).lean();
    // eslint-disable-next-line no-console
    console.log('Found games:', games);

    if (!games || games.length === 0) {
      return [];
    }

    // Extract scores and player names from the games
    const scores = games.flatMap(game =>
      game.state.scores.map(score => ({
        player: score.player,
        timeMilliseconds: score.timeMilliseconds,
        accuracy: score.accuracy,
      })),
    );

    return scores;
  } catch (error) {
    throw new Error(`Error retrieving daily BugHunt scores: ${error}`);
  }
};

/**
 * Retrieves a buggy file.
 * @param id the ObjectId of the buggy file.
 * @returns the buggy file, without the answers
 */
export const getBuggyFile = async (id: string): Promise<SafeBuggyFile | null> => {
  try {
    const buggyFile = await BuggyFileModel.findById(id).lean();
    if (!buggyFile) {
      return null;
    }
    return makeBuggyFileSafe(buggyFile);
  } catch (error) {
    throw new Error(`Error retrieving buggy file: ${error}`);
  }
};

/**
 * Compares the correct buggy line numbers with the provided line numbers.
 * @param id the ObjectId of the buggy file.
 * @param lines the array of line numbers to compare to the correct answers.
 * @returns the array of correct line numbers from the provided lines array.
 */
export const compareBuggyFileLines = async (
  id: string,
  lines: number[],
): Promise<number[] | null> => {
  try {
    const buggyFile = await BuggyFileModel.findById(id).lean();
    if (!buggyFile) {
      return null;
    }

    const correctLines = [...new Set(lines)].filter(num => buggyFile.buggyLines.includes(num));
    return correctLines;
  } catch (error) {
    throw new Error(`Error retrieving buggy file: ${error}`);
  }
};

/**
 * Returns an instance of the current day's daily bughunt game or creates a new one if one doesn't exist.
 */
export const getDailyGameInstance = async (): Promise<GameInstance<GameState>> => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const dailyGames = await BugHuntModel.find({
      'gameType': 'BugHuntDaily',
      'state.createdAt': { $gte: startOfDay },
      'state.buggyFile': { $ne: null },
    })
      .select('-_id -__t -__v -state._id')
      .lean();

    if (dailyGames.length > 1) {
      throw new Error(`Multiple daily games found for today`);
    }

    if (!dailyGames || dailyGames.length === 0) {
      const gameManager = GameManager.getInstance();
      const newDailyGameID = await gameManager.addGame('BugHuntDaily');
      if (typeof newDailyGameID !== 'string') {
        throw new Error(newDailyGameID.error);
      }
      const dailyGameInstance = await gameManager.startGame(newDailyGameID, 'DailyBugHuntBackend');
      if ('error' in dailyGameInstance) {
        throw new Error(`Daily game instance does not exist. ${dailyGameInstance.error}`);
      }
      return dailyGameInstance;
    }
    return dailyGames[0];
  } catch (error) {
    throw new Error(`Error retrieving daily game ID: ${error}`);
  }
};
