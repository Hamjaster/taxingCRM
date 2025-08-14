"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle } from "lucide-react";
import OTPForm from "./OtpForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  loginUser,
  clearError,
  setUser,
  sendOTP,
  verifyOTP,
} from "@/store/slices/authSlice";

interface LoginFormProps {
  userType: "admin" | "client";
}

export default function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user, role } = useAppSelector(
    (state: any) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated && user && role) {
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    }
  }, [isAuthenticated, user, role, router]);

  useEffect(() => {
    // Clear error when component mounts or user type changes
    dispatch(clearError());
  }, [dispatch, userType]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    try {
      const result = await dispatch(
        loginUser({ email, password, userType }) as any
      );

      if (loginUser.fulfilled.match(result)) {
        // Check if OTP is required (for client login)
        if (result.payload.requiresOTP) {
          setOtpEmail(email);
          setRemainingTime(result.payload.remainingTime || 10);
          setShowOTP(true);
        }
        // For admin login, user will be redirected via useEffect
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleOTPVerification = async (otpCode: string) => {
    try {
      const result = await dispatch(
        verifyOTP({ email: otpEmail, otp: otpCode }) as any
      );

      if (verifyOTP.fulfilled.match(result)) {
        // Success - user will be redirected via useEffect
        console.log("OTP verification successful");
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
    }
  };

  const handleResendOTP = async () => {
    try {
      const result = await dispatch(sendOTP(otpEmail) as any);

      if (sendOTP.fulfilled.match(result)) {
        setRemainingTime(result.payload.expiryMinutes || 10);
        dispatch(clearError());
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
    }
  };

  if (showOTP) {
    return (
      <OTPForm
        email={otpEmail}
        onVerify={handleOTPVerification}
        onResend={handleResendOTP}
        isLoading={isLoading}
        error={error || ""}
        remainingTime={remainingTime}
      />
    );
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            isLoading={isLoading}
            className="w-full h-12 font-medium"
          >
            {userType === "client" ? "Sign In & Send Code" : "Sign In"}
          </Button>

          {userType === "client" && (
            <p className="text-xs text-gray-500 text-center">
              For security, clients will receive a verification code via email
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
