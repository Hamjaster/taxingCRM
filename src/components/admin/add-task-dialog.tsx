"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Search, Check, ChevronsUpDown } from "lucide-react";
import { ReusableDialog } from "@/components/ui/reusable-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createTask,
  fetchTaskCategories,
  createTaskCategory,
  clearError,
} from "@/store/slices/taskSlice";
import { fetchAdminClients } from "@/store/slices/authSlice";
import { Client, ClientUser } from "@/types";

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
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [clientSearchValue, setClientSearchValue] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    setActiveClients(() =>
      clients.filter((client) => client.status === "Active")
    );
  }, [clients]);

  // Fetch data when dialog opens
  useEffect(() => {
    if (open) {
      if (!hasFetchedClients) {
        dispatch(fetchAdminClients());
      }
      dispatch(fetchTaskCategories());
    }
  }, [open, hasFetchedClients, dispatch]);

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!clientSearchValue) return activeClients;

    const searchLower = clientSearchValue.toLowerCase();

    return activeClients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const businessName = client.businessName?.toLowerCase() || "";
      const entityName = client.entityName?.toLowerCase() || "";
      const email = client.email?.toLowerCase() || "";

      return (
        fullName.includes(searchLower) ||
        businessName.includes(searchLower) ||
        entityName.includes(searchLower) ||
        email.includes(searchLower)
      );
    });
  }, [activeClients, clientSearchValue]);

  // Get selected client display name
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
      priceQuoted: parseFloat(formData.priceQuoted) || 0,
      amountPaid: parseFloat(formData.amountPaid) || 0,
      dueDate: formData.dueDate || undefined,
      notes: formData.notes || undefined,
    };

    const result = await dispatch(createTask(taskData));

    if (createTask.fulfilled.match(result)) {
      setFormData(initialFormData);
      setClientSearchValue("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setClientSearchValue("");
    setShowAddCategory(false);
    setNewCategoryName("");
    setNewCategoryDescription("");
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
        description: newCategoryDescription.trim() || undefined,
      })
    );

    if (createTaskCategory.fulfilled.match(result)) {
      setFormData((prev) => ({ ...prev, category: result.payload.name }));
      setShowAddCategory(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
    }

    setIsAddingCategory(false);
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

        {/* Task Title */}
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

        {/* Client Search */}
        <div className="space-y-2">
          <Label htmlFor="clientSearch">Select Client *</Label>
          <Popover open={clientSearchOpen} onOpenChange={setClientSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientSearchOpen}
                className="w-full justify-between"
              >
                {clientDisplayName || "Select client..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search clients..."
                  value={clientSearchValue}
                  onValueChange={setClientSearchValue}
                />
                <CommandList>
                  <CommandEmpty>No clients found.</CommandEmpty>
                  <CommandGroup>
                    {filteredClients.map((client) => {
                      const displayName =
                        client.businessName ||
                        client.entityName ||
                        `${client.firstName} ${client.lastName}`;

                      return (
                        <CommandItem
                          key={client._id}
                          value={displayName}
                          className="cursor-pointer text-black"
                          onSelect={() => {
                            updateFormData("clientId", client._id);
                            setClientSearchOpen(false);
                          }}
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
                            <span>{displayName}</span>
                            <span className="text-xs ">
                              {client.email} • {client.clientType}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateFormData("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
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

        {/* Description */}
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
          {/* Priority */}
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

          {/* Status */}
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
          {/* Price Quoted */}
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

          {/* Amount Paid */}
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

        {/* Notes */}
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

        {/* Add New Category Section */}
        <div className="pt-2">
          {!showAddCategory ? (
            <div
              className="flex items-center gap-2 text-green-600 cursor-pointer hover:text-green-700"
              onClick={() => setShowAddCategory(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">Add New Category</span>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Add New Category</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                  }}
                >
                  ×
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCategoryName">Category Name</Label>
                <Input
                  id="newCategoryName"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newCategoryDescription">
                  Description (Optional)
                </Label>
                <Textarea
                  id="newCategoryDescription"
                  placeholder="Enter category description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim() || isAddingCategory}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {isAddingCategory ? "Adding..." : "Add Category"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </ReusableDialog>
  );
}
