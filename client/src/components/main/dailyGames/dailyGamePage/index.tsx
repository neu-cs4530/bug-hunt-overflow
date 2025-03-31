import React from 'react';
import './index.css';
import { BugHuntGameState, GameInstance } from '@fake-stack-overflow/shared';
import useBugHuntGamePage from '../../../../hooks/useBugHuntGamePage';
import { BugIcon, ClockIcon, QuestionMarkCircleIcon } from '../../../icons';
import { CodeBlock } from '../../codeBlock';

// interface BugHuntGamePageProps {
//   gameInstance: GameInstance<BugHuntGameState>;
// }

const DailyGamePage = () => {
  const date = new Date();

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function handleSubmit() {
    throw new Error('Function not implemented.');
  }

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
    <>
      <div className='bug-hunt-header'>
        <div className='bug-hunt-hud'>
          <p className='bug-hunt-hud-item'>
            <ClockIcon />
          </p>
          <p className='bug-hunt-hud-item'>
            <BugIcon />
            <span>10 Bugs Found</span>
          </p>
          <p className='bug-hunt-hud-item'>
            <QuestionMarkCircleIcon />
            <span>7 Guesses Remaining</span>
          </p>
        </div>

        <button
          className='btn-submit'
          // disabled={selectedLines.length === 0}
          onClick={() => {}}>
          Submit Answer
        </button>
      </div>
      <div className='bug-hunt-code'>
        {/* {buggyFile ? (
          <CodeBlock
            code={buggyFile?.code}
            lineStyles={lineStyles}
            onClickLine={handleSelectLine}
          />
        ) : (
          <></>
        )} */}
      </div>
    </>
  );
};

export default DailyGamePage;
