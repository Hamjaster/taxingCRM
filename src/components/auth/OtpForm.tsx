import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, RefreshCw } from "lucide-react";

interface OTPFormProps {
  phoneNumber: string;
  onVerify: (otpCode: string) => void;
  onResend: () => void;
  isLoading: boolean;
  error: string;
}

import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <Card
      className={`w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm ${className}`}
    >
      <CardContent className="p-8">{children}</CardContent>
    </Card>
  );
}

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
}

function FormField({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  icon,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`h-12 ${
            icon ? "pl-10" : ""
          } border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors`}
        />
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  children: ReactNode;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

function SubmitButton({
  children,
  isLoading,
  disabled = false,
  className = "",
  type = "submit",
  onClick,
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] ${className}`}
    >
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
      {children}
    </Button>
  );
}

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message: string;
}

function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive" className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-red-800">{message}</AlertDescription>
    </Alert>
  );
}

export default function OTPForm({
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
    <AuthCard>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Phone
        </h3>
        <p className="text-gray-600">
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-purple-600">{phoneNumber}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorAlert message={error} />

        <FormField
          label="Verification Code"
          id="otp"
          type="text"
          value={otpCode}
          onChange={setOtpCode}
          placeholder="Enter 6-digit code"
          required
          disabled={isLoading}
          className="text-center"
        />

        <SubmitButton isLoading={isLoading} disabled={otpCode.length !== 6}>
          Verify Code
        </SubmitButton>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-colors bg-transparent"
          onClick={onResend}
          disabled={isLoading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Resend Code
        </Button>
      </form>
    </AuthCard>
  );
}
