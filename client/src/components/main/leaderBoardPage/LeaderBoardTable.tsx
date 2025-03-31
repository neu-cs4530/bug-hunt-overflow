import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLeaderBoard from '../../../hooks/useLeaderBoard';
import useConsecutiveDailyGames from '../../../hooks/useConsecutiveDailyGames';
import './LeaderBoardTable.css';

interface LeaderBoardItem {
  player: string;
  timeMilliseconds: number;
  accuracy: number;
}

const LeaderBoardRow = ({
  item,
  selectedDate,
}: {
  item: LeaderBoardItem;
  selectedDate: string;
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
      <td>{item.timeMilliseconds}</td>
      <td>{item.accuracy}</td>
      <td>{streak && streak >= 3 ? `${streak} 🔥` : streak || '-'}</td>
    </tr>
  );
};

const LeaderBoardTable = () => {
  const today = new Date().toISOString().split('T')[0];
  const [sortRanking, setSortRanking] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const { data, loading, error } = useLeaderBoard(selectedDate);

  const handleSortRanking = () => {
    setSortRanking(prevSortRanking => !prevSortRanking);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const filteredData = data
    ? data.filter(item => item.player.toLowerCase().includes(searchQuery))
    : [];

  const sortedData = filteredData.sort((a, b) => {
    if (sortRanking) {
      return a.timeMilliseconds - b.timeMilliseconds; // Ascending order
    }
    return b.timeMilliseconds - a.timeMilliseconds; // Descending order
  });

  if (loading) {
    return <div className='loading'>Loading leaderboard...</div>;
  }

  if (error) {
    return <div className='error'>Error: {error}</div>;
  }

  return (
    <div className='leaderboard-container'>
      <div className='controls'>
        <input
          type='date'
          value={selectedDate}
          onChange={handleDateChange}
          className='date-picker'
        />
        <input
          type='text'
          placeholder='Search player...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='search-input'
        />
      </div>
      <table className='leaderboard-table'>
        <thead>
          <tr>
            <th>Player</th>
            <th>
              Time (ms)
              <button onClick={handleSortRanking} className='sort-button'>
                {sortRanking ? '↑' : '↓'}
              </button>
            </th>
            <th>Accuracy (%)</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
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
    </div>
  );
};

export default LeaderBoardTable;
