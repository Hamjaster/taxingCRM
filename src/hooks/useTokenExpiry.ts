import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from './redux';
import { clearAuth } from '@/store/slices/authSlice';
import { isTokenExpired } from '@/lib/jwt-utils';

interface UseTokenExpiryOptions {
  checkInterval?: number; // milliseconds between checks
  autoLogout?: boolean; // whether to automatically logout on expiry
}

export const useTokenExpiry = (options: UseTokenExpiryOptions = {}) => {
  const {
    checkInterval = 30000, // Check every 30 seconds
    autoLogout = true,
  } = options;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkTokenExpiry = useCallback(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    const isExpired = isTokenExpired(token);

    // If token is expired, logout silently
    if (isExpired && autoLogout) {
      dispatch(clearAuth());
      router.push('/');
      return;
    }
  }, [dispatch, router, autoLogout]);

  const startTokenCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Check immediately
    checkTokenExpiry();

    // Set up interval
    intervalRef.current = setInterval(checkTokenExpiry, checkInterval);
  }, [checkTokenExpiry, checkInterval]);

  const stopTokenCheck = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start checking when component mounts
  useEffect(() => {
    startTokenCheck();

    // Cleanup on unmount
    return () => {
      stopTokenCheck();
    };
  }, [startTokenCheck, stopTokenCheck]);

  // Also check on page visibility change (when user comes back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTokenExpiry();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkTokenExpiry]);

  return {
    checkTokenExpiry,
    startTokenCheck,
    stopTokenCheck,
  };
};
