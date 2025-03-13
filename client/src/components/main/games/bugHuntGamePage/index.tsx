import { BugHuntGameState, GameInstance } from '@fake-stack-overflow/shared';
import { useState } from 'react';

interface BugHuntGamePageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

const BugHuntGamePage = () => {
  const test = useState('');
  return <div></div>;
};

export default BugHuntGamePage;
