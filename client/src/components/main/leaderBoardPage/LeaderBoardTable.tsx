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
  rank,
  selectedDate,
}: {
  item: LeaderBoardItem;
  rank: number;
  selectedDate?: string;
}) => {
  const { streak } = useConsecutiveDailyGames(item.player, selectedDate);
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/user/${item.player}`);
  };

  return (
    <tr>
      <td>{rank}</td>
      <td className='player-cell'>
        <span>{item.player}</span>
        <button onClick={handleViewProfile} className='view-profile-button'>
          View Profile
        </button>
      </td>
      <td>{formatDuration(item.timeMilliseconds)}</td>
      <td>
        <span title='Correct guesses / Total guesses'>
          {formatPlayerScoreAccuracy(item.accuracy)}
        </span>
      </td>
      {selectedDate ? <td>{streak && streak >= 3 ? `${streak} 🔥` : streak || '-'}</td> : <></>}
    </tr>
  );
};

const LeaderBoardTable = (props: LeaderBoardTableProps) => {
  const { scores, isLoading, error, selectedDate } = props;

  const [sortAscending, setSortAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScores = scores
    .filter(score => score.player.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortAscending
        ? a.timeMilliseconds - b.timeMilliseconds
        : b.timeMilliseconds - a.timeMilliseconds,
    );

  if (isLoading) {
    return <div className='loading'>Loading leaderboard...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <div className='leaderboard-table-container'>
      <table className='leaderboard-table'>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>
              Time
              <button onClick={() => setSortAscending(prev => !prev)} className='sort-button'>
                {sortAscending ? '↑' : '↓'}
              </button>
            </th>
            <th>Accuracy</th>
            {selectedDate ? <th>Streak</th> : <></>}
          </tr>
        </thead>
        <tbody>
          {filteredScores.length ? (
            filteredScores.map((item, i) => (
              <LeaderBoardRow
                key={item.player}
                item={item}
                rank={i + 1}
                selectedDate={selectedDate}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5} className='no-data'>
                No players match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoardTable;
