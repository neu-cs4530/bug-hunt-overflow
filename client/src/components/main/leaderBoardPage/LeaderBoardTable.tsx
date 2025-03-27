import React, { useState } from 'react';
import useLeaderBoard from '../../../hooks/useLeaderBoard';
import './LeaderBoardTable.css';

const LeaderBoardTable = () => {
  const [sortRanking, setSortRanking] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error } = useLeaderBoard('2025-03-25');

  const handleSortRanking = () => {
    setSortRanking(!sortRanking);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredData = data
    ? data.filter(item => item.player.toLowerCase().includes(searchQuery))
    : [];

  const sortedData = filteredData.sort((a, b) => {
    if (sortRanking) {
      return a.timeMilliseconds - b.timeMilliseconds; // Sort by time in ascending order
    }
    return 0;
  });

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='leaderboard-table'>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by player name...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='search-input'
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Time (ms)</th>
            <th>Accuracy (%)</th>
            <th>
              <button onClick={handleSortRanking} className='sort-button'>
                Sort by Time {sortRanking ? '↑' : '↓'}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr key={index}>
                <td>{item.player}</td>
                <td>{item.timeMilliseconds}</td>
                <td>{item.accuracy}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
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
