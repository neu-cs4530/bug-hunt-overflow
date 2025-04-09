import { useMemo } from 'react';

import { BugHuntGameState, GameInstance } from '../types/types';
import useUserContext from './useUserContext';
import useBuggyFile from './useBuggyFile';

const useBugHuntSummaryPage = (gameInstance: GameInstance<BugHuntGameState>) => {
  const { user } = useUserContext();

  const { buggyFile } = useBuggyFile(gameInstance.state.buggyFile);

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
    totalBugs: buggyFile?.numberOfBugs ?? 0,
    bugsFound: 0,
  };
};

export default useBugHuntSummaryPage;
