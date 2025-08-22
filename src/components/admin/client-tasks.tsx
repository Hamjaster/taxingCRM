"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Edit,
  Plus,
} from "lucide-react";
import {
  fetchTasks,
  updateTask,
  deleteTask,
  setFilters,
  clearError,
  Task,
} from "@/store/slices/taskSlice";
import { DataTable, Column } from "@/components/ui/data-table";

interface ClientTasksProps {
  clientId: string;
}

export function ClientTasks({ clientId }: ClientTasksProps) {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, pagination, filters, error, isUpdating } =
    useAppSelector((state) => state.tasks);

  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskNotes, setTaskNotes] = useState("");

  // Fetch tasks for this specific client
  useEffect(() => {
    dispatch(fetchTasks({ ...filters, clientId, limit: 20 }));
  }, [dispatch, filters, clientId]);

  const handleStatusUpdate = async (taskId: string, status: string) => {
    await dispatch(
      updateTask({
        taskId,
        updates: { status },
      })
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask(taskId));
    }
  };

  const handleNotesUpdate = async () => {
    if (selectedTask && taskNotes.trim()) {
      await dispatch(
        updateTask({
          taskId: selectedTask._id,
          updates: { notes: taskNotes },
        })
      );
      setTaskNotes("");
      setIsNotesDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const handleFilterChange = (status: string) => {
    dispatch(
      setFilters({
        ...filters,
        status: status === "all" ? undefined : status,
        page: 1,
      })
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "Do not continue":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <CheckSquare className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Do not continue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Define table columns
  const columns: Column<Task>[] = [
    {
      key: "title",
      title: "Task",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-start gap-3">
          {getStatusIcon(row.status)}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 mb-1 truncate">
              {row.title}
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {row.description || "No description provided"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
              <Badge className={getPriorityColor(row.priority)}>
                {row.priority}
              </Badge>
              <Badge variant="outline">{row.category}</Badge>
            </div>
          </div>
        </div>
      ),
      width: "40%",
    },
    {
      key: "dueDate",
      title: "Due Date",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            {value ? new Date(value).toLocaleDateString() : "No due date"}
          </span>
        </div>
      ),
    },
    {
      key: "priceQuoted",
      title: "Price",
      sortable: true,
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>Quoted: ${value.toFixed(2)}</span>
          </div>
          {row.remainingBalance > 0 && (
            <div className="flex items-center gap-1 text-red-600 mt-1">
              <DollarSign className="h-4 w-4" />
              <span>Balance: ${row.remainingBalance.toFixed(2)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedTask(row);
                setTaskNotes(row.notes || "");
                setIsNotesDialogOpen(true);
              }}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              View/Edit Notes
            </DropdownMenuItem>
            {row.status === "Pending" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row._id, "In Progress")}
                disabled={isUpdating}
              >
                <Edit className="h-4 w-4 mr-2" />
                Start Task
              </DropdownMenuItem>
            )}
            {row.status === "In Progress" && (
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row._id, "Completed")}
                disabled={isUpdating}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleDeleteTask(row._id)}
              className="text-red-600"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Create actions for the DataTable
  const actions = (
    <div className="flex items-center gap-2">
      <Select
        value={filters.status || "all"}
        onValueChange={handleFilterChange}
      >
        <SelectTrigger className="w-32 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="In Progress">In Progress</SelectItem>
          <SelectItem value="Completed">Completed</SelectItem>
        </SelectContent>
      </Select>
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
        title={`Client Tasks (${pagination.totalTasks})`}
        subtitle="Tasks assigned to this client"
        actions={actions}
        selectable={false}
        onSelectionChange={setSelectedRows}
        getRowId={(row) => row._id}
      />

      {/* Notes Dialog */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Task Notes</DialogTitle>
            <DialogDescription>{selectedTask?.title}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedTask?.notes && (
              <div className="space-y-2">
                <Label>Current Notes:</Label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {selectedTask.notes}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Add/Update Notes:</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes or updates..."
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setTaskNotes("");
                setIsNotesDialogOpen(false);
                setSelectedTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNotesUpdate}
              disabled={!taskNotes.trim() || isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
