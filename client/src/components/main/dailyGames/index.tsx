import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  BugHuntGameState,
  GameInstance,
  GameStatus,
  GameType,
  NimGameState,
} from '../../../types/types';
import WelcomeBanner from './welcomePage/WelcomeBanner';

const DailyGames = () => (
  <Routes>
    <Route path='/' element={<WelcomeBanner />} />
  </Routes>
);

export default DailyGames;
