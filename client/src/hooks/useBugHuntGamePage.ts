import { useCallback, useMemo, useState } from 'react';
import useUserContext from './useUserContext';
import { GameInstance, GameMove, BugHuntMove, BugHuntGameState } from '../types/types';
import { CodeLineStyle } from '../components/main/codeBlock';

const SELECTED_LINE_BACKGROUND_COLOR = 'lightcoral';

/**
 * Custom hook to manage the state and logic for the "BugHunt" game page,
 * including populating an answer and submitting it.
 * @param gameInstance The current instance of the Nim game.
 * @returns An object containing the following:
 * - `selectedLines`: The current lines selected for submission.
 * - `move`: The current move entered by the player.
 * - `handleMakeMove`: A function to send the player's move to the server via a socket event.
 * - `handleInputChange`: A function to update the move state based on user input (1 to 3 objects).
 */

const useBugHuntGamePage = (gameInstance: GameInstance<BugHuntGameState>) => {
  const { user, socket } = useUserContext();
  const [selectedLines, setSelectedLines] = useState<number[]>([]);

  /**
   *
   */
  const lineStyles = useMemo<{ [key: number]: CodeLineStyle }>(
    () =>
      selectedLines.reduce(
        (acc, curr) => ({
          ...acc,
          [curr]: {
            backgroundColor: SELECTED_LINE_BACKGROUND_COLOR,
          },
        }),
        {},
      ),
    [selectedLines],
  );

  /**
   *
   */
  const handleSubmit = async () => {
    const move: GameMove<BugHuntMove> = {
      playerID: user.username,
      gameID: gameInstance.gameID,
      move: { selectedLines },
    };

    socket.emit('makeMove', {
      gameID: gameInstance.gameID,
      move,
    });
  };

  /**
   *
   */
  const handleSelectLine = useCallback(
    (lineNumber: number) => {
      setSelectedLines(curr =>
        // remove or add
        curr.includes(lineNumber) ? curr.filter(n => n !== lineNumber) : [...curr, lineNumber],
      );
    },
    [setSelectedLines],
  );

  return {
    selectedLines,
    lineStyles,
    handleSubmit,
    handleSelectLine,
  };
};

export default useBugHuntGamePage;
