"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      // Only check auth status if not already authenticated
      if (!isAuthenticated) {
        const token = localStorage.getItem("token");
        if (token) {
          // Token exists, validate it
          await dispatch(checkAuthStatus());
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  // Show loading spinner while checking authentication
  // if (!isInitialized || isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
  //         <p className="text-gray-600">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
