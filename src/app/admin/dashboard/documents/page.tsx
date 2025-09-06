import { Documents } from "@/components/ui/documents";
import React from "react";

export default function page() {
  return (
    <div className="p-6">
      <Documents isBordered={true} title="All Documents" />
    </div>
  );
}
