"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { ReusableDialog } from "@/components/ui/reusable-dialog";
import { Button } from "@/components/ui/button";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TaskFormData {
  clientSearch: string;
  task: string;
  dueDate: string;
  priceQuoted: string;
  amountPaid: string;
  remainingBalance: string;
  status: string;
  notes: string;
}

const initialFormData: TaskFormData = {
  clientSearch: "",
  task: "",
  dueDate: "",
  priceQuoted: "",
  amountPaid: "",
  remainingBalance: "",
  status: "Pending",
  notes: "",
};

const taskOptions = [
  "Tax Prep",
  "Amendment",
  "Tax Resolution",
  "Transaction Renewal",
  "ITIN Renewal",
  "Tax Planning",
  "General Consultation",
];

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);

      // Reset form and close dialog
      setFormData(initialFormData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
  };

  const updateFormData = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-green-600 hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </Button>
    </>
  );

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Task"
      size="md"
      footer={footer}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientSearch">Client Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="clientSearch"
              placeholder="Office of the DJ"
              value={formData.clientSearch}
              onChange={(e) => updateFormData("clientSearch", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task</Label>
            <Select
              value={formData.task}
              onValueChange={(value) => updateFormData("task", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Task" />
              </SelectTrigger>
              <SelectContent>
                {taskOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => updateFormData("dueDate", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceQuoted">Price Quoted</Label>
            <Input
              id="priceQuoted"
              placeholder="$125.00"
              value={formData.priceQuoted}
              onChange={(e) => updateFormData("priceQuoted", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountPaid">Amount Paid</Label>
            <Input
              id="amountPaid"
              placeholder="$125.00"
              value={formData.amountPaid}
              onChange={(e) => updateFormData("amountPaid", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="remainingBalance">Remaining Balance</Label>
            <Input
              id="remainingBalance"
              placeholder="$0.00"
              value={formData.remainingBalance}
              onChange={(e) =>
                updateFormData("remainingBalance", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateFormData("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Enter a notes..."
            value={formData.notes}
            onChange={(e) => updateFormData("notes", e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="flex items-center gap-2 text-green-600 cursor-pointer hover:text-green-700">
            <Plus className="h-4 w-4" />
            <span className="text-sm">Add New Category</span>
          </div>
        </div>
      </form>
    </ReusableDialog>
  );
}
