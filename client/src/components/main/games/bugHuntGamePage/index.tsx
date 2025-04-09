import './index.css';
import useBugHuntGamePage, {
  BUG_HUNT_CORRECT_LINE_BACKGROUND_COLOR,
  BUG_HUNT_HINT_LINE_BACKGROUND_COLOR,
  BUG_HUNT_SELECTED_LINE_BACKGROUND_COLOR,
  BUG_HUNT_WRONG_LINE_BACKGROUND_COLOR,
} from '../../../../hooks/useBugHuntGamePage';
import { CodeBlock } from '../../codeBlock';
import { BugIcon, ClockIcon, QuestionMarkCircleIcon } from '../../../icons';
import { BugHuntGameState, GameInstance } from '../../../../types/types';
import bugHuntRules from '../../../../types/bugHuntRules';

interface BugHuntGamePageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

const BugHuntLegend = () => {
  const legendItems = [
    {
      color: BUG_HUNT_SELECTED_LINE_BACKGROUND_COLOR,
      label: 'Selected to Submit',
    },
    {
      color: BUG_HUNT_CORRECT_LINE_BACKGROUND_COLOR,
      label: 'Correct Guess',
    },
    {
      color: BUG_HUNT_WRONG_LINE_BACKGROUND_COLOR,
      label: 'Wrong Guess',
    },
    {
      color: BUG_HUNT_HINT_LINE_BACKGROUND_COLOR,
      label: 'Removed by Hint',
    },
  ];
  return (
    <div className='bug-hunt-legend'>
      <div className='bug-hunt-legend-content'>
        {legendItems.map(({ color, label }) => (
          <div key={`${color}-${label}`} className='bug-hunt-legend-item'>
            <div style={{ backgroundColor: color }} className='bug-hunt-legend-color'></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BugHuntGamePage = (props: BugHuntGamePageProps) => {
  const { gameInstance } = props;
  // const { user } = useUserContext();
  const {
    selectedLines,
    correctLines,
    lineStyles,
    isCreator,
    buggyFile,
    stopwatch,
    movesRemaining,
    handleStartGame,
    handleSelectLine,
    handleSubmit,
    handleHint,
  } = useBugHuntGamePage(gameInstance);

  if (gameInstance.state.status === 'WAITING_TO_START') {
    return (
      <div>
        {isCreator ? (
          <button
            className='btn-submit btn-start-game'
            onClick={() => {
              handleStartGame();
            }}>
            Start Game
          </button>
        ) : (
          <div>Waiting for game to start</div>
        )}
        <div className='bug-hunt-rules'>
          <h3 className='rules-title'>📜 Game Rules</h3>
          <pre className='rules-text'>{bugHuntRules}</pre>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bug-hunt-header'>
        <div className='bug-hunt-hud'>
          <p className='bug-hunt-hud-item'>
            <ClockIcon />
            <span>{stopwatch}</span>
          </p>
          <p className='bug-hunt-hud-item'>
            <BugIcon />
            <span>
              {correctLines.length}/{buggyFile?.numberOfBugs} Bugs Found
            </span>
          </p>
          <p className='bug-hunt-hud-item'>
            <QuestionMarkCircleIcon />
            <span>{movesRemaining} Guesses Remaining</span>
          </p>
        </div>
        <button
          className='btn-hint'
          onClick={() => {
            handleHint();
          }}>
          Hint
          <span className='hint-info'>Hints deduct 10% from your total accuracy</span>
        </button>
        <button
          className='btn-submit'
          disabled={selectedLines.length === 0}
          onClick={() => {
            handleSubmit();
          }}>
          Submit Answer
        </button>
      </div>

      <BugHuntLegend />

      <div className='bug-hunt-code'>
        {buggyFile ? (
          <CodeBlock
            code={buggyFile?.code}
            lineStyles={lineStyles}
            onClickLine={handleSelectLine}
          />
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default BugHuntGamePage;
