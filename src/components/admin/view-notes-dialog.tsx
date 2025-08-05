"use client";

import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ui/reusable-dialog";

interface Task {
  id: string;
  clientClass: "Individual" | "Business";
  clientName: string;
  task: string;
  date: string;
  priceQuoted: number;
  amountPaid: number;
  remainingBalance: number;
  status: "Completed" | "Do not continue" | "Pending";
  notes: string;
}

interface ViewNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export function ViewNotesDialog({
  open,
  onOpenChange,
  task,
}: ViewNotesDialogProps) {
  if (!task) return null;

  const footer = <Button onClick={() => onOpenChange(false)}>Close</Button>;

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Quick Notes"
      size="md"
      footer={footer}
    >
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-2">
            {task.clientName} - {task.task}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">{task.notes}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Date:</span>
            <span className="ml-2 font-medium">{task.date}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className="ml-2 font-medium">{task.status}</span>
          </div>
          <div>
            <span className="text-gray-500">Price Quoted:</span>
            <span className="ml-2 font-medium">
              ${task.priceQuoted.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Amount Paid:</span>
            <span className="ml-2 font-medium">
              ${task.amountPaid.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </ReusableDialog>
  );
}
