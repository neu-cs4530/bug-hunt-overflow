import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Logo from '../../../../assets/buglogo.png';

const DailyGamesWelcomePage = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/../game');
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
