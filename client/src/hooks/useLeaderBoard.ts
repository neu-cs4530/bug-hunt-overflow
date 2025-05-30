import { useState, useEffect } from 'react';
import { getDailyBugHuntScores } from '../services/bugHuntService';
import { BugHuntScore } from '../types/types';

const useLeaderBoard = (date: string) => {
  const [data, setData] = useState<BugHuntScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderBoardData = async () => {
      try {
        setLoading(true);
        const scores = await getDailyBugHuntScores(date);
        setData(scores);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderBoardData();
  }, [date]);

  return { data, loading, error };
};

export default useLeaderBoard;
