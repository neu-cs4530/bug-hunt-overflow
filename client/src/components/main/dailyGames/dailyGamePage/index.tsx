import React, { useEffect, useState } from 'react';
import './index.css';
import { BugHuntGameState, GameInstance } from '@fake-stack-overflow/shared';
import { useNavigate } from 'react-router-dom';
import useBugHuntGamePage from '../../../../hooks/useBugHuntGamePage';
import { BugIcon, ClockIcon, QuestionMarkCircleIcon } from '../../../icons';
import { CodeBlock } from '../../codeBlock';

// interface BugHuntGamePageProps {
//   gameInstance: GameInstance<BugHuntGameState>;
// }

interface GameState {
  bugsFound: number;
  totalBugs: number;
  guessesRemaining: number;
  code: string[];
}

const DailyGamePage: React.FC = () => {
  const navigate = useNavigate();

  // Example game state
  const [gameState, setGameState] = useState<GameState>({
    bugsFound: 0,
    totalBugs: 6,
    guessesRemaining: 3,
    code: [
      'class Transaction {',
      '  constructor(',
      '    public type: "Deposit" | "Withdrawal",',
      '    public amount: number,',
      '    public date: Date = new Date()',
      '  ) {}',
      '}', // More lines can be added
    ],
  });

  const [elapsedTime, setElapsedTime] = useState(0); // Time in seconds

  // Start the timer on mount
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000); // Increment every second

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, []);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };

  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [selectedLines, setSelectedLines] = useState<number[]>([]);

  // Select a line when clicked
  const toggleLineSelection = (index: number) => {
    setSelectedLines(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index],
    );
  };

  // Handle submit answer
  const handleSubmit = () => {
    console.log('Selected lines:', selectedLines);
    alert('Answer submitted!');
  };

  // const { gameInstance } = props;
  // const { user } = useUserContext();
  // const {
  //   selectedLines,
  //   correctLines,
  //   lineStyles,
  //   isCreator,
  //   buggyFile,
  //   stopwatch,
  //   movesRemaining,
  //   handleStartGame,
  //   handleSelectLine,
  //   handleSubmit,
  // } = useBugHuntGamePage(gameInstance);

  return (
    <div className='game-container'>
      <header className='game-header'>
        <h1>
          Bug Hunt Game | <span className='status'>{formattedDate}</span>
        </h1>
        <div className='hud'>
          <p>
            <ClockIcon /> {formatTime(elapsedTime)}
          </p>
          <p>
            <BugIcon /> {gameState.bugsFound}/{gameState.totalBugs} Bugs Found
          </p>
          <p>
            <QuestionMarkCircleIcon /> {gameState.guessesRemaining} Guesses Remaining
          </p>
        </div>
        <button className='leave-game' onClick={() => navigate('/')}>
          Leave Game
        </button>
      </header>

      <div className='code-container'>
        <pre className='code-block'>
          {gameState.code.map((line, index) => (
            <div
              key={index}
              className={`code-line ${selectedLines.includes(index) ? 'selected' : ''}`}
              onClick={() => toggleLineSelection(index)}>
              {index + 1}. {line}
            </div>
          ))}
        </pre>
      </div>

      <button className='submit-btn' onClick={handleSubmit} disabled={selectedLines.length === 0}>
        Submit Answer
      </button>
    </div>
  );
};

export default DailyGamePage;
