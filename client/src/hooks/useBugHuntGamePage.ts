import { useCallback, useEffect, useMemo, useState } from 'react';
import useUserContext from './useUserContext';
import {
  GameInstance,
  GameMove,
  BugHuntMove,
  BugHuntGameState,
  SafeBuggyFile,
} from '../types/types';
import { CodeLineStyle } from '../components/main/codeBlock';
import { startGame } from '../services/gamesService';
import { getBuggyFile } from '../services/bugHuntService';

const SELECTED_LINE_BACKGROUND_COLOR = 'lightskyblue';

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

  const [buggyFile, setBuggyFile] = useState<SafeBuggyFile>();
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [isCreator, setIsCreator] = useState(false);

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
  const handleSubmit = useCallback(async () => {
    const move: GameMove<BugHuntMove> = {
      playerID: user.username,
      gameID: gameInstance.gameID,
      move: { selectedLines },
    };

    socket.emit('makeMove', {
      gameID: gameInstance.gameID,
      move,
    });
  }, [gameInstance.gameID, selectedLines, socket, user.username]);

  const handleStartGame = useCallback(async () => {
    if (!isCreator) return;

    try {
      await startGame(gameInstance.gameID, user.username);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [isCreator, gameInstance.gameID, user.username]);

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

  const loadBuggyFile = useCallback(async (id: string) => {
    try {
      const file = await getBuggyFile(id);
      setBuggyFile(file);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error retrieving buggy file: ${error}`);
    }
  }, []);

  useEffect(() => {
    const creatorLog = gameInstance.state.logs.find(log => log.type === 'CREATED_GAME');
    if (creatorLog && creatorLog.player === user.username) {
      setIsCreator(true);
    }
  }, [gameInstance.state.logs, user.username]);

  useEffect(() => {
    const buggyFileId = gameInstance.state.buggyFile;
    if (buggyFileId) {
      loadBuggyFile(buggyFileId);
    }
  }, [gameInstance.state.buggyFile, loadBuggyFile]);

  return {
    selectedLines,
    lineStyles,
    isCreator,
    buggyFile,
    handleStartGame,
    handleSubmit,
    handleSelectLine,
  };
};

export default useBugHuntGamePage;
