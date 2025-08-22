"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Receipt,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Edit,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import { DataTable, Column } from "@/components/ui/data-table";
import { InvoiceStatus, CreateInvoiceData, UpdateInvoiceData } from "@/types";
import {
  fetchClientInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  setFilters,
  clearError,
  PopulatedInvoice,
} from "@/store/slices/invoiceSlice";

interface ClientInvoicesProps {
  clientId: string;
}

export function ClientInvoices({ clientId }: ClientInvoicesProps) {
  const dispatch = useAppDispatch();
  const {
    invoices,
    isLoading,
    error,
    filters,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAppSelector((state) => state.invoices);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<PopulatedInvoice | null>(null);

  // Form data for create/edit invoice
  const [formData, setFormData] = useState<
    Partial<CreateInvoiceData & UpdateInvoiceData>
  >({
    serviceName: "",
    serviceDescription: "",
    dueDate: new Date(),
    totalAmount: 0,
    status: "Draft",
  });

  // Fetch invoices for this client
  useEffect(() => {
    dispatch(fetchClientInvoices(clientId));
  }, [dispatch, clientId]);

  const handleCreateInvoice = async () => {
    if (!formData.serviceName || !formData.dueDate || !formData.totalAmount) {
      return;
    }

    try {
      await dispatch(
        createInvoice({
          ...formData,
          clientId,
        } as CreateInvoiceData)
      ).unwrap();

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err) {
      // Error is handled by Redux slice
    }
  };

  const handleUpdateInvoice = async () => {
    if (!selectedInvoice) return;

    try {
      await dispatch(
        updateInvoice({
          invoiceId: selectedInvoice._id,
          updates: formData as UpdateInvoiceData,
        })
      ).unwrap();

      setIsEditDialogOpen(false);
      setSelectedInvoice(null);
      resetForm();
    } catch (err) {
      // Error is handled by Redux slice
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      await dispatch(deleteInvoice(invoiceId)).unwrap();
    } catch (err) {
      // Error is handled by Redux slice
    }
  };

  const resetForm = () => {
    setFormData({
      serviceName: "",
      serviceDescription: "",
      dueDate: new Date(),
      totalAmount: 0,
      status: "Draft",
    });
  };

  const openEditDialog = (invoice: PopulatedInvoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      serviceName: invoice.serviceName,
      serviceDescription: invoice.serviceDescription,
      dueDate: new Date(invoice.dueDate),
      totalAmount: invoice.totalAmount,
      status: invoice.status,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadgeColor = (status: InvoiceStatus) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Sent":
        return "bg-blue-100 text-blue-800";
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleStatusFilterChange = (status: string) => {
    dispatch(
      setFilters({
        ...filters,
        status: status === "all" ? "all" : (status as InvoiceStatus),
      })
    );
  };

  const filteredInvoices = invoices.filter(
    (invoice) => filters.status === "all" || invoice.status === filters.status
  );

  const columns: Column<PopulatedInvoice>[] = [
    {
      key: "invoiceNumber",
      title: "Invoice #",
      render: (value, invoice) => (
        <div className="font-medium">{invoice.invoiceNumber}</div>
      ),
    },
    {
      key: "serviceName",
      title: "Service",
      render: (value, invoice) => (
        <div>
          <div className="font-medium">{invoice.serviceName}</div>
          {invoice.serviceDescription && (
            <div className="text-sm text-gray-500 truncate max-w-48">
              {invoice.serviceDescription}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "totalAmount",
      title: "Amount",
      render: (value, invoice) => (
        <div>
          <div className="font-medium">
            {formatCurrency(invoice.totalAmount)}
          </div>

        </div>
      ),
    },
    {
      key: "issueDate",
      title: "Issue Date",
      render: (value, invoice) => formatDate(invoice.issueDate),
    },
    {
      key: "dueDate",
      title: "Due Date",
      render: (value, invoice) => formatDate(invoice.dueDate),
    },
    {
      key: "status",
      title: "Status",
      render: (value, invoice) => (
        <Badge className={getStatusBadgeColor(invoice.status)}>
          {invoice.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value, invoice) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(invoice)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteInvoice(invoice._id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
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
        onValueChange={handleStatusFilterChange}
      >
        <SelectTrigger className="w-32 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
          <SelectItem value="Sent">Sent</SelectItem>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Overdue">Overdue</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={() => setIsCreateDialogOpen(true)}
        className="bg-green-600 hover:bg-green-700"
        disabled={isCreating}
      >
        <Plus className="h-4 w-4 mr-2" />
        {isCreating ? "Creating..." : "Create Invoice"}
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Client Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        data={filteredInvoices}
        columns={columns}
        title={`Client Invoices (${filteredInvoices.length})`}
        subtitle="Invoices for this client"
        actions={actions}
        selectable={false}
        getRowId={(row) => row._id}
      />

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Create a new invoice for this client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceName" className="text-right">
                Service Name *
              </Label>
              <Input
                id="serviceName"
                value={formData.serviceName}
                onChange={(e) =>
                  setFormData({ ...formData, serviceName: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., Tax Preparation"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="serviceDescription"
                value={formData.serviceDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceDescription: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="Service description..."
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subtotal" className="text-right">
                Amount *
              </Label>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date *
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: new Date(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
       
           
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateInvoice}
              className="bg-green-600 hover:bg-green-700"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invoice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Update invoice details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editServiceName" className="text-right">
                Service Name *
              </Label>
              <Input
                id="editServiceName"
                value={formData.serviceName}
                onChange={(e) =>
                  setFormData({ ...formData, serviceName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editServiceDescription" className="text-right">
                Description
              </Label>
              <Textarea
                id="editServiceDescription"
                value={formData.serviceDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceDescription: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editSubtotal" className="text-right">
                Amount *
              </Label>
              <Input
                id="editSubtotal"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                        totalAmount: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editDueDate" className="text-right">
                Due Date *
              </Label>
              <Input
                id="editDueDate"
                type="date"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: new Date(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editStatus" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as InvoiceStatus })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateInvoice}
              className="bg-green-600 hover:bg-green-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
