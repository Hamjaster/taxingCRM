"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Lock, UserCheck, AlertCircle } from "lucide-react";
import {
  setupRecaptcha,
  sendOTPWithFirebase,
  verifyOTPWithFirebase,
  clearConfirmationResult,
} from "@/lib/firebase-auth";
import type { RecaptchaVerifier } from "firebase/auth";
import OTPForm from "./OtpForm";

interface RegisterFormProps {
  userType?: "admin" | "client";
}

export default function RegisterForm({ userType }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    role: userType || "client",
  });
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
      const verifier = setupRecaptcha("recaptcha-container-register");
      setRecaptchaVerifier(verifier);
    }

    return () => {
      clearConfirmationResult();
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    // For testing purposes
    if (userType === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/client/dashboard");
    }

    // if (formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match");
    //   setIsLoading(false);
    //   return;
    // }

    // if (formData.password.length < 8) {
    //   setError("Password must be at least 8 characters long");
    //   setIsLoading(false);
    //   return;
    // }

    // try {
    //   const response = await fetch("/api/auth/register", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       email: formData.email,
    //       password: formData.password,
    //       firstName: formData.firstName,
    //       lastName: formData.lastName,
    //       phone: formData.phone,
    //       role: formData.role,
    //     }),
    //   });

    //   const data = await response.json();
    //   if (!response.ok) {
    //     throw new Error(data.error || "Registration failed");
    //   }

    //   setUserId(data.userId);
    //   setPhoneNumber(data.phoneNumber);

    //   if (data.needsVerification) {
    //     setError(
    //       "Account found but phone not verified. Sending verification code..."
    //     );
    //   }

    //   if (recaptchaVerifier) {
    //     const result = await sendOTPWithFirebase(
    //       data.phoneNumber,
    //       recaptchaVerifier
    //     );
    //     if (result.success) {
    //       setShowOTP(true);
    //       if (data.needsVerification) {
    //         setError("");
    //       }
    //     } else {
    //       throw new Error(result.error || "Failed to send OTP");
    //     }
    //   } else {
    //     throw new Error("reCAPTCHA not initialized");
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
        throw new Error(data.error || "Backend verification failed");
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
          fetch("/api/auth/resend-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
        }}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm ">
      <CardContent className="px-6">
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="John"
                  required
                  disabled={isLoading}
                  className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                  className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
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
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="john@example.com"
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          {!userType && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Account Type
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-primary-500 focus:ring-primary-500">
                  <div className="flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Select account type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1">
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
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="h-12 pl-10 border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm your password"
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
            Create Account
          </Button>

          <div id="recaptcha-container-register" className="hidden"></div>
        </form>
      </CardContent>
    </Card>
  );
}
