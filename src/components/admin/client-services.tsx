"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  Plus,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { ClientUser } from "@/types";

interface ClientServicesProps {
  client: ClientUser;
}

// Mock services data
const mockServices = [
  {
    id: "1",
    name: "Tax Preparation - Individual",
    description: "Complete individual tax return preparation for 2023",
    price: 250.0,
    status: "Active",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    progress: 75,
    category: "Tax Services",
  },
  {
    id: "2",
    name: "Quarterly Business Filings",
    description: "Quarterly tax filings for small business",
    price: 150.0,
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    progress: 50,
    category: "Business Services",
  },
  {
    id: "3",
    name: "Bookkeeping Services",
    description: "Monthly bookkeeping and financial statement preparation",
    price: 300.0,
    status: "Completed",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    progress: 100,
    category: "Accounting Services",
  },
];

const serviceCategories = [
  "Tax Services",
  "Business Services",
  "Accounting Services",
  "Consulting Services",
  "Audit Services",
  "Other",
];

const serviceStatuses = [
  { value: "Active", color: "bg-green-100 text-green-800", icon: CheckCircle },
  { value: "In Progress", color: "bg-blue-100 text-blue-800", icon: Clock },
  { value: "Completed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  {
    value: "On Hold",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  { value: "Cancelled", color: "bg-red-100 text-red-800", icon: AlertCircle },
];

export function ClientServices({ client }: ClientServicesProps) {
  const [services, setServices] = useState(mockServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "Active",
    startDate: "",
    endDate: "",
    category: "",
  });

  const getStatusConfig = (status: string) => {
    return (
      serviceStatuses.find((s) => s.value === status) || serviceStatuses[0]
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const handleAddService = () => {
    const newService = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price) || 0,
      progress: 0,
    };

    setServices((prev) => [newService, ...prev]);
    setFormData({
      name: "",
      description: "",
      price: "",
      status: "Active",
      startDate: "",
      endDate: "",
      category: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditService = () => {
    if (!selectedService) return;

    setServices((prev) =>
      prev.map((service) =>
        service.id === selectedService.id
          ? { ...service, ...formData, price: parseFloat(formData.price) || 0 }
          : service
      )
    );

    setFormData({
      name: "",
      description: "",
      price: "",
      status: "Active",
      startDate: "",
      endDate: "",
      category: "",
    });
    setIsEditDialogOpen(false);
    setSelectedService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((service) => service.id !== serviceId));
    }
  };

  const openEditDialog = (service: any) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      status: service.status,
      startDate: service.startDate,
      endDate: service.endDate,
      category: service.category,
    });
    setIsEditDialogOpen(true);
  };

  // Service columns
  const serviceColumns: Column<any>[] = [
    {
      key: "name",
      title: "Service Name",
      sortable: true,
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 line-clamp-2">
            {row.description}
          </p>
          <Badge variant="outline" className="mt-1 text-xs">
            {row.category}
          </Badge>
        </div>
      ),
      width: "40%",
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1 font-medium text-gray-900">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span>${value.toFixed(2)}</span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value, row) => {
        const statusConfig = getStatusConfig(value);
        const StatusIcon = statusConfig.icon;
        return (
          <div className="space-y-2">
            <Badge className={statusConfig.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {value}
            </Badge>
            {row.progress !== undefined && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{row.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(
                      row.progress
                    )}`}
                    style={{ width: `${row.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "startDate",
      title: "Duration",
      render: (value, row) => (
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" />
            <span>Start: {new Date(value).toLocaleDateString()}</span>
          </div>
          {row.endDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>End: {new Date(row.endDate).toLocaleDateString()}</span>
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
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(row)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Service
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteService(row.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actions = (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Add a new service for{" "}
            {client.businessName || `${client.firstName} ${client.lastName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="Enter service name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter service description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full p-2 border rounded-md"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Select category</option>
                {serviceCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="w-full p-2 border rounded-md"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              {serviceStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false);
              setFormData({
                name: "",
                description: "",
                price: "",
                status: "Active",
                startDate: "",
                endDate: "",
                category: "",
              });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddService}
            disabled={!formData.name.trim() || !formData.category}
            className="bg-green-600 hover:bg-green-700"
          >
            Add Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <DataTable
        data={services}
        columns={serviceColumns}
        title="Client Services"
        subtitle="Services provided to this client"
        actions={actions}
        selectable={false}
        onSelectionChange={() => {}}
        getRowId={(row) => row.id}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update service information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter service name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter service description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  className="w-full p-2 border rounded-md"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                >
                  <option value="">Select category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                className="w-full p-2 border rounded-md"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                {serviceStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setSelectedService(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  status: "Active",
                  startDate: "",
                  endDate: "",
                  category: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditService}
              disabled={!formData.name.trim() || !formData.category}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
