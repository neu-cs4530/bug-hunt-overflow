import './index.css';
import { useCallback } from 'react';
import useGameSummaryPage from '../../../../hooks/useGameSummaryPage';
import { BugHuntGameState, GameInstance, GameType } from '../../../../types/types';
import BugHuntSummaryPage from '../bugHuntSummaryPage';

const GameSummaryPage = () => {
  const { gameInstance } = useGameSummaryPage();

  /**
   * Renders the appropriate game summary component based on the game type.
   * @param gameType The type of the game to render (e.g., "Nim").
   * @returns A React component corresponding to the specified game type, or a
   * fallback message for unknown types.
   */
  const renderSummaryComponent = useCallback(
    (gameType: GameType) => {
      if (!gameInstance) return null;

      switch (gameType) {
        case 'Nim':
          return <p>Not supported</p>;
        case 'BugHunt':
        case 'BugHuntDaily':
          return (
            <BugHuntSummaryPage gameInstance={gameInstance as GameInstance<BugHuntGameState>} />
          );
        default:
          return <div>Unknown game type</div>;
      }
    },
    [gameInstance],
  );

  if (!gameInstance) {
    return <div>Missing game ID</div>;
  }

  return <>{renderSummaryComponent(gameInstance.gameType)}</>;
};

export default GameSummaryPage;
