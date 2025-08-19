"use client";
import { Construction, Wrench, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function UnderConstruction({
  title = "Page Under Construction",
  description = "We're working hard to bring you this feature. Please check back soon!",
  showBackButton = true,
  onBack,
}: UnderConstructionProps) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
      <div className="text-center max-w-md mx-auto">
        {/* Construction Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Construction className="h-12 w-12 text-white" />
          </div>
          {/* Animated tools */}
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Wrench className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 animate-pulse">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Clock className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

        {/* Action buttons */}
        <div className="space-y-3">
          {showBackButton && (
            <Button
              onClick={onBack || (() => window.history.back())}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          )}
          <p className="text-xs text-gray-400 mt-4">
            Expected completion: Coming Soon
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4 opacity-20">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div
            className="w-2 h-2 bg-blue-400 rounded-full animate-ping"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-green-400 rounded-full animate-ping"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
