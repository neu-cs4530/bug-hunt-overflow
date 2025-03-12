import React from 'react';
import './LeaderBoardTable.css';

const LeaderBoardTable = () => (
  <div className='leaderboard-table'>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Ranking</th>
        </tr>
      </thead>
      <tbody>
        {/* Sample data for now */}
        <tr>
          <td>John Doe</td>
          <td>1500</td>
          <td>1</td>
          <td>
            <button>View</button>
          </td>
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>1400</td>
          <td>2</td>
          <td>
            <button>View</button>
          </td>
        </tr>
        <tr>
          <td>Mike Johnson</td>
          <td>1300</td>
          <td>3</td>
          <td>
            <button>View</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default LeaderBoardTable;
