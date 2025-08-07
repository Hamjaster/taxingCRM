"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle, Phone } from "lucide-react";
import {
  setupRecaptcha,
  sendOTPWithFirebase,
  verifyOTPWithFirebase,
  clearConfirmationResult,
} from "@/lib/firebase-auth";
import type { RecaptchaVerifier } from "firebase/auth";
import OTPForm from "./OtpForm";

interface LoginFormProps {
  userType: "admin" | "client";
}

export default function LoginForm({ userType }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [userId, setUserId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const verifier = setupRecaptcha("recaptcha-container-login");
      setRecaptchaVerifier(verifier);
    }

    return () => {
      clearConfirmationResult();
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setError("");

    //for testing
    if (userType === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/client/dashboard");
    }

    // try {
    //   const response = await fetch("/api/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();
    //   if (!response.ok) {
    //     if (data.needsVerification && data.userId && data.phoneNumber) {
    //       setUserId(data.userId);
    //       setPhoneNumber(data.phoneNumber);

    //       if (recaptchaVerifier) {
    //         const result = await sendOTPWithFirebase(
    //           data.phoneNumber,
    //           recaptchaVerifier
    //         );
    //         if (result.success) {
    //           setShowOTP(true);
    //           setError("");
    //         } else {
    //           throw new Error(result.error || "Failed to send OTP");
    //         }
    //       } else {
    //         throw new Error("reCAPTCHA not initialized");
    //       }
    //     } else {
    //       throw new Error(data.error || "Login failed");
    //     }
    //   } else {
    //     if (data.user.role === "admin") {
    //       router.push("/admin/dashboard");
    //     } else {
    //       router.push("/client/dashboard");
    //     }
    //   }
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : "An error occurred");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleOTPVerification = async (otpCode: string) => {
    setIsLoading(true);
    setError("");

    try {
      const firebaseResult = await verifyOTPWithFirebase(otpCode);
      if (!firebaseResult.success) {
        throw new Error(firebaseResult.error || "Firebase verification failed");
      }

      const response = await fetch("/api/auth/complete-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          firebaseUid: firebaseResult.firebaseUser?.uid,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification completion failed");
      }

      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOTP) {
    return (
      <OTPForm
        phoneNumber={phoneNumber}
        onVerify={handleOTPVerification}
        onResend={() => {
          if (recaptchaVerifier) {
            sendOTPWithFirebase(phoneNumber, recaptchaVerifier);
          }
        }}
        isLoading={isLoading}
        error={error}
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
            className="w-full h-12 font-medium "
          >
            Sign In
          </Button>

          <div id="recaptcha-container-login" className="hidden"></div>
        </form>
      </CardContent>
    </Card>
  );
}
