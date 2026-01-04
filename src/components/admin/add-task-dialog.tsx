"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Check, ChevronsUpDown } from "lucide-react";
import { ReusableDialog } from "@/components/ui/reusable-dialog";
import { Button } from "@/components/ui/button";
import { cn, createNotification } from "@/lib/utils";
import {
  createTask,
  fetchTaskCategories,
  createTaskCategory,
  clearError,
} from "@/store/slices/taskSlice";
import { fetchAdminClients } from "@/store/slices/authSlice";
import type { ClientUser } from "@/types";
import { typeOfNotification } from "@/contexts/useNotifications";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TaskFormData {
  title: string;
  description: string;
  clientId: string;
  category: string;
  dueDate: string;
  priceQuoted: string;
  amountPaid: string;
  status: string;
  priority: string;
  notes: string;
}

const initialFormData: TaskFormData = {
  title: "",
  description: "",
  clientId: "",
  category: "",
  dueDate: "",
  priceQuoted: "",
  amountPaid: "",
  status: "Pending",
  priority: "Medium",
  notes: "",
};

export function AddTaskDialog({ open, onOpenChange }: AddTaskDialogProps) {
  const dispatch = useAppDispatch();
  const { clients, hasFetchedClients } = useAppSelector((state) => state.auth);
  const { categories, isCreating, error } = useAppSelector(
    (state) => state.tasks
  );
  const [activeClients, setActiveClients] = useState<ClientUser[]>([]);
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const { user } = useAppSelector((st) => st.auth);
  useEffect(() => {
    setActiveClients(() =>
      clients.filter((client) => client.status === "Active")
    );
  }, [clients]);

  useEffect(() => {
    if (open) {
      if (!hasFetchedClients) {
        dispatch(fetchAdminClients());
      }
      // Always fetch categories when dialog opens to ensure we have the latest data
      dispatch(fetchTaskCategories());
    }
  }, [open, hasFetchedClients, dispatch]);

  const selectedClient = activeClients.find(
    (client) => client._id === formData.clientId
  );
  const clientDisplayName = selectedClient
    ? selectedClient.businessName ||
      selectedClient.entityName ||
      `${selectedClient.firstName} ${selectedClient.lastName}`
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.category || !formData.clientId) {
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description || undefined,
      category: formData.category,
      clientId: formData.clientId,
      status: formData.status,
      priority: formData.priority,
      priceQuoted: Number.parseFloat(formData.priceQuoted) || 0,
      amountPaid: Number.parseFloat(formData.amountPaid) || 0,
      dueDate: formData.dueDate || undefined,
      notes: formData.notes || undefined,
    };

    const result = await dispatch(createTask(taskData));

    if (createTask.fulfilled.match(result)) {
      setFormData(initialFormData);
      onOpenChange(false);
      if (!user?._id || !(selectedClient && selectedClient._id)) return;

      // Prepare email data
      const emailData = {
        clientEmail: selectedClient.email,
        clientName:
          selectedClient.businessName ||
          selectedClient.entityName ||
          `${selectedClient.firstName} ${selectedClient.lastName}`,
        adminName: `${user.firstName} ${user.lastName}`,
        type: "TASK_CREATED" as const,
        message: `${user?.firstName} (Admin) added a task`,
        additionalData: {
          taskTitle: formData.title,
        },
      };

      createNotification({
        receiverId: selectedClient._id,
        senderId: user?._id,
        type: typeOfNotification.TASK_CREATED,
        message: `${user?.firstName} (Admin) added a task`,
        emailData,
      });
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setShowCategoryDialog(false);
    setNewCategoryName("");
    dispatch(clearError());
    onOpenChange(false);
  };

  const updateFormData = (field: keyof TaskFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsAddingCategory(true);

    const result = await dispatch(
      createTaskCategory({
        name: newCategoryName.trim(),
        description: undefined,
      })
    );

    if (createTaskCategory.fulfilled.match(result)) {
      setFormData((prev) => ({ ...prev, category: result.payload.name }));
      setShowCategoryDialog(false);
      setNewCategoryName("");
      // Refetch categories to ensure we have the latest list from the server
      dispatch(fetchTaskCategories());
    }

    setIsAddingCategory(false);
  };

  const handleOpenCategoryDialog = () => {
    setShowCategoryDialog(true);
  };

  const handleCloseCategoryDialog = () => {
    setShowCategoryDialog(false);
    setNewCategoryName("");
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isCreating}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-green-600 hover:bg-green-700"
        onClick={handleSubmit}
        disabled={
          isCreating ||
          !formData.title ||
          !formData.category ||
          !formData.clientId
        }
      >
        {isCreating ? "Adding..." : "Add Task"}
      </Button>
    </>
  );

  return (
    <>
      <ReusableDialog
        open={open}
        onOpenChange={onOpenChange}
        title="Add New Task"
        size="md"
        footer={footer}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => updateFormData("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSearch">Select Client *</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-transparent"
                >
                  {clientDisplayName || "Select client..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full max-h-48 overflow-y-auto">
                {activeClients.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No clients found.
                  </DropdownMenuItem>
                ) : (
                  activeClients.map((client) => {
                    const displayName =
                      client.businessName ||
                      client.entityName ||
                      `${client.firstName} ${client.lastName}`;

                    return (
                      <DropdownMenuItem
                        key={client._id}
                        onClick={() => updateFormData("clientId", client._id)}
                        className="flex items-center"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            formData.clientId === client._id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span className="text-sm">{displayName}</span>
                          <span className="text-xs text-gray-500">
                            {client.email} • {client.clientType}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-transparent"
                  >
                    {formData.category || "Select Category"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category._id}
                      onClick={() => updateFormData("category", category.name)}
                      className="flex items-center"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          formData.category === category.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span className="text-sm">{category.name}</span>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleOpenCategoryDialog}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm">Add New Category</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description..."
              value={formData.description}
              onChange={(e) => updateFormData("description", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => updateFormData("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceQuoted">Price Quoted</Label>
              <Input
                id="priceQuoted"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.priceQuoted}
                onChange={(e) => updateFormData("priceQuoted", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid</Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amountPaid}
                onChange={(e) => updateFormData("amountPaid", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter notes..."
              value={formData.notes}
              onChange={(e) => updateFormData("notes", e.target.value)}
              rows={3}
            />
          </div>
        </form>
      </ReusableDialog>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Enter a name for the new task category.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  } else if (e.key === "Escape") {
                    handleCloseCategoryDialog();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseCategoryDialog}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isAddingCategory}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAddingCategory ? "Adding..." : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
