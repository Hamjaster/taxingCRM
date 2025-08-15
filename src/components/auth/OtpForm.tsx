import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface OTPFormProps {
  email: string;
  onVerify: (otpCode: string) => void;
  onResend: () => void;
  isLoading: boolean;
  error: string;
  remainingTime?: number;
}

export default function OTPForm({
  email,
  onVerify,
  onResend,
  isLoading,
  error,
  remainingTime = 0,
}: OTPFormProps) {
  const [otpCode, setOtpCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(remainingTime);
  const [canResend, setCanResend] = useState(remainingTime <= 0);

  useEffect(() => {
    setTimeLeft(remainingTime);
    setCanResend(remainingTime <= 0);
  }, [remainingTime]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 1) {
          setCanResend(true);
        }
      }, 60000); // Update every minute

      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  const handleResend = () => {
    setOtpCode("");
    setCanResend(false);
    onResend();
  };

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setOtpCode(numericValue);
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.length > 2
        ? `${localPart[0]}${"*".repeat(localPart.length - 2)}${
            localPart[localPart.length - 1]
          }`
        : localPart;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <Card className="w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h3>
          <p className="text-gray-600 mt-3">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-blue-600">
              {maskEmail(email)}
            </span>
          </p>
          {timeLeft > 0 && (
            <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Code expires in {timeLeft} minute{timeLeft !== 1 ? "s" : ""}
            </div>
          )}
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
              onChange={(e) => handleOtpChange(e.target.value)}
              placeholder="000000"
              required
              disabled={isLoading}
              className="h-12 text-center text-2xl font-mono tracking-widest border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
              maxLength={6}
            />
            <p className="text-xs text-gray-500 text-center mt-3">
              Enter the 6-digit code from your email
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            isLoading={isLoading}
            className="w-full h-12 font-medium"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
            onClick={handleResend}
            disabled={isLoading || !canResend}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {canResend ? "Resend Code" : `Resend in ${timeLeft}m`}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mt-3">
              Didn't receive the code? Check your spam folder or{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className="text-blue-600 hover:text-blue-700 underline disabled:text-gray-400 disabled:no-underline"
              >
                try again
              </button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
