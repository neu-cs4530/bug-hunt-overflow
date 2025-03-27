import './index.css';
import { BugHuntGameState, GameInstance } from '@fake-stack-overflow/shared';
import useBugHuntGamePage from '../../../../hooks/useBugHuntGamePage';
import { CodeBlock } from '../../codeBlock';

interface BugHuntGamePageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

const BugHuntGamePage = (props: BugHuntGamePageProps) => {
  const { gameInstance } = props;
  // const { user } = useUserContext();
  const {
    selectedLines,
    lineStyles,
    isCreator,
    buggyFile,
    handleStartGame,
    handleSelectLine,
    handleSubmit,
  } = useBugHuntGamePage(gameInstance);

  if (gameInstance.state.status === 'WAITING_TO_START') {
    if (isCreator) {
      return (
        <button
          className='btn-submit'
          onClick={() => {
            handleStartGame();
          }}>
          Start Game
        </button>
      );
    }
    return <div>Waiting for game to start</div>;
  }

  return (
    <>
      <div className='bug-hunt-header'>
        <p className='selected-lines'>
          <b>Selected Lines: </b> {selectedLines.join(', ')}
        </p>
        <button
          className='btn-submit'
          onClick={() => {
            handleSubmit();
          }}>
          Submit Answer
        </button>
      </div>

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
