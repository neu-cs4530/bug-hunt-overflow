import { useState } from 'react';
import './index.css';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  TagIcon,
  TrophyIcon,
  UsersIcon,
} from '../../icons';

/**
 * Sidebar Navigation component for navigating between different sections.
 */
const SideBarNav = () => {
  const [showOptionsMessaging, setShowOptionsMessaging] = useState(false);
  const [showOptionsGames, setShowOptionsGames] = useState(false);
  const location = useLocation();

  const toggleOptionsMessaging = () => {
    setShowOptionsMessaging(prev => {
      if (!prev) setShowOptionsGames(false); // close Games if opening Messaging
      return !prev;
    });
  };

  const toggleOptionsGames = () => {
    setShowOptionsGames(prev => {
      if (!prev) setShowOptionsMessaging(false); // close Messaging if opening Games
      return !prev;
    });
  };

  const isActiveOption = (path: string) =>
    location.pathname === path ? 'message-option-selected' : '';

  return (
    <div className='sideBarNav'>
      <NavLink
        to='/'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <QuestionMarkCircleIcon className='menu-button-icon' />
        Questions
      </NavLink>

      <NavLink
        to='/tags'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <TagIcon className='menu-button-icon' />
        Tags
      </NavLink>

      <button
        className={`menu_button dropdown-menu-button ${showOptionsMessaging ? 'dropown-active' : ''}`}
        onClick={toggleOptionsMessaging}>
        <ChatBubbleLeftIcon className='menu-button-icon' />
        <span>Messaging</span>
        <ChevronDownIcon className='dropdown-menu-icon' />
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

      <button
        className={`menu_button dropdown-menu-button ${showOptionsGames ? 'dropown-active' : ''}`}
        onClick={toggleOptionsGames}>
        <PuzzlePieceIcon className='menu-button-icon' />
        <span>Games</span>
        <ChevronDownIcon className='dropdown-menu-icon' />
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
        <UsersIcon className='menu-button-icon' />
        Users
      </NavLink>

      <NavLink
        to='/leaderboard'
        id='menu_leaderboard'
        className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
        <TrophyIcon className='menu-button-icon' />
        Leaderboard
      </NavLink>
    </div>
  );
};

export default SideBarNav;
