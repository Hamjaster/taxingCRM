"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertCircle, Phone } from "lucide-react";
import {
  setupRecaptcha,
  sendOTPWithFirebase,
  verifyOTPWithFirebase,
  clearConfirmationResult,
} from "@/lib/firebase-auth";
import type { RecaptchaVerifier } from "firebase/auth";

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

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.needsVerification && data.userId && data.phoneNumber) {
          setUserId(data.userId);
          setPhoneNumber(data.phoneNumber);

          if (recaptchaVerifier) {
            const result = await sendOTPWithFirebase(
              data.phoneNumber,
              recaptchaVerifier
            );
            if (result.success) {
              setShowOTP(true);
              setError("");
            } else {
              throw new Error(result.error || "Failed to send OTP");
            }
          } else {
            throw new Error("reCAPTCHA not initialized");
          }
        } else {
          throw new Error(data.error || "Login failed");
        }
      } else {
        if (data.user.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/client/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
                className="h-12 pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
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
                className="h-12 pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Sign In
          </Button>

          <div id="recaptcha-container-login" className="hidden"></div>
        </form>
      </CardContent>
    </Card>
  );
}

interface OTPFormProps {
  phoneNumber: string;
  onVerify: (otpCode: string) => void;
  onResend: () => void;
  isLoading: boolean;
  error: string;
}

function OTPForm({
  phoneNumber,
  onVerify,
  onResend,
  isLoading,
  error,
}: OTPFormProps) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otpCode);
  };

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Phone Verification
          </h3>
          <p className="text-gray-600">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-purple-600">{phoneNumber}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Verification Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
              disabled={isLoading}
              className="h-12 text-center text-lg tracking-widest border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Verify Code
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
            onClick={onResend}
            disabled={isLoading}
          >
            Resend Code
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
