import { BuggyFile, SafeBuggyFile } from '@fake-stack-overflow/shared';
import BuggyFileModel from '../models/buggyFile.model';
import BugHuntModel from '../models/bughunt.model';

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
 * Fetches the number of consecutive daily games a player has completed starting from today.
 * @param playerID The ID of the player.
 * @returns The number of consecutive daily games completed.
 */
export const getConsecutiveDailyGames = async (playerID: string, date: string): Promise<number> => {
  try {
    const today = new Date(`${date}T00:00:00.000Z`);
    const startOfToday = new Date(`${today.toISOString().split('T')[0]}T00:00:00.000Z`);
    // Query for all daily games completed by the player, sorted by date descending
    const games = await BugHuntModel.find(
      {
        'state.status': 'DAILY',
        'state.scores.player': playerID,
      },
      'state.createdAt',
    )
      .sort({ 'state.createdAt': -1 })
      .lean();

    if (!games || games.length === 0) {
      return 0;
    }

    let streak = 0;
    const currentDate = startOfToday;

    for (const game of games) {
      const gameDate = new Date(
        `${game.state.createdAt.toISOString().split('T')[0]}T00:00:00.000Z`,
      );

      // Check if the game is on the current streak date
      if (gameDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to the previous day
      } else if (gameDate.getTime() < currentDate.getTime() - 86400000) {
        // Break the streak if there's a gap
        break;
      }
    }
    return streak;
  } catch (error) {
    throw new Error(`Error retrieving consecutive daily games: ${error}`);
  }
};

/**
 * Fetches all daily games a player has completed.
 * @param playerID The ID of the player.
 * @returns An array of objects containing the date, accuracy, and time of each game.
 */
export const getAllDailyGamesForPlayer = async (
  playerID: string,
): Promise<{ date: string; accuracy: number; timeMilliseconds: number }[]> => {
  try {
    const games = await BugHuntModel.find(
      {
        'state.status': 'DAILY',
        'state.scores.player': playerID,
      },
      'state.createdAt state.scores',
    )
      .sort({ 'state.createdAt': -1 })
      .lean();

    if (!games || games.length === 0) {
      return [];
    }

    // Extract the relevant data for each game
    const playerGames = games.flatMap(game =>
      game.state.scores
        .filter(score => score.player === playerID)
        .map(score => ({
          date: new Date(game.state.createdAt).toISOString().split('T')[0],
          accuracy: score.accuracy,
          timeMilliseconds: score.timeMilliseconds,
        })),
    );

    return playerGames;
  } catch (error) {
    throw new Error(`Error retrieving daily games for player: ${error}`);
  }
};
