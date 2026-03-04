import { useEffect, useRef, useCallback } from 'react';
import { useAppStore } from './store';

const POLL_INTERVAL = 30000; // 30 seconds

export const useRealtimeFeed = () => {
  const { addRealtimeTweet, pendingTweetsCount } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      addRealtimeTweet();
    }, POLL_INTERVAL);
  }, [addRealtimeTweet]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    startPolling();
    return stopPolling;
  }, [startPolling, stopPolling]);

  return { pendingTweetsCount };
};
