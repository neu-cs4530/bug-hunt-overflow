import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hooks to retrieve the query parameters from current URL.
 * @returns the query params as a URLSearchParams object.
 */
const useQuery = () => {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
};

export default useQuery;
