import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DailyGamesBarChartProps {
  games: { date: string; accuracy: number; timeMilliseconds: number }[];
}

const DailyGamesBarChart: React.FC<DailyGamesBarChartProps> = ({ games }) => {
  // Data for Accuracy Chart
  const accuracyData = {
    labels: games.map(game => game.date),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: games.map(game => game.accuracy),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for Time Chart
  const timeData = {
    labels: games.map(game => game.date),
    datasets: [
      {
        label: 'Time (ms)',
        data: games.map(game => game.timeMilliseconds),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      {/* Accuracy Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>Accuracy (%)</h3>
        <Bar
          data={accuracyData}
          options={{
            ...options,
            plugins: { ...options.plugins, title: { text: 'Accuracy Over Time', display: true } },
          }}
        />
      </div>

      {/* Time Chart */}
      <div>
        <h3>Time (ms)</h3>
        <Bar
          data={timeData}
          options={{
            ...options,
            plugins: { ...options.plugins, title: { text: 'Time Over Time', display: true } },
          }}
        />
      </div>
    </div>
  );
};

export default DailyGamesBarChart;
