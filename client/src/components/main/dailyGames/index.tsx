import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  BugHuntGameState,
  GameInstance,
  GameStatus,
  GameType,
  NimGameState,
} from '../../../types/types';
import DailyGamesWelcomePage from './welcomePage';
import DailyGamePage from './dailyGamePage';

const DailyGames = () => (
  <Routes>
    <Route path='/' element={<DailyGamesWelcomePage />} />
    <Route path='/dailyGame' element={<DailyGamePage />} />
  </Routes>
);

export default DailyGames;
