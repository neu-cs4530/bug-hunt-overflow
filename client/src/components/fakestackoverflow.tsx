import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout';
import Login from './auth/login';
import { FakeSOSocket, SafeDatabaseUser } from '../types/types';
import LoginContext from '../contexts/LoginContext';
import UserContext from '../contexts/UserContext';
import QuestionPage from './main/questionPage';
import TagPage from './main/tagPage';
import NewQuestionPage from './main/newQuestion';
import NewAnswerPage from './main/newAnswer';
import AnswerPage from './main/answerPage';
import MessagingPage from './main/messagingPage';
import DirectMessage from './main/directMessage';
import Signup from './auth/signup';
import UsersListPage from './main/usersListPage';
import ProfileSettings from './profileSettings';
import AllGamesPage from './main/games/allGamesPage';
import GamePage from './main/games/gamePage';
import LeaderBoardPage from './main/leaderBoardPage';
import useUserCache from '../hooks/useUserCache';
import DailyGames from './main/dailyGames';
import GameSummaryPage from './main/games/gameSummaryPage';

const ProtectedRoute = ({
  user,
  socket,
  children,
}: {
  user: SafeDatabaseUser | null;
  socket: FakeSOSocket | null;
  children: JSX.Element;
}) => {
  if (!user || !socket) {
    return <Navigate to='/' />;
  }

  return <UserContext.Provider value={{ user, socket }}>{children}</UserContext.Provider>;
};

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = ({ socket }: { socket: FakeSOSocket | null }) => {
  const { user, setUser } = useUserCache();

  return (
    <LoginContext.Provider value={{ setUser }}>
      <Routes>
        {!user ? (
          <>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </>
        ) : (
          <>
            <Route
              element={
                <ProtectedRoute user={user} socket={socket}>
                  <Layout />
                </ProtectedRoute>
              }>
              <Route path='/' element={<QuestionPage />} />
              <Route path='tags' element={<TagPage />} />
              <Route path='/messaging' element={<MessagingPage />} />
              <Route path='/messaging/direct-message' element={<DirectMessage />} />
              <Route path='/question/:qid' element={<AnswerPage />} />
              <Route path='/new/question' element={<NewQuestionPage />} />
              <Route path='/new/answer/:qid' element={<NewAnswerPage />} />
              <Route path='/users' element={<UsersListPage />} />
              <Route path='/user/:username' element={<ProfileSettings />} />
              <Route path='/games' element={<AllGamesPage />} />
              <Route path='/games/:gameID' element={<GamePage />} />
              <Route path='/games/:gameID/summary' element={<GameSummaryPage />} />
              <Route path='/leaderboard' element={<LeaderBoardPage />} />
              <Route path='/dailyGames' element={<DailyGames />} />
              <Route path='/dailyGames/:gameID' element={<GamePage />} />
            </Route>
          </>
        )}
      </Routes>
    </LoginContext.Provider>
  );
};

export default FakeStackOverflow;
