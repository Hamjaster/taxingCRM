"use client";

import { Button } from "@/components/ui/button";
import { ReusableDialog } from "@/components/ui/reusable-dialog";
import { Task } from "@/store/slices/taskSlice";

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
            {task.clientId.businessName ||
              task.clientId.entityName ||
              `${task.clientId.firstName} ${task.clientId.lastName}`}{" "}
            - {task.title}
          </h3>
          <div className="text-sm text-gray-600 mb-3">
            Category: {task.category} | Priority: {task.priority}
          </div>
          {task.description && (
            <div className="mb-3">
              <span className="text-sm text-gray-500">Description:</span>
              <p className="text-sm text-gray-700 mt-1">{task.description}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4">
            <span className="text-sm text-gray-500 block mb-2">Notes:</span>
            <p className="text-sm text-gray-700">
              {task.notes || "No notes available"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Due Date:</span>
            <span className="ml-2 font-medium">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "Not set"}
            </span>
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
          <div>
            <span className="text-gray-500">Remaining Balance:</span>
            <span
              className={`ml-2 font-medium ${
                task.remainingBalance > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ${task.remainingBalance.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 font-medium">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </ReusableDialog>
  );
}
