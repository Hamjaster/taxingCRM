"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderIcon, ChevronLeft, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder } from "@/types";

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <img className="w-16" src="/icons/client/pdf.svg" alt="" />;
    case "doc":
      return <img className="w-16" src="/icons/client/doc.svg" alt="" />;
    case "image":
      return <img className="w-16" src="/icons/client/img.svg" alt="" />;

    default:
      return <img className="w-16" src="/icons/client/doc.svg" alt="" />;
  }
}

function getFolderIcon(folders: Folder[], folderName: string) {
  const colors = ["red", "blue", "green", "orange"];

  const folderIndex = folders.findIndex((f) => f.name === folderName);
  const colorClass = colors[folderIndex] || "blue";

  return (
    <div className=" flex flex-col items-center justify-center">
      {/* <FolderIcon className={`w-14 h-12 ${colorClass}`} /> */}
      <img className="w-16" src={`/icons/client/${colorClass}-folder.svg`} />
    </div>
  );
}

export function Documents({
  isBordered = false,
  title,
  folders,
}: {
  isBordered: boolean;
  title: string;
  folders: Folder[];
}) {
  const [currentView, setCurrentView] = useState<"folders" | "documents">(
    "folders"
  );
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleFolderClick = (folder: Folder) => {
    setSelectedFolder(folder);
    setCurrentView("documents");
  };

  const handleBackToFolders = () => {
    setCurrentView("folders");
    setSelectedFolder(null);
  };

  if (currentView === "documents" && selectedFolder) {
    return (
      <div className={` ${isBordered ? "border rounded-lg" : ""} bg-white p-5`}>
        {/* Header with back button */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToFolders}
              className="p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedFolder.name}
            </h3>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
            <Plus className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
          {selectedFolder.documents.map((document) => (
            <div
              key={document.id}
              className="flexn p-6 space-y-5 border rounded-lg shadow-sm flex-col items-start group cursor-pointer"
            >
              <div className="relative">
                {getFileIcon(document.type)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-start">
                <p className="text-lg font-medium text-gray-900 max-w-[120px] truncate">
                  {document.name}
                </p>
                <p className="text-md text-gray-500">
                  Created at {document.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={` ${isBordered ? "border rounded-lg" : ""} bg-white p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {title || "Documentations"}
        </h3>
        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
          <Plus className="w-4 h-4 mr-2" />
          Create Folder
        </Button>
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8  pt-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="relative flex p-6 space-y-5 border rounded-lg shadow-sm flex-col items-start  group cursor-pointer"
            onClick={() => handleFolderClick(folder)}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative">
              {getFolderIcon(folders, folder.name)}
            </div>
            <div className="text-start">
              <p className="text-lg w-full font-medium text-gray-900">
                {folder.name}
              </p>
              <p className="text-md text-gray-500">
                Created at {folder.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
