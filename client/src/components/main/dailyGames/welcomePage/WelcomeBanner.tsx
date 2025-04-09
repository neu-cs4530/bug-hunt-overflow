import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeBanner.css';
import Logo from '../../../../assets/buglogo.png';
import { GameInstance, GameState } from '../../../../types/types';
import { getDailyGameInstance } from '../../../../services/bugHuntService';
import bugHuntRules from '../../../../types/bugHuntRules';

const WelcomeBanner = () => {
  const [gameInstance, setGameInstance] = useState<GameInstance<GameState> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const instance = await getDailyGameInstance();
        setGameInstance(instance);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, []);

  if (loading) return <p>Loading game...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!gameInstance) return <p>No game instance found.</p>;

  const handlePlayClick = () => {
    navigate(`/games/${gameInstance.gameID}`); // Replace with actual game ID
  };

  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='game-page'>
      <header className='game-header'>
        <div className='title-block'>
          <h1>Daily Bug Hunt Challenge</h1>
          <p className='subtitle'>Ready to start solving?</p>
        </div>
        <div className='game-controls'>
          <div className='title-block-other'>
            <p className='date'>{formattedDate}</p>
            <p className='credits'>By Joel, Thomas, Jackson, and Maggie</p>
          </div>
        </div>
      </header>

      <div>
        <button
          className='btn-submit btn-start-game'
          onClick={() => {
            handlePlayClick();
          }}>
          Start Game
        </button>
        <div className='bug-hunt-rules'>
          <h3 className='rules-title'>📜 Game Rules</h3>
          <pre className='rules-text'>{bugHuntRules}</pre>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
