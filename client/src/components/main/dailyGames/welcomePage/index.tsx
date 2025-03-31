import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Logo from '../../../../assets/buglogo.png';
import {
  BugHuntGameState,
  GameInstance,
  GameStatus,
  GameType,
  NimGameState,
} from '../../../../types/types';

const DailyGamesWelcomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    const gameInstance: GameInstance<BugHuntGameState> = {
      gameID: 'LeOe9VBIw4DtKSzRShvfk',
      gameType: 'BugHunt',
      state: {
        // Add mock or real state properties here
        status: 'IN_PROGRESS',
      },
      players: [
        {
          id: 'player1',
          name: 'Player One',
          score: 0,
        },
      ],
    };
    navigate('/dailyGames/dailyGame', { state: { gameInstance } });
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
