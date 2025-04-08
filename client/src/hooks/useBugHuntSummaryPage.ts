import { useMemo } from 'react';

import { BugHuntGameState, GameInstance } from '../types/types';
import useUserContext from './useUserContext';

const useBugHuntSummaryPage = (gameInstance: GameInstance<BugHuntGameState>) => {
  const { user } = useUserContext();
  const playerScore = useMemo(
    () => gameInstance.state.scores.find(score => score.player === user.username),
    [gameInstance.state.scores, user.username],
  );

  const playerMoves = useMemo(
    () => gameInstance.state.moves.filter(move => move.playerID === user.username),
    [gameInstance.state.moves, user.username],
  );

  return {
    playerScore,
    playerMoves,
  };
};

export default useBugHuntSummaryPage;
