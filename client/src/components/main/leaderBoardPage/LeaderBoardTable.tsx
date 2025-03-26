import React, { useState } from 'react';
import './LeaderBoardTable.css';

const LeaderBoardTable = () => {
  const [sortRanking, setSortRanking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const data = [
    { name: 'John Doe', score: 1500, ranking: 1 },
    { name: 'Jane Smith', score: 1400, ranking: 2 },
    { name: 'Mike Johnson', score: 1300, ranking: 3 },
  ];

  const handleSortRanking = () => {
    setSortRanking(!sortRanking);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const sortedData = [...data]
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortRanking) return b.ranking - a.ranking;
      return 0;
    });

  return (
    <div>
      <div className='search-container'>
        <input
          type='text'
          placeholder='Search by name...'
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className='leaderboard-table'>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>
                Ranking
                <button onClick={handleSortRanking} className='sort-button'>
                  {sortRanking ? '↓' : '↑'}
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.score}</td>
                <td>{item.ranking}</td>
                <td>
                  <button>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoardTable;
