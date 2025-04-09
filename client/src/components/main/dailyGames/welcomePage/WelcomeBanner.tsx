import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeBanner.css';
import Logo from '../../../../assets/buglogo.png';
import { GameInstance, GameState } from '../../../../types/types';
import { getDailyGameInstance } from '../../../../services/bugHuntService';

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
    navigate(`/dailyGames/${gameInstance.gameID}`); // Replace with actual game ID
  };

  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='welcome-banner'>
      <div className='welcome-left'>
        <button className='bug-play-button' onClick={handlePlayClick}>
          <img src={Logo} alt='Play Bug Hunt' />
        </button>

        <div className='welcome-text'>
          <h1>The Bug Hunt</h1>
          <p className='subtitle'>Ready to start solving?</p>
          <div className='welcome-right'>
            <p className='date'>Wednesday, April 9, 2025</p>
            <p className='credits'>By Joel, Thomas, Jackson, and Maggie</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
