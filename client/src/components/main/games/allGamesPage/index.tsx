import './index.css';
import { useMemo } from 'react';
import useAllGamesPage from '../../../../hooks/useAllGamesPage';
import GameCard from './gameCard';

/**
 * Component to display the "All Games" page, which provides functionality to view, create, and join games.
 * @returns A React component that includes:
 * - A "Create Game" button to open a modal for selecting a game type.
 * - A list of available games, each rendered using the `GameCard` component.
 * - A refresh button to reload the list of available games from the server.
 */
const AllGamesPage = () => {
  const {
    currentGames,
    previousGames,
    currentView,
    handleJoin,
    fetchGames,
    isModalOpen,
    handleToggleModal,
    handleSelectGameType,
    handleViewChange,
    error,
  } = useAllGamesPage();

  const title = useMemo(
    () =>
      ({
        current: 'Current Games',
        previous: 'Previous Games',
      })[currentView],
    [currentView],
  );

  const games = useMemo(
    () =>
      ({
        current: currentGames,
        previous: previousGames,
      })[currentView],
    [currentGames, previousGames, currentView],
  );

  return (
    <div className='game-page'>
      <div className='all-games-controls'>
        <h2>{title}</h2>
        {currentView === 'current' && (
          <button className='btn-create-game' onClick={handleToggleModal}>
            Create Game
          </button>
        )}
        <button className='btn-refresh-list' onClick={fetchGames}>
          Refresh List
        </button>
      </div>

      <div className='all-games-nav'>
        <button
          className={`all-games-nav-item ${currentView === 'current' ? 'active' : ''}`}
          onClick={() => handleViewChange('current')}>
          Current Games
        </button>
        <button
          className={`all-games-nav-item ${currentView === 'previous' ? 'active' : ''}`}
          onClick={() => handleViewChange('previous')}>
          Previous Games
        </button>
      </div>

      <div className='game-available'>
        {isModalOpen && (
          <div className='game-modal'>
            <div className='modal-content'>
              <h2>Select Game Type</h2>
              <button onClick={() => handleSelectGameType('Nim')}>Nim</button>
              <button onClick={() => handleSelectGameType('BugHunt')}>Bug Hunt</button>
              <button onClick={handleToggleModal}>Cancel</button>
            </div>
          </div>
        )}
        <div className='game-list'>
          {error && <div className='game-error'>{error}</div>}

          <div className='game-items'>
            {games.map(game => (
              <GameCard key={game.gameID} game={game} handleJoin={handleJoin} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllGamesPage;
