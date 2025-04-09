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

const DailyGames = () => (
  <Routes>
    <Route path='/' element={<DailyGamesWelcomePage />} />
  </Routes>
);

export default DailyGames;
