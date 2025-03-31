import { SafeBuggyFile } from '@fake-stack-overflow/shared';
import api from './config';

const BUG_HUNT_API_URL = `${process.env.REACT_APP_SERVER_URL}/bughunt`;

/**
 * Fetches daily BugHunt scores for a specific date.
 *
 * @param date - The date for which to fetch the BugHunt scores (format: YYYY-MM-DD).
 * @returns A promise resolving to the list of BugHunt scores.
 * @throws Error if the request fails or the response status is not 200.
 */
export const getDailyBugHuntScores = async (
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
 * Fetches the buggy file with a specific id.
 * @param id the id of the buggy file.
 * @retruns safe buggy file object (without answers).
 * @throws if the response status is not 200.
 */
export const getBuggyFile = async (id: string): Promise<SafeBuggyFile> => {
  const res = await api.get(`${BUG_HUNT_API_URL}/buggyFiles/${id}`);

  if (res.status !== 200) {
    throw new Error('Error while fetcing buggy file');
  }

  return res.data;
};

/** Fetches the number of consecutive daily games a player has completed.
 * @param playerID - The ID of the player for whom to fetch the streak.
 * @returns A promise resolving to the streak count.
 * @throws Error if the request fails or the response status is not 200.
 */
export const getConsecutiveDailyGames = async (
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

/**
 * Validates the provided lines with the correct buggy file lines, returning the array of correct guesses.
 * @param id the id of the buggy file.
 * @param lines the lines to compare against the buggy file's correct lines.
 * @retruns the correct lines from the provided guess
 * @throws if the response status is not 200.
 */
export const validateBuggyFileLines = async (id: string, lines: number[]): Promise<number[]> => {
  const res = await api.post(`${BUG_HUNT_API_URL}/buggyFiles/${id}/validate`, { lines });

  if (res.status !== 200) {
    throw new Error('Error while validating lines against buggy file answers');
  }

  return res.data;
};
