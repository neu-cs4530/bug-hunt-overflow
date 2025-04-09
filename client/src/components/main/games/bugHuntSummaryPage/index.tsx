import './index.css';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import useBugHuntSummaryPage from '../../../../hooks/useBugHuntSummaryPage';
import { BugHuntGameState, GameInstance } from '../../../../types/types';
import { BugIcon } from '../../../icons';
import LeaderBoardTable from '../../leaderBoardPage/LeaderBoardTable';
import { formatDuration } from '../../../../lib/date';

interface GameResultBannerProps {
  bugsFound: number;
  totalBugs: number;
}

interface BugHuntSummaryPageProps {
  gameInstance: GameInstance<BugHuntGameState>;
}

interface GameSummaryScoreCardProps {
  label: string;
  score: string | number | undefined;
}

const formatPlayerScoreAccuracy = (accuracy: number) => {
  if (accuracy < 1) {
    accuracy *= 100;
  }

  return `${accuracy.toFixed(1)}%`;
};

const GameResultBanner = (props: GameResultBannerProps) => {
  const { bugsFound, totalBugs } = props;
  const isSuccess = bugsFound === totalBugs;

  const message = isSuccess
    ? `Inspector Insect strikes again! ${bugsFound}/${totalBugs} bugs found.`
    : `${bugsFound}/${totalBugs} bugs found—watch out, some still crawled away!`;

  return (
    <div className={`game-result-banner ${isSuccess ? 'success' : ''}`}>
      <BugIcon className='game-result-icon ' />
      <span>{message}</span>
    </div>
  );
};

const GameSummaryScoreCard = (props: GameSummaryScoreCardProps) => {
  const { label, score } = props;
  return (
    <div className='game-summary-score-card'>
      <p className='game-summary-score-label'>{label}</p>
      <p className='game-summary-score'>{score}</p>
    </div>
  );
};

const BugHuntSummaryPage = (props: BugHuntSummaryPageProps) => {
  const { gameInstance } = props;
  const { playerScore, playerMoves, bugsFound, totalBugs } = useBugHuntSummaryPage(gameInstance);

  const hintsUsed = useMemo(() => {
    if (playerMoves.length === 0) {
      return undefined;
    }
    return playerMoves.filter(move => move.move.isHint).length;
  }, [playerMoves]);

  console.log(gameInstance.state);

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
          <GameResultBanner bugsFound={bugsFound} totalBugs={totalBugs} />
          <div className='game-summary-scores-container'>
            <GameSummaryScoreCard
              label='Completed in'
              score={formatDuration(playerScore.timeMilliseconds)}
            />
            <GameSummaryScoreCard label='Hints Used' score={hintsUsed} />
            <GameSummaryScoreCard
              label='Accuracy'
              score={formatPlayerScoreAccuracy(playerScore.accuracy)}
            />
          </div>
        </>
      )}
      <h3>Leaderboard</h3>
      <LeaderBoardTable scores={[...gameInstance.state.scores]} />
    </div>
  );
};

export default BugHuntSummaryPage;
