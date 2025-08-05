"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { AddTaskDialog } from "./add-task-dialog";
import { ViewNotesDialog } from "./view-notes-dialog";

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

// Mock data
const mockTasks: Task[] = [
  {
    id: "1",
    clientClass: "Individual",
    clientName: "Ali",
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: 0.0,
    status: "Completed",
    notes: "Tax return completed successfully. All documents filed.",
  },
  {
    id: "2",
    clientClass: "Business",
    clientName: "John",
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 175.0,
    amountPaid: 175.0,
    remainingBalance: 0.0,
    status: "Do not continue",
    notes: "Client requested to discontinue service.",
  },
  {
    id: "3",
    clientClass: "Individual",
    clientName: "Sunny",
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: 0.0,
    status: "Completed",
    notes: "Standard individual tax preparation completed.",
  },
  {
    id: "4",
    clientClass: "Business",
    clientName: "Sam",
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: 0.0,
    status: "Completed",
    notes: "Business tax filing completed on time.",
  },
  {
    id: "5",
    clientClass: "Individual",
    clientName: "Johny",
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: 0.0,
    status: "Do not continue",
    notes: "Client moved to different state.",
  },
  // Add more mock data for pagination
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 6}`,
    clientClass: (i % 2 === 0 ? "Individual" : "Business") as
      | "Individual"
      | "Business",
    clientName: `Client ${i + 6}`,
    task: "Individual Tax Prep",
    date: "04/15/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: i % 3 === 0 ? 25.0 : 0.0,
    status: ["Completed", "Do not continue", "Pending"][i % 3] as
      | "Completed"
      | "Do not continue"
      | "Pending",
    notes: `Sample notes for client ${
      i + 6
    }. Task details and progress information.`,
  })),
];

export function PendingTasksTable() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleViewNotes = (task: Task) => {
    setSelectedTask(task);
    setIsViewNotesOpen(true);
  };

  const columns: Column<Task>[] = [
    {
      key: "clientClass",
      title: "Client Class",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "clientName",
      title: "Name of Client",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "task",
      title: "Task",
      sortable: true,
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "date",
      title: "Date",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "priceQuoted",
      title: "Price Quoted",
      render: (value) => (
        <span className="text-gray-600">${value.toFixed(2)}</span>
      ),
    },
    {
      key: "amountPaid",
      title: "Amount Paid",
      render: (value) => (
        <span className="text-gray-600">${value.toFixed(2)}</span>
      ),
    },
    {
      key: "remainingBalance",
      title: "Remaining Balance",
      render: (value) => (
        <span className="text-gray-600">${value.toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "notes",
      title: "Quick Notes",
      render: (_, row) => (
        <Button
          variant="link"
          className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => handleViewNotes(row)}
        >
          View
        </Button>
      ),
    },
  ];

  const actions = (
    <>
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-24 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2025">2025</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => setIsAddTaskOpen(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    </>
  );

  return (
    <>
      <DataTable
        data={mockTasks}
        columns={columns}
        title="Pending Tasks"
        subtitle="List of Pending Tasks"
        actions={actions}
        selectable={true}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row.id}
      />

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />
      <ViewNotesDialog
        open={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
        task={selectedTask}
      />
    </>
  );
}
