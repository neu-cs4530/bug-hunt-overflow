import { useCallback, useEffect, useMemo, useState } from 'react';

import { BugHuntGameState, GameInstance } from '../types/types';
import useUserContext from './useUserContext';
import useBuggyFile from './useBuggyFile';
import { validateBuggyFileLines } from '../services/bugHuntService';

const useBugHuntSummaryPage = (gameInstance: GameInstance<BugHuntGameState>) => {
  const { user } = useUserContext();

  const { buggyFile } = useBuggyFile(gameInstance.state.buggyFile);
  const [correctLines, setCorrectLines] = useState<number[]>([]);

  const playerScore = useMemo(
    () => gameInstance.state.scores.find(score => score.player === user.username),
    [gameInstance.state.scores, user.username],
  );

  const playerMoves = useMemo(
    () => gameInstance.state.moves.filter(move => move.playerID === user.username),
    [gameInstance.state.moves, user.username],
  );

  const finalPlayerMove = useMemo(() => {
    const nonHintMoves = playerMoves.filter(move => !move.move.isHint);
    return nonHintMoves[nonHintMoves.length - 1];
  }, [playerMoves]);

  const validateLineNumbers = useCallback(
    async (lines: number[]) => {
      const buggyFileId = gameInstance.state.buggyFile;
      if (!buggyFileId) {
        return;
      }

      try {
        const correct = await validateBuggyFileLines(buggyFileId, lines);

        setCorrectLines(curr => [...new Set([...curr, ...correct])]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [gameInstance.state.buggyFile],
  );

  useEffect(() => {
    if (finalPlayerMove) {
      validateLineNumbers(finalPlayerMove.move.selectedLines);
    }
  }, [finalPlayerMove, validateLineNumbers]);

  return {
    playerScore,
    playerMoves,
    totalBugs: buggyFile?.numberOfBugs ?? 0,
    bugsFound: correctLines.length,
  };
};

export default useBugHuntSummaryPage;
