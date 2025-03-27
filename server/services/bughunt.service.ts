import { BuggyFile, SafeBuggyFile } from '@fake-stack-overflow/shared';
import BuggyFileModel from '../models/buggyFile.model';
import BugHuntModel from '../models/bughunt.model';

const makeBuggyFileSafe = (buggyFile: BuggyFile): SafeBuggyFile => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id, code, description } = buggyFile;
  return {
    _id,
    code,
    description,
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
        'createdAt': { $gte: startOfDay, $lte: endOfDay },
      },
      'state.scores',
    ).lean();

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

export default getDailyBugHuntScores;
