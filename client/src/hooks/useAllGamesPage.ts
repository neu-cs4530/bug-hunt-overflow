import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getGames } from '../services/gamesService';
import { GameInstance, GameState, GameType } from '../types/types';
import useQuery from './useQuery';

type AllGamesPageView = 'current' | 'previous';

/**
 * Custom hook to manage the state and logic for the "All Games" page, including fetching games,
 * creating a new game, and navigating to game details.
 * @returns An object containing the following:
 * - `availableGames`: The list of available game instances.
 * - `handleJoin`: A function to navigate to the game details page for a selected game.
 * - `fetchGames`: A function to fetch the list of available games.
 * - `isModalOpen`: A boolean indicating whether the game creation modal is open.
 * - `handleToggleModal`: A function to toggle the visibility of the game creation modal.
 * - `handleSelectGameType`: A function to select a game type, create a new game, and close the modal.
 */
const useAllGamesPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [currentGames, setCurrentGames] = useState<GameInstance<GameState>[]>([]);
  const [previousGames, setPreviousGames] = useState<GameInstance<GameState>[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AllGamesPageView>('current');

  const fetchGames = async () => {
    try {
      const games = await getGames(undefined, undefined);

      const nonDailyGames = games.filter(game => game.state.status !== 'DAILY');
      const current = nonDailyGames.filter(game => game.state.status !== 'OVER');
      const previous = nonDailyGames.filter(game => game.state.status === 'OVER');

      setCurrentGames(current);
      setPreviousGames(previous);
    } catch (getGamesError) {
      setError('Error fetching games');
    }
  };

  const handleCreateGame = async (gameType: GameType) => {
    try {
      await createGame(gameType);
      await fetchGames(); // Refresh the list after creating a game
    } catch (createGameError) {
      setError('Error creating game');
    }
  };

  const handleJoin = (gameID: string) => {
    navigate(`/games/${gameID}`);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleToggleModal = () => {
    setIsModalOpen(prevState => !prevState);
  };

  const handleSelectGameType = (gameType: GameType) => {
    handleCreateGame(gameType);
    handleToggleModal();
  };

  const handleViewChange = (view: AllGamesPageView) => {
    navigate(`/games?view=${view}`, { replace: true });
  };

  useEffect(() => {
    const viewParam = query.get('view');
    if (viewParam) {
      if (viewParam !== 'current' && viewParam !== 'previous') {
        return;
      }
      setCurrentView(viewParam);
    }
  }, [query]);

  return {
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
  };
};

export default useAllGamesPage;
