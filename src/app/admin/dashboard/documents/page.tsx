import { Documents } from "@/components/ui/documents";
import { Folder } from "@/types";
import { mockFolders } from "@/types/constants";
import React from "react";

export default function page() {
  return (
    <div className="p-6">
      <Documents isBordered={true} title="Folders" folders={mockFolders} />
    </div>
  );
}
