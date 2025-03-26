import React from 'react';
import './index.css';

const GamePage = () => {
  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className='game-page'>
      <header className='header'>
        <h1 className='title'>The Bug Hunt</h1>
        <p className='subtitle'>{formattedDate}</p>
        <p className='authors'>By Joel, Thomas, Jackson, and Maggie</p>
      </header>

      <div className='crossword-container'>
        {/* Placeholder for crossword */}
        <div className='crossword-placeholder'>game goes here</div>

        <div className='clues-container'>
          <div className='clues-section'>
            <h2 className='clues-title'>Clues</h2>
            <ul className='clues-list'>
              <li>
                <strong>1</strong> Grouchy homeowner in Pixar&apos;s &quot;Up&quot;
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
