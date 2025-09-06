"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Shield } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect authenticated users to their dashboard
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "client") {
        router.push("/client/dashboard");
      }
    }
  }, [isAuthenticated, role, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show content if user is authenticated (they'll be redirected)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            TaxingCRM
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Professional tax management system for accounting firms and their
            clients
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Enterprise-grade security with role-based access control
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Streamlined task assignment and progress tracking
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Client Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dedicated client portal for seamless communication
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Options */}
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
            Get Started
          </h2>

          <Link href="/admin/login" className="my-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3">
              Admin Login
            </Button>
          </Link>

          <Link href="/client/login">
            <Button variant="outline" className="w-full py-3">
              Client Login
            </Button>
          </Link>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/admin/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Register as Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
