import { useState, useEffect } from 'react';
import { getAllDailyGamesForPlayer } from '../services/bugHuntService';

interface DailyGame {
  date: string;
  accuracy: number;
  timeMilliseconds: number;
}

/**
 * Custom hook to fetch all daily games a player has completed.
 * @param playerID - The ID of the player for whom to fetch the games.
 * @returns An object containing the games, loading state, and any error encountered.
 */
const useAllDailyGamesForPlayer = (playerID: string) => {
  const [games, setGames] = useState<DailyGame[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const fetchedGames = await getAllDailyGamesForPlayer(playerID);
        setGames(fetchedGames);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (playerID) {
      fetchGames();
    }
  }, [playerID]);

  return { games, loading, error };
};

export default useAllDailyGamesForPlayer;
