// Leaderboard.tsx
import {
    Avatar, 
    Box, 
    Button,
    ButtonGroup,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface LeaderboardEntry {
  username: string;
  avatarUrl?: string;
  totalAnswers: number;
}

const Leaderboard = () => {
  const leaderboardData: LeaderboardEntry[] = [
    { username: 'Alice', avatarUrl: '', totalAnswers: 42 },
    { username: 'Bob', avatarUrl: '', totalAnswers: 35 },
    { username: 'Charlie', avatarUrl: '', totalAnswers: 28 },
  ];
  const [activeRange, setActiveRange] = useState<'week' | 'month' | 'allTime' | 'custom'>(
    'allTime',
  );

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5, px: 2 }}>
      <Typography
        variant='h5'
        gutterBottom
        sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        📊 Leaderboard
      </Typography>
      <Typography variant='body1' gutterBottom sx={{ color: 'gray', mb: 2 }}>
        Answer questions to rise to the top of the Threadscape Leaderboard!
      </Typography>

      <ButtonGroup variant='contained' sx={{ mb: 2 }}>
        {['Week', 'Month', 'All Time', 'Custom Date'].map((label, index) => {
          const key = label.toLowerCase().replace(' ', '') as typeof activeRange;
          return (
            <Button
              key={label}
              onClick={() => setActiveRange(key)}
              sx={{
                'backgroundColor': activeRange === key ? 'success.main' : 'grey.200',
                'color': activeRange === key ? 'white' : 'black',
                '&:hover': { backgroundColor: activeRange === key ? 'success.dark' : 'grey.300' },
              }}>
              {label}
            </Button>
          );
        })}
      </ButtonGroup>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Ranking</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Total Answers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box display='flex' alignItems='center' gap={1}>
                    <Avatar src={entry.avatarUrl} alt={entry.username} />
                    {entry.username}
                  </Box>
                </TableCell>
                <TableCell align='right'>{entry.totalAnswers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard;
