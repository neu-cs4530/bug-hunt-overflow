import { useState } from 'react';
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
