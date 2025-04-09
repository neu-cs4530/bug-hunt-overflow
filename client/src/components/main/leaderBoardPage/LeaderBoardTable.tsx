import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useConsecutiveDailyGames from '../../../hooks/useConsecutiveDailyGames';
import './LeaderBoardTable.css';
import { BugHuntScore } from '../../../types/types';
import { formatDuration } from '../../../lib/date';

interface LeaderBoardItem {
  player: string;
  timeMilliseconds: number;
  accuracy: number;
}

interface LeaderBoardTableProps {
  scores: BugHuntScore[];
  isLoading?: boolean;
  error?: string | null;
  selectedDate?: string;
}

const formatPlayerScoreAccuracy = (accuracy: number) => {
  if (accuracy < 1) {
    accuracy *= 100;
  }

  return `${accuracy.toFixed(1)}%`;
};

const LeaderBoardRow = ({
  item,
  selectedDate,
}: {
  item: LeaderBoardItem;
  selectedDate?: string;
}) => {
  const { streak } = useConsecutiveDailyGames(item.player, selectedDate);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/user/${item.player}`);
  };

  return (
    <tr>
      <td>
        {item.player}
        <button onClick={handleViewProfile} className='view-profile-button'>
          View Profile
        </button>
      </td>
      <td>{formatDuration(item.timeMilliseconds)}</td>
      <td>{formatPlayerScoreAccuracy(item.accuracy)}</td>
      {selectedDate ? <td>{streak && streak >= 3 ? `${streak} 🔥` : streak || '-'}</td> : <></>}
    </tr>
  );
};

const LeaderBoardTable = (props: LeaderBoardTableProps) => {
  const { scores, isLoading, error, selectedDate } = props;

  const [sortRanking, setSortRanking] = useState(true);

  const handleSortRanking = () => {
    setSortRanking(prevSortRanking => !prevSortRanking);
  };

  const sortedScores = scores.sort((a, b) => {
    if (sortRanking) {
      return a.timeMilliseconds - b.timeMilliseconds; // Ascending order
    }
    return b.timeMilliseconds - a.timeMilliseconds; // Descending order
  });

  if (isLoading) {
    return <div className='loading'>Loading leaderboard...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <table className='leaderboard-table'>
      <thead>
        <tr>
          <th>Player</th>
          <th>
            Time
            <button onClick={handleSortRanking} className='sort-button'>
              {sortRanking ? '↑' : '↓'}
            </button>
          </th>
          <th>Accuracy (%)</th>
          {selectedDate ? <th>Streak</th> : <></>}
        </tr>
      </thead>
      <tbody>
        {sortedScores.length > 0 ? (
          scores.map((item, index) => (
            <LeaderBoardRow key={index} item={item} selectedDate={selectedDate} />
          ))
        ) : (
          <tr>
            <td colSpan={4} className='no-data'>
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default LeaderBoardTable;
