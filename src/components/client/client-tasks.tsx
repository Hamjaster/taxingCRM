"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/ui/data-table";

interface ClientTask {
  id: string;
  taskName: string;
  dueDate: string;
  priceQuoted: number;
  amountPaid: number;
  remainingBalance: number;
  status: "Paid" | "Pending";
}

const mockClientTasks: ClientTask[] = [
  {
    id: "1",
    taskName: "S-Corp Tax Prep (1120S)",
    dueDate: "12/31/2025",
    priceQuoted: 125.0,
    amountPaid: 125.0,
    remainingBalance: 0.0,
    status: "Paid",
  },
  {
    id: "2",
    taskName: "Bookkeeping - Quarterly",
    dueDate: "06/30/2025",
    priceQuoted: 300.0,
    amountPaid: 150.0,
    remainingBalance: 150.0,
    status: "Pending",
  },
  {
    id: "3",
    taskName: "Business Tax Resolution",
    dueDate: "09/15/2025",
    priceQuoted: 500.0,
    amountPaid: 500.0,
    remainingBalance: 0.0,
    status: "Paid",
  },
];

function ClientStatusBadge({ status }: { status: "Paid" | "Pending" }) {
  switch (status) {
    case "Paid":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-200">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span className="text-green-700 text-sm font-medium">Paid</span>
        </div>
      );
    case "Pending":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200">
          <div className="h-2 w-2 rounded-full bg-orange-500"></div>
          <span className="text-orange-700 text-sm font-medium">Pending</span>
        </div>
      );
    default:
      return <span className="text-gray-600 text-sm">{status}</span>;
  }
}

export function ClientTasks() {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedRows, setSelectedRows] = useState<string[]>([]); // Add this line

  const columns: Column<ClientTask>[] = [
    {
      key: "taskName",
      title: "Task Name",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "dueDate",
      title: "Due Date",
      sortable: true,
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
      render: (value) => <ClientStatusBadge status={value} />,
    },
  ];

  const actions = (
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
  );

  return (
    <DataTable
      data={mockClientTasks}
      columns={columns}
      title="Tasks"
      subtitle="List of Tasks"
      actions={actions}
      selectable={true} // Changed from false to true
      onSelectionChange={setSelectedRows} // Add state handler
      getRowId={(row) => row.id}
    />
  );
}
