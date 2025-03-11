import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import logo from '../../../assets/logo.png';

/**
 * Renders a signup form similar to Stack Overflow's signup page.
 */
const Signup = () => {
  const {
    username,
    password,
    passwordConfirmation,
    showPassword,
    err,
    handleSubmit,
    handleInputChange,
    togglePasswordVisibility,
  } = useAuth('signup');

  return (
    <div className='signup-container'>
      <div className='signup-card'>
        <div className='signup-header'>
          <img src={logo} alt='Stack Overflow Logo' className='signup-logo' />
          <h2>Sign Up</h2>
        </div>
        {err && <p className='error-message'>{err}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor='username-input' className='input-label'>
            Username
          </label>
          <input
            type='text'
            value={username}
            onChange={e => handleInputChange(e, 'username')}
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
            onChange={e => handleInputChange(e, 'password')}
            placeholder='Enter your password'
            required
            className='input-text'
            id='password-input'
          />

          <label htmlFor='confirm-password-input' className='input-label'>
            Confirm Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={e => handleInputChange(e, 'confirmPassword')}
            placeholder='Confirm your password'
            required
            className='input-text'
            id='confirm-password-input'
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

          <button type='submit' className='signup-button'>
            Sign up
          </button>
        </form>

        <div className='login-redirect'>
          Already have an account? <Link to='/'>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
