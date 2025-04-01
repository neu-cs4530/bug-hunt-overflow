import './index.css';
import { useMemo } from 'react';
import NimGamePage from '../nimGamePage';
import useGamePage from '../../../../hooks/useGamePage';
import {
  BugHuntGameState,
  GameInstance,
  GameStatus,
  GameType,
  NimGameState,
} from '../../../../types/types';
import BugHuntGamePage from '../bugHuntGamePage';

/**
 * Component to display the game page for a specific game type, including controls and game state.
 * @returns A React component rendering:
 * - A header with the game title and current game status.
 * - A "Leave Game" button to exit the current game.
 * - The game component specific to the game type (e.g., `NimGamePage` for "Nim").
 * - An error message if an error occurs during the game.
 */
const GamePage = () => {
  const { gameInstance, error, handleLeaveGame } = useGamePage();

  const title = useMemo(
    () =>
      gameInstance?.gameType
        ? {
            Nim: 'Nim Game',
            BugHunt: 'Bug Hunt Game',
            BugHuntDaily: 'Bug Hunt Daily Game',
          }[gameInstance.gameType]
        : 'Unknown',
    [gameInstance?.gameType],
  );

  /**
   * Renders the appropriate game component based on the game type.
   * @param gameType The type of the game to render (e.g., "Nim").
   * @returns A React component corresponding to the specified game type, or a
   * fallback message for unknown types.
   */
  const renderGameComponent = (gameType: GameType) => {
    if (!gameInstance) return null;

    switch (gameType) {
      case 'Nim':
        return <NimGamePage gameInstance={gameInstance as GameInstance<NimGameState>} />;
      case 'BugHunt':
      case 'BugHuntDaily':
        return <BugHuntGamePage gameInstance={gameInstance as GameInstance<BugHuntGameState>} />;
      default:
        return <div>Unknown game type</div>;
    }
  };

  const renderGameStatus = (gameStatus: GameStatus) => {
    if (!gameStatus) return <></>;

    switch (gameStatus) {
      case 'IN_PROGRESS':
        return <p className='game-status in-progress'>In Progress</p>;
      case 'WAITING_TO_START':
        return <p className='game-status waiting'>Waiting to Start</p>;
      case 'OVER':
        return <p className='game-status over'>Game Over</p>;
      case 'DAILY':
        return <p className='game-status daily'>Daily Game</p>;
      default:
        return <></>;
    }
  };

  if (!gameInstance) {
    return <div>Missing game instance</div>;
  }

  return (
    <div className='game-page'>
      <header className='game-header'>
        <h1>{title}</h1>
        {renderGameStatus(gameInstance.state.status)}
        <div className='game-controls'>
          <button className='btn-leave-game' onClick={handleLeaveGame}>
            Leave Game
          </button>
        </div>
      </header>

      {error && <div className='game-error'>{error}</div>}

      {renderGameComponent(gameInstance.gameType)}
    </div>
  );
};

export default GamePage;
