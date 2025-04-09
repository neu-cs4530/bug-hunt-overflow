import { useState } from 'react';
import './LeaderBoardTable.css';
import LeaderBoardTable from './LeaderBoardTable';
import useLeaderBoard from '../../../hooks/useLeaderBoard';

const DailyLeaderBoardTable = () => {
  const today = new Date().toISOString().split('T')[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(today);
  const { data, loading, error } = useLeaderBoard(selectedDate);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const filteredData = data
    ? data.filter(item => item.player.toLowerCase().includes(searchQuery))
    : [];

  return (
    <div className='leaderboard-container'>
      <h2 className='leaderboard-heading'>📊 Leaderboard</h2>
      <p className='leaderboard-subheading'>
        Play daily games and see how you rank against others!
      </p>
      <div className='leaderboard-container'>
        <div className='leaderboard-controls'>
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
        <LeaderBoardTable
          scores={filteredData}
          isLoading={loading}
          error={error}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default DailyLeaderBoardTable;
