import React from 'react';
import './index.css';

const DailyGamesWelcomePage = () => (
  <div className='welcome-container'>
    <div className='modal'>
      <div className='logo'>
        <div className='diamond'></div>
      </div>
      <h1 className='title'>The Mini Crossword</h1>
      <p className='subtitle'>Ready to start solving?</p>
      <button className='play-button'>Play</button>
      <p className='date'>Monday, March 17, 2025</p>
      <p className='author'>By Joel Fagliano</p>
    </div>
  </div>
);

export default DailyGamesWelcomePage;
