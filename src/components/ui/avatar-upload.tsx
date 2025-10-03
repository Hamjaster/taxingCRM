"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Upload, X, Loader2 } from "lucide-react";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showRemoveButton?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  onAvatarChange,
  disabled = false,
  size = "md",
  showRemoveButton = true,
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, removeImage, isUploading } = useAvatarUpload({
    onSuccess: (avatarUrl) => {
      setPreviewUrl(null);
      onAvatarChange?.(avatarUrl);
    },
    onError: (error) => {
      setPreviewUrl(null);
      alert(error);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Upload the file
    uploadImage(file, "avatar");
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeImage();
      setPreviewUrl(null);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-12 w-12";
      case "lg":
        return "h-24 w-24";
      default:
        return "h-16 w-16";
    }
  };

  const getUploadAreaSize = () => {
    switch (size) {
      case "sm":
        return "h-24 w-24";
      case "lg":
        return "h-32 w-32";
      default:
        return "h-28 w-28";
    }
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={getSizeClasses()}>
          <AvatarImage src={displayAvatar || ""} alt="Avatar" />
          <AvatarFallback className="bg-gray-100">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <Upload className="h-6 w-6 text-gray-400" />
            )}
          </AvatarFallback>
        </Avatar>

        {showRemoveButton && displayAvatar && !isUploading && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemoveAvatar}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {displayAvatar ? "Change Avatar" : "Upload Avatar"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
