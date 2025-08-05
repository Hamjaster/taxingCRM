"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ReusableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export function ReusableDialog({
  open,
  onOpenChange,
  title,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  className = "",
}: ReusableDialogProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClasses[size]} ${className}`}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && (
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
