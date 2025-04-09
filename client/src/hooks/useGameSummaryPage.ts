import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { GameInstance, GameState } from '../types/types';
import { getGameById } from '../services/gamesService';

const useGameSummaryPage = () => {
  const { gameID: gameId } = useParams();

  const [gameInstance, setGameInstance] = useState<GameInstance<GameState> | undefined>();

  const loadGameInstance = useCallback(async () => {
    if (!gameId) {
      throw new Error('Missing game Id');
    }

    try {
      const game = await getGameById(gameId);
      setGameInstance(game);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error loading game instance: ${error}`);
    }
  }, [gameId]);

  useEffect(() => {
    loadGameInstance();
  }, [loadGameInstance]);

  return {
    gameInstance,
  };
};

export default useGameSummaryPage;
