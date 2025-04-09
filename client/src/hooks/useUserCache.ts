import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../services/userService';
import { SafeDatabaseUser } from '../types/types';

const USER_CACHE_KEY = 'loggedInUser';

/**
 * Provides the cached user and interactions for setting/clearing the cache.
 *
 * @returns - the user state from the cache. If there is no cached user, then user is null.
 */
const useUserCache = () => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);
  const navigate = useNavigate();

  /**
   * Clears the user from cache.
   */
  const clearUserCache = () => {
    localStorage.removeItem(USER_CACHE_KEY);
  };

  const validateUser = useCallback(
    async (username: string) => {
      try {
        await getUserByUsername(username);
        return true;
      } catch (error) {
        setUser(null);
        navigate('/');
        clearUserCache();
        return false;
      }
    },
    [navigate],
  );

  useEffect(() => {
    try {
      const stringUser = localStorage.getItem(USER_CACHE_KEY);
      if (!stringUser) {
        return;
      }
      const loggedInUser = JSON.parse(stringUser) as SafeDatabaseUser;

      validateUser(loggedInUser.username).then(isValid => {
        if (isValid) {
          setUser(loggedInUser);
        }
      });
    } catch (err) {
      clearUserCache();
    }
  }, [navigate, validateUser]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    }
  }, [user]);

  return {
    user,
    setUser,
    clearUserCache,
  };
};

export default useUserCache;
