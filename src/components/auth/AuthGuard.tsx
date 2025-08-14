"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { setUser } from "@/store/slices/authSlice";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, role, isLoading } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Check if user is logged in by checking for auth token
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch(
            setUser({
              user: userData.user,
              role:
                userData.user.role ||
                (userData.user.assignedAdminId ? "client" : "admin"),
            })
          );
        } else {
          // Not authenticated, redirect to appropriate login page
          if (requiredRole) {
            router.push(`/${requiredRole}/login`);
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (requiredRole) {
          router.push(`/${requiredRole}/login`);
        } else {
          router.push("/");
        }
      }
    };

    if (!isAuthenticated && !isLoading) {
      checkAuth();
    }
  }, [isAuthenticated, isLoading, dispatch, router, requiredRole]);

  useEffect(() => {
    // Role-based access control
    if (isAuthenticated && requiredRole && role !== requiredRole) {
      // Redirect to appropriate dashboard if user has wrong role
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "client") {
        router.push("/client/dashboard");
      }
    }
  }, [isAuthenticated, role, requiredRole, router]);

  // If authenticated and role matches (or no role required), show children
  if (isAuthenticated && (!requiredRole || role === requiredRole)) {
    return <>{children}</>;
  }

  // Default loading state
  return <div></div>;
}
