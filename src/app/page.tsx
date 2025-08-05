import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            TaxingCRM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Professional tax management system for accounting firms and their
            clients
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                2FA authentication and secure document management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Comprehensive client portal and project tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building2 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Professional Tools</CardTitle>
              <CardDescription>
                Task management, notes, and service type organization
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Login Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Choose Your Portal
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Admin Login */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Admin Portal
                </CardTitle>
                <CardDescription className="text-center">
                  For accounting professionals and staff
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>• Manage clients and projects</p>
                  <p>• Create and assign tasks</p>
                  <p>• Internal notes and communication</p>
                  <p>• Service type management</p>
                </div>
                <div className="space-y-2">
                  <Link href="/admin/login" className="w-full">
                    <Button className="w-full">Admin Login</Button>
                  </Link>
                  <Link href="/admin/register" className="w-full">
                    <Button variant="outline" className="w-full">
                      Admin Register
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Client Login */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  Client Portal
                </CardTitle>
                <CardDescription className="text-center">
                  For individuals and businesses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>• View project status</p>
                  <p>• Access documents</p>
                  <p>• Communicate with your team</p>
                  <p>• Track progress</p>
                </div>
                <div className="space-y-2">
                  <Link href="/client/login" className="w-full">
                    <Button className="w-full">Client Login</Button>
                  </Link>
                  <Link href="/client/register" className="w-full">
                    <Button variant="outline" className="w-full">
                      Client Register
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
