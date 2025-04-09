import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Logo from '../../../../assets/buglogo.png';
import { GameInstance, GameState } from '../../../../types/types';
import { getDailyGameInstance } from '../../../../services/bugHuntService';

const DailyGamesWelcomePage = () => {
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
    <div className='welcome-container'>
      <div className='modal'>
        <div className='logo'>
          <img src={Logo} alt='Game Logo' className='logo-image' />
        </div>
        <h1 className='title'>The Bug Hunt</h1>
        <p className='subtitle'>Ready to start solving?</p>
        <button className='play-button' onClick={handlePlayClick}>
          Play
        </button>
        <p className='date'>{formattedDate}</p>
        <p className='author'>By Joel, Thomas, Jackson, and Maggie</p>
      </div>
    </div>
  );
};

export default DailyGamesWelcomePage;
