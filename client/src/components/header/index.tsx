import React from 'react';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import logo from '../../assets/buglogo.png';

const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleSignOut } = useHeader();
  const { user: currentUser } = useUserContext();
  const navigate = useNavigate();

  return (
    <div className='header'>
      <div className='header-left'>
        <img src={logo} alt='Stack Overflow Logo' className='header-logo' />
        <div className='title-row'>
          <h1 className='title'>Bug Overflow</h1>
          <span className='subtitle'>Ask. Debug. Solve.</span>
        </div>
      </div>

      <div className='header-center'>
        <input
          id='searchBar'
          placeholder='Search for questions...'
          type='text'
          value={val}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='search-bar'
        />
      </div>

      <div className='header-right'>
        <button onClick={handleSignOut} className='logout-button'>
          Log out
        </button>
        <button className='view-button' onClick={() => navigate(`/user/${currentUser.username}`)}>
          View Profile
        </button>
      </div>
    </div>
  );
};

export default Header;
