import { useState, useEffect } from 'react';
import { getConsecutiveDailyGames } from '../services/bugHuntService';

const useConsecutiveDailyGames = (playerID: string, date?: string) => {
  const [streak, setStreak] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      return;
    }

    const fetchStreak = async () => {
      try {
        setLoading(true);
        const response = await getConsecutiveDailyGames(playerID, date);
        setStreak(response.streak);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (playerID) {
      fetchStreak();
    }
  }, [playerID, date]);

  return { streak, loading, error };
};

export default useConsecutiveDailyGames;
