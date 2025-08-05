import { X } from "lucide-react";

type StatusType = "Completed" | "Do not continue" | "Pending";

interface StatusBadgeProps {
  status: StatusType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Completed":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-green-700 text-sm font-medium">Completed</span>
        </div>
      );
    case "Do not continue":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200">
          <X className="h-3 w-3 text-red-600" />
          <span className="text-red-700 text-sm font-medium">
            Do not continue
          </span>
        </div>
      );
    case "Pending":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200">
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <span className="text-yellow-700 text-sm font-medium">Pending</span>
        </div>
      );
    default:
      return <span className="text-gray-600 text-sm">{status}</span>;
  }
}
