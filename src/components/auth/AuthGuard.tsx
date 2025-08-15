"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, role, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check authentication status using Redux thunk
    if (!isAuthenticated && !isLoading) {
      console.log("Checking auth status...");
      dispatch(checkAuthStatus());
    }
  }, [isAuthenticated, isLoading, dispatch]);

  useEffect(() => {
    // Handle authentication success - redirect to appropriate portal
    if (isAuthenticated && role) {
      console.log(`User authenticated as ${role}, redirecting...`);
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "client") {
        router.push("/client/dashboard");
      }
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    // Handle authentication failure - redirect to login
    if (error && !isAuthenticated && !isLoading) {
      console.log("Authentication failed, redirecting to login...");
      router.push("/client/login");
    }
  }, [error, isAuthenticated, isLoading, router]);

  // If authenticated and role matches (or no role required), show children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Default loading state for unauthenticated users (while redirect is happening)
  return <div></div>;
}
