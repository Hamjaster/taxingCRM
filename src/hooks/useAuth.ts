import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from './redux';
import { logoutUser, clearAuth } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);

  const logout = async () => {
    try {
      // Try to logout from server
      await dispatch(logoutUser());
    } catch (error) {
      // Even if server logout fails, clear local state
      console.error('Logout error:', error);
    } finally {
      // Always clear local auth state and redirect
      dispatch(clearAuth());
      router.push('/');
    }
  };

  const isAdmin = authState.role === 'admin';
  const isClient = authState.role === 'client';

  return {
    ...authState,
    logout,
    isAdmin,
    isClient,
  };
};
