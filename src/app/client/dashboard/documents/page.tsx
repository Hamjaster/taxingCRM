"use client";

import { useAppSelector } from "@/hooks/redux";
import { Documents } from "@/components/ui/documents";

export default function DocumentsPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex-1 space-y-6 p-6 ">
      <Documents isBordered={true} title="My Documents" clientId={user?.id} />
    </div>
  );
}
