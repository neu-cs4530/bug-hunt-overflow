import { useCallback, useEffect, useMemo, useState } from 'react';
import { BUGHUNT_MAX_GUESSES } from '@fake-stack-overflow/shared/constants';
import useUserContext from './useUserContext';
import {
  GameInstance,
  GameMove,
  BugHuntMove,
  BugHuntGameState,
  SafeBuggyFile,
} from '../types/types';
import { CodeLineStyle } from '../components/main/codeBlock';
import { getBuggyFile, validateBuggyFileLines } from '../services/bugHuntService';
import { startGame } from '../services/gamesService';

export const SELECTED_LINE_BACKGROUND_COLOR = 'lightskyblue';
export const CORRECT_LINE_BACKGROUND_COLOR = 'lightgreen';
export const WRONG_LINE_BACKGROUND_COLOR = 'lightcoral';

const makeCodeLineStyle = (lines: number[], style: CodeLineStyle) =>
  lines.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: style,
    }),
    {},
  );

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

  const [buggyFile, setBuggyFile] = useState<SafeBuggyFile | null>(null);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [correctLines, setCorrectLines] = useState<number[]>([]);
  const [wrongLines, setWrongLines] = useState<number[]>([]);
  const [stopwatch, setStopwatch] = useState('00:00:00'); // Format: HH:MM:SS

  /**
   * The styles for lines in the CodeBlock
   */
  const lineStyles = useMemo<{ [key: number]: CodeLineStyle }>(
    () => ({
      ...makeCodeLineStyle(selectedLines, {
        backgroundColor: SELECTED_LINE_BACKGROUND_COLOR,
      }),
      ...makeCodeLineStyle(correctLines, {
        backgroundColor: CORRECT_LINE_BACKGROUND_COLOR,
        cursor: 'default',
      }),
      ...makeCodeLineStyle(wrongLines, {
        backgroundColor: WRONG_LINE_BACKGROUND_COLOR,
        cursor: 'default',
      }),
    }),
    [correctLines, selectedLines, wrongLines],
  );

  /**
   * A boolean indiciating whether the user is the creator of the game or not.
   * True if the user is the creator; otherwise, false.
   */
  const isCreator = useMemo<boolean>(() => {
    const creatorLog = gameInstance.state.logs.find(log => log.type === 'CREATED_GAME');
    return creatorLog !== undefined && creatorLog.player === user.username;
  }, [gameInstance.state.logs, user.username]);

  /**
   * The Date object indiciating when the game was started by the creator.
   */
  const gameStartDate = useMemo<Date | null>(() => {
    const startedLog = gameInstance.state.logs.find(log => log.type === 'STARTED');

    if (!startedLog) {
      return null;
    }
    return new Date(startedLog?.createdAt);
  }, [gameInstance.state.logs]);

  /**
   * The Date object indicating when the user first joined the game.
   */
  const playerJoinDate = useMemo<Date | null>(() => {
    const playerJoinLog = gameInstance.state.logs.find(
      log => log.type === 'JOINED' && log.player === user.username,
    );

    if (!playerJoinLog) {
      return null;
    }
    return new Date(playerJoinLog?.createdAt);
  }, [gameInstance.state.logs, user.username]);

  const playerMoves = useMemo(
    () => gameInstance.state.moves.filter(move => move.playerID === user.username),
    [gameInstance.state.moves, user.username],
  );

  /**
   * The number of moves the user has remaining.
   */
  const movesRemaining = useMemo<number>(
    () => BUGHUNT_MAX_GUESSES - playerMoves.length,
    [playerMoves.length],
  );

  const loadBuggyFile = useCallback(
    async (id: string) => {
      try {
        const file = await getBuggyFile(id);
        setBuggyFile(file);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error retrieving buggy file: ${error}`);
      }
    },
    [setBuggyFile],
  );

  const padTime = (n: number) => String(n).padStart(2, '0');

  /**
   * Updates the stopwatch to the difference in time between now and start time provided.
   * @param start is the Date object of when the stopwatch started. This is useful for people rejoining sessions.
   */
  const updateStopwatch = useCallback((start: Date) => {
    const now = new Date();

    let diffMs = Math.abs(now.getTime() - start.getTime());

    const hourMs = 1000 * 60 * 60;
    const hours = Math.floor(diffMs / hourMs);
    diffMs -= hours * hourMs;

    const minuteMs = 1000 * 60;
    const minutes = Math.floor(diffMs / minuteMs);
    diffMs -= minutes * minuteMs;

    const seconds = Math.floor(diffMs / 1000);

    setStopwatch(`${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`);
  }, []);

  const validateLineNumbers = useCallback(
    async (lines: number[]) => {
      const buggyFileId = gameInstance.state.buggyFile;
      if (!buggyFileId) {
        return;
      }

      try {
        const correct = await validateBuggyFileLines(buggyFileId, lines);

        const wrong = lines.filter(n => !correct.includes(n));

        setCorrectLines(curr => [...new Set([...curr, ...correct])]);
        setWrongLines(curr => [...new Set([...curr, ...wrong])]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    [gameInstance.state.buggyFile],
  );

  /**
   * Handler for line number selection, which adds to or removes from the submission.
   * @param lineNumber the line number to select
   */
  const handleSelectLine = useCallback(
    (lineNumber: number) => {
      if (correctLines.includes(lineNumber) || wrongLines.includes(lineNumber)) {
        return;
      }

      setSelectedLines(curr => {
        if (curr.includes(lineNumber)) {
          return curr.filter(n => n !== lineNumber);
        }

        if (selectedLines.length + correctLines.length - 1 >= (buggyFile?.numberOfBugs ?? 0)) {
          return curr;
        }

        return [...curr, lineNumber];
      });
    },
    [buggyFile?.numberOfBugs, correctLines, selectedLines.length, wrongLines],
  );

  /**
   * Submits the users selected lines as a move. Lines can be added to state with {@link handleSelectLine}.
   */
  const handleSubmit = useCallback(async () => {
    if (selectedLines.length === 0) {
      return;
    }
    if (gameInstance.state.status === 'OVER') {
      return;
    }

    const move: GameMove<BugHuntMove> = {
      playerID: user.username,
      gameID: gameInstance.gameID,
      move: { selectedLines: [...selectedLines, ...correctLines] }, // always include correct ones
    };

    socket.emit('makeMove', {
      gameID: gameInstance.gameID,
      move,
    });

    await validateLineNumbers(selectedLines);

    setSelectedLines([]);
  }, [
    correctLines,
    gameInstance.gameID,
    gameInstance.state.status,
    selectedLines,
    socket,
    user.username,
    validateLineNumbers,
  ]);

  /**
   * Handler for starting the game.
   */
  const handleStartGame = useCallback(async () => {
    if (!isCreator || gameInstance.state.status !== 'WAITING_TO_START') return;

    try {
      await startGame(gameInstance.gameID, user.username);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }, [isCreator, gameInstance.state.status, gameInstance.gameID, user.username]);

  // Load validated line numbers in. Only run on first load
  useEffect(() => {
    playerMoves.forEach(move => {
      validateLineNumbers(move.move.selectedLines);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load buggy file from ID in game state
  useEffect(() => {
    const buggyFileId = gameInstance.state.buggyFile;
    if (buggyFileId) {
      loadBuggyFile(buggyFileId);
    }
  }, [gameInstance.state.buggyFile, loadBuggyFile]);

  // Run stopwatch
  useEffect(() => {
    let stopwatchInterval: NodeJS.Timeout;

    if (gameStartDate && playerJoinDate) {
      // Get the later of the two dates
      const laterDate =
        gameStartDate.getTime() > playerJoinDate.getTime() ? gameStartDate : playerJoinDate;
      updateStopwatch(laterDate); // run once at start
      stopwatchInterval = setInterval(() => updateStopwatch(laterDate), 1000);
    }

    return () => {
      clearInterval(stopwatchInterval);
    };
  }, [gameStartDate, playerJoinDate, updateStopwatch]);

  return {
    selectedLines,
    correctLines,
    lineStyles,
    isCreator,
    buggyFile,
    stopwatch,
    movesRemaining,
    handleStartGame,
    handleSubmit,
    handleSelectLine,
  };
};

export default useBugHuntGamePage;
