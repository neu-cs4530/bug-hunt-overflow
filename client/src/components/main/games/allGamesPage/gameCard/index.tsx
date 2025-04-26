import './index.css';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameInstance, GameState } from '../../../../../types/types';
import useUserContext from '../../../../../hooks/useUserContext';
import GameStatusBadge from '../../gameStatusBadge';
import { UsersIcon } from '../../../../icons';

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
  const navigate = useNavigate();

  const title = useMemo(
    () =>
      ({
        Nim: 'Nim Game',
        BugHunt: 'Bug Hunt Game',
        BugHuntDaily: 'Bug Hunt Game',
      })[game.gameType],
    [game.gameType],
  );

  const renderActionButton = useCallback(() => {
    if (game.state.status === 'OVER') {
      return (
        <button
          className='btn-join-game'
          onClick={() => {
            navigate(`/games/${game.gameID}/summary`);
          }}>
          See Results
        </button>
      );
    }

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
  }, [game.gameID, game.players, game.state.status, handleJoin, navigate, user.username]);

  return (
    <div className='game-item'>
      <div className='game-item-header'>
        <div>
          <h3>{title}</h3>
        </div>
        <GameStatusBadge status={game.state.status} />
      </div>

      <div className='game-players'>
        <div className='game-players-header'>
          <UsersIcon />
          <h4>Players: </h4>
          <span>
            {game.players.length > 0 ? (
              game.players.map((player, i) => (
                <>
                  <button
                    key={`${game.gameID}-${player}`}
                    className='game-player-item'
                    onClick={() => {
                      navigate(`/user/${user.username}`);
                    }}>
                    {player}
                  </button>
                  {i + 1 !== game.players.length ? ',' : <></>}
                </>
              ))
            ) : (
              <span className='no-players'>None</span>
            )}
          </span>
        </div>
      </div>
      {renderActionButton()}
    </div>
  );
};

export default GameCard;
