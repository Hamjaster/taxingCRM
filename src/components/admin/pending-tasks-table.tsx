"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { AddTaskDialog } from "./add-task-dialog";
import { ViewNotesDialog } from "./view-notes-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchTasks,
  updateTask,
  deleteTask,
  setFilters,
  clearError,
  Task,
} from "@/store/slices/taskSlice";

export function PendingTasksTable({
  tasks,
  title,
  description,
}: {
  tasks: Task[];
  title: string;
  description: string;
}) {
  const { error, isUpdating, isDeleting, filters } = useAppSelector(
    (state) => state.tasks
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isViewNotesOpen, setIsViewNotesOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  // Fetch tasks when component mounts or filters change

  const handleViewNotes = (task: Task) => {
    setSelectedTask(task);
    setIsViewNotesOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await dispatch(
      updateTask({
        taskId,
        updates: { status: newStatus },
      })
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(taskId));
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ ...filters, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ ...filters, page }));
  };

  // Format client name for display
  const getClientDisplayName = (client: Task["clientId"]) => {
    return (
      client.businessName ||
      client.entityName ||
      `${client.firstName} ${client.lastName}`
    );
  };

  const columns: Column<Task>[] = [
    {
      key: "clientId",
      title: "Client",
      sortable: true,
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">
            {getClientDisplayName(row.clientId)}
          </span>
          <span className="text-xs text-gray-500">
            {row.clientId.clientType}
          </span>
        </div>
      ),
    },
    {
      key: "title",
      title: "Task",
      sortable: true,
      render: (value, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{value}</span>
          <span className="text-xs text-gray-500">{row.category}</span>
        </div>
      ),
    },
    {
      key: "dueDate",
      title: "Due Date",
      render: (value) => (
        <span className="text-gray-600">
          {value ? new Date(value).toLocaleDateString() : "-"}
        </span>
      ),
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
        <span
          className={`font-medium ${
            value > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "priority",
      title: "Priority",
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === "Urgent"
              ? "bg-red-100 text-red-800"
              : value === "High"
              ? "bg-orange-100 text-orange-800"
              : value === "Medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewNotes(row)}>
              <Eye className="h-4 w-4 mr-2" />
              View Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleStatusChange(
                  row._id,
                  row.status === "Completed" ? "Pending" : "Completed"
                )
              }
              disabled={isUpdating}
            >
              <Edit className="h-4 w-4 mr-2" />
              {row.status === "Completed" ? "Mark Pending" : "Mark Complete"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteTask(row._id)}
              disabled={isDeleting}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actions = (
    <div className="flex items-center gap-2">
      <Select
        value={filters.status || "all"}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-32 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
          <SelectItem value="Do not continue">Discontinued</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => setIsAddTaskOpen(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Task
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
          <Button
            variant="link"
            size="sm"
            onClick={() => dispatch(clearError())}
            className="ml-2 p-0 h-auto"
          >
            Dismiss
          </Button>
        </div>
      )}

      <DataTable
        data={tasks}
        columns={columns}
        title={title}
        subtitle={description}
        actions={actions}
        selectable={true}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row._id}
      />

      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} />

      <ViewNotesDialog
        open={isViewNotesOpen}
        onOpenChange={setIsViewNotesOpen}
        task={selectedTask}
      />
    </div>
  );
}
