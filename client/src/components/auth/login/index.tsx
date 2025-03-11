import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import logo from '../../../assets/logo.png';

/**
 * Renders a login form similar to Stack Overflow's login page.
 */
const Login = () => {
  const {
    username,
    password,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
  } = useAuth('login');

  return (
    <div className='login-container'>
      <div className='login-card'>
        <div className='login-header'>
          <img src={logo} alt='Stack Overflow Logo' className='login-logo' />
          <h2>Log in</h2>
        </div>
        {err && <p className='error-message'>{err}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor='username-input' className='input-label'>
            Username
          </label>
          <input
            type='text'
            value={username}
            onChange={event => handleInputChange(event, 'username')}
            placeholder='Enter your username'
            required
            className='input-text'
            id='username-input'
          />

          <label htmlFor='password-input' className='input-label'>
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={event => handleInputChange(event, 'password')}
            placeholder='Enter your password'
            required
            className='input-text'
            id='password-input'
          />

          <div className='show-password'>
            <input
              type='checkbox'
              id='showPasswordToggle'
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label htmlFor='showPasswordToggle'>Show Password</label>
          </div>

          <button type='submit' className='login-button'>
            Log in
          </button>
        </form>

        <div className='signup-redirect'>
          Don&apos;t have an account? <Link to='/signup'>Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
