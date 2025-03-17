import { SafeDatabaseUser } from '@fake-stack-overflow/shared';
import { useEffect, useState } from 'react';

const USER_CACHE_KEY = 'loggedInUser';

/**
 * Provides the cached user and interactions for setting/clearing the cache.
 *
 * @returns - the user state from the cache. If there is no cached user, then user is null.
 */
const useUserCache = () => {
  const [user, setUser] = useState<SafeDatabaseUser | null>(null);

  /**
   * Clears the user from cache.
   */
  const clearUserCache = () => {
    localStorage.removeItem(USER_CACHE_KEY);
  };

  useEffect(() => {
    try {
      const stringUser = localStorage.getItem(USER_CACHE_KEY);
      if (!stringUser) {
        return;
      }
      const loggedInUser = JSON.parse(stringUser) as SafeDatabaseUser;
      setUser(loggedInUser);
    } catch (err) {
      clearUserCache();
    }
  }, []);

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
