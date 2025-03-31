import api from './config';

const BUG_HUNT_API_URL = `${process.env.REACT_APP_SERVER_URL}/bughunt`;

/**
 * Fetches daily BugHunt scores for a specific date.
 *
 * @param date - The date for which to fetch the BugHunt scores (format: YYYY-MM-DD).
 * @returns A promise resolving to the list of BugHunt scores.
 * @throws Error if the request fails or the response status is not 200.
 */
const getDailyBugHuntScores = async (
  date: string,
): Promise<{ player: string; timeMilliseconds: number; accuracy: number }[]> => {
  const res = await api.get(`${BUG_HUNT_API_URL}/getDailyScores`, {
    params: { date },
  });

  if (res.status !== 200) {
    throw new Error('Error when fetching daily BugHunt scores');
  }

  return res.data;
};

/**
 * Fetches the number of consecutive daily games a player has completed.
 *
 * @param playerID - The ID of the player for whom to fetch the streak.
 * @returns A promise resolving to the streak count.
 * @throws Error if the request fails or the response status is not 200.
 */
const getConsecutiveDailyGames = async (
  playerID: string,
  date: string,
): Promise<{ streak: number }> => {
  const res = await api.get(`${BUG_HUNT_API_URL}/getConsecutiveDailyGames`, {
    params: { playerID, date },
  });

  if (res.status !== 200) {
    throw new Error('Error when fetching consecutive daily games streak');
  }

  return res.data;
};

export { getDailyBugHuntScores, getConsecutiveDailyGames };
