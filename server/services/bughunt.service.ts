import BugHuntModel from '../models/bughunt.model';
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
 * Fetches the number of consecutive daily games a player has completed starting from today.
 * @param playerID The ID of the player.
 * @returns The number of consecutive daily games completed.
 */
export const getConsecutiveDailyGames = async (playerID: string): Promise<number> => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.toISOString().split('T')[0] + 'T00:00:00.000Z');

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
    let currentDate = startOfToday;

    for (const game of games) {
      const gameDate = new Date(game.state.createdAt.toISOString().split('T')[0] + 'T00:00:00.000Z');

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
