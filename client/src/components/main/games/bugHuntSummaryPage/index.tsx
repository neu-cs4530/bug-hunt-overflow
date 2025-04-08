import './index.css';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import duration from 'dayjs/plugin/duration';
import { useMemo } from 'react';
import useBugHuntSummaryPage from '../../../../hooks/useBugHuntSummaryPage';
import { BugHuntGameState, GameInstance } from '../../../../types/types';

dayjs.extend(duration);
dayjs.extend(localizedFormat);

interface BugHuntSummaryPageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

const formatPlayerScoreDuration = (timeMilliseconds: number) => {
  const dur = dayjs.duration(timeMilliseconds);
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  let durationStr = '';

  if (hours) {
    durationStr += `${hours}h `;
  }

  if (minutes) {
    durationStr += `${minutes}m `;
  }

  durationStr += `${seconds}s`;
  return durationStr;
};

const formatPlayerScoreAccuracy = (accuracy: number) => {
  if (accuracy < 1) {
    accuracy *= 100;
  }

  return accuracy.toFixed(1);
};

const BugHuntSummaryPage = (props: BugHuntSummaryPageProps) => {
  const { gameInstance } = props;
  const { playerScore, playerMoves } = useBugHuntSummaryPage(gameInstance);

  const hintsUsed = useMemo(() => {
    if (playerMoves.length === 0) {
      return undefined;
    }
    return playerMoves.filter(move => move.move.isHint).length;
  }, [playerMoves]);

  return (
    <div className='game-summary'>
      <div className='game-summary-header'>
        <h2 className='game-summary-title'>Bug Hunt Game Summary</h2>
        <p className='game-summary-date'>
          Played on {dayjs(gameInstance.state.createdAt).format('LL')}
        </p>
      </div>
      {playerScore && (
        <>
          <h3>My Performance</h3>
          <div className='game-summary-scores-container'>
            <div className='game-summary-score-card'>
              <p className='game-summary-score-label'>Completed in</p>
              <p className='game-summary-score'>
                {formatPlayerScoreDuration(playerScore.timeMilliseconds)}
              </p>
            </div>
            <div className='game-summary-score-card'>
              <p className='game-summary-score-label'>Bugs Found</p>
            </div>
            <div className='game-summary-score-card'>
              <p className='game-summary-score-label'>Hints Used</p>
              <p className='game-summary-score'>{hintsUsed}</p>
            </div>
            <div className='game-summary-score-card'>
              <p className='game-summary-score-label'>Accuracy</p>
              <p className='game-summary-score'>
                {formatPlayerScoreAccuracy(playerScore.accuracy)}%
              </p>
            </div>
          </div>
        </>
      )}
      <h3>Leaderboard</h3>
    </div>
  );
};

export default BugHuntSummaryPage;
