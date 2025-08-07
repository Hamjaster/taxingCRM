import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerLinks?: {
    text: string;
    linkText: string;
    href: string;
  }[];
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  footerLinks,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50">
      {/* Background Pattern */}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(139, 92, 246, 0.1) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.1) 2px, transparent 0)`,
          backgroundSize: "100px 100px",
        }}
      ></div>

      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <Link
                href="/"
                className="text-4xl font-bold text-white hover:text-purple-200 transition-colors"
              >
                Tax ON Track
              </Link>
              <div className="w-20 h-1 bg-green-400 mt-2 rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Streamline Your
              <span className="text-green-400 block">Tax Operations</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Manage clients, track tasks, and grow your tax practice with our
              comprehensive CRM solution.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-lg">
                Trusted by 1000+ tax professionals
              </span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400/20 rounded-full blur-xl"></div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="text-center lg:hidden">
              <img src="/icons/logo.svg" alt="" />
            </div>

            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{subtitle}</p>
            </div>

            {/* Form Content */}
            {children}

            {/* Footer Links */}
            {footerLinks && (
              <div className="text-center space-y-3">
                {footerLinks.map((link, index) => (
                  <p key={index} className="text-sm text-gray-600">
                    {link.text}{" "}
                    <Link
                      href={link.href}
                      className="font-medium text-green-600 hover:text-green-500 transition-colors"
                    >
                      {link.linkText}
                    </Link>
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
