import { useState } from 'react';
import './index.css';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Sidebar Navigation component for navigating between different sections.
 */
const SideBarNav = () => {
  const [showOptions, setShowOptions] = useState(false);
  const location = useLocation();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
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

      <button className='menu_button' onClick={toggleOptions}>
        Messaging
      </button>

      {showOptions && (
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

      <NavLink
        to='/users'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Users
      </NavLink>

      <NavLink
        to='/games'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Games
      </NavLink>
      <NavLink
        to='/leaderboard'
        id='menu_leaderboard'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Leaderboard
      </NavLink>

      <NavLink
        to='/dailyGames'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        Daily Games
      </NavLink>
    </div>
  );
};

export default SideBarNav;
