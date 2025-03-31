import './index.css';
import { useCallback } from 'react';
import { GameInstance, GameState } from '../../../../../types/types';
import useUserContext from '../../../../../hooks/useUserContext';

/**
 * Component to display a game card with details about a specific game instance.
 * @param game The game instance to display.
 * @param handleJoin Function to handle joining the game. Takes the game ID as an argument.
 * @returns A React component rendering the game details and a join button if the game is waiting to start.
 */
const GameCard = ({
  game,
  handleJoin,
}: {
  game: GameInstance<GameState>;
  handleJoin: (gameID: string) => void;
}) => {
  const { user } = useUserContext();

  const renderJoinButton = useCallback(() => {
    if (game.players.includes(user.username)) {
      return (
        <button className='btn-join-game' onClick={() => handleJoin(game.gameID)}>
          Rejoin Game
        </button>
      );
    }

    if (game.state.status !== 'WAITING_TO_START') {
      return <></>;
    }

    return (
      <button className='btn-join-game' onClick={() => handleJoin(game.gameID)}>
        Join Game
      </button>
    );
  }, [game.gameID, game.players, game.state.status, handleJoin, user.username]);

  return (
    <div className='game-item'>
      <p>
        <strong>Game ID:</strong> {game.gameID} | <strong>Status:</strong> {game.state.status}
      </p>
      <ul className='game-players'>
        {game.players.map((player: string) => (
          <li key={`${game.gameID}-${player}`}>{player}</li>
        ))}
      </ul>
      {renderJoinButton()}
    </div>
  );
};

export default GameCard;
