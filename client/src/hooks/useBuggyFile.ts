import { useCallback, useEffect, useState } from 'react';
import { SafeBuggyFile } from '../types/types';
import { getBuggyFile } from '../services/bugHuntService';

const useBuggyFile = (buggyFileId?: string) => {
  const [buggyFile, setBuggyFile] = useState<SafeBuggyFile | null>(null);

  const loadBuggyFile = useCallback(
    async (id: string) => {
      try {
        const file = await getBuggyFile(id);
        setBuggyFile(file);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error retrieving buggy file: ${error}`);
      }
    },
    [setBuggyFile],
  );

  // Load buggy file from ID in game state
  useEffect(() => {
    if (buggyFileId) {
      loadBuggyFile(buggyFileId);
    }
  }, [buggyFileId, loadBuggyFile]);

  return {
    buggyFile,
  };
};

export default useBuggyFile;
