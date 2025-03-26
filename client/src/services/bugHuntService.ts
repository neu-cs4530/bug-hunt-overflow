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
