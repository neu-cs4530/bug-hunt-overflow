import { useState } from 'react';
import './index.css';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Sidebar Navigation component for navigating between different sections.
 */
const SideBarNav = () => {
  const [showOptionsMessaging, setShowOptionsMessaging] = useState(false);
  const [showOptionsGames, setShowOptionsGames] = useState(false);
  const location = useLocation();

  const toggleOptionsMessaging = () => {
    setShowOptionsMessaging(!showOptionsMessaging);
  };

  const toggleOptionsGames = () => {
    setShowOptionsGames(!showOptionsGames);
  };

  const isActiveOption = (path: string) =>
    location.pathname === path ? 'message-option-selected' : '';

  return (
    <div className='sideBarNav'>
      <NavLink
        to='/'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Questions
      </NavLink>

      <NavLink
        to='/tags'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Tags
      </NavLink>

      <button className='menu_button' onClick={toggleOptionsMessaging}>
        Messaging
      </button>

      {showOptionsMessaging && (
        <div className='additional-options'>
          <NavLink
            to='/messaging'
            className={`menu_button message-options ${isActiveOption('/messaging')}`}>
            Global Messages
          </NavLink>
          <NavLink
            to='/messaging/direct-message'
            className={`menu_button message-options ${isActiveOption('/messaging/direct-message')}`}>
            Direct Messages
          </NavLink>
        </div>
      )}

      <button className='menu_button' onClick={toggleOptionsGames}>
        Games
      </button>

      {showOptionsGames && (
        <div className='additional-options'>
          <NavLink
            to='/games'
            className={`menu_button message-options ${isActiveOption('/games')}`}>
            Community Games
          </NavLink>
          <NavLink
            to='/dailyGames'
            className={`menu_button message-options ${isActiveOption('/dailyGames')}`}>
            Daily Games
          </NavLink>
        </div>
      )}

      <NavLink
        to='/users'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Users
      </NavLink>

      <NavLink
        to='/leaderboard'
        id='menu_leaderboard'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Leaderboard
      </NavLink>
    </div>
  );
};

export default SideBarNav;
