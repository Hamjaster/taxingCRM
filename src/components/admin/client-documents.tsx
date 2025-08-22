"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, Column } from "@/components/ui/data-table";
import {
  FileText,
  Upload,
  Receipt,
  Plus,
  Download,
  Eye,
  Trash2,
  FolderOpen,
} from "lucide-react";
import { ClientUser } from "@/types";
import { Documents } from "../ui/documents";
import { mockFolders } from "@/types/constants";
import { ClientInvoices } from "./client-invoices";

interface ClientDocumentsProps {
  client: ClientUser;
}

// Mock data for documents
const mockDocuments = [
  {
    id: "1",
    name: "Tax Return 2023.pdf",
    type: "pdf",
    size: "2.4 MB",
    folder: "2023",
    uploadedAt: "2024-01-15T10:30:00Z",
    uploadedBy: "Admin User",
  },
  {
    id: "2",
    name: "W2 Form.pdf",
    type: "pdf",
    size: "1.2 MB",
    folder: "2023",
    uploadedAt: "2024-01-10T09:15:00Z",
    uploadedBy: "Admin User",
  },
  {
    id: "3",
    name: "Bank Statement.pdf",
    type: "pdf",
    size: "850 KB",
    folder: "2024",
    uploadedAt: "2024-02-01T14:20:00Z",
    uploadedBy: "Admin User",
  },
];

// Mock data for uploads
const mockUploads = [
  {
    id: "1",
    name: "Receipt_001.jpg",
    type: "image",
    size: "1.8 MB",
    folder: "Receipts",
    uploadedAt: "2024-01-20T11:45:00Z",
    notes: "Business dinner receipt",
  },
  {
    id: "2",
    name: "Contract_Amendment.docx",
    type: "doc",
    size: "456 KB",
    folder: "Contracts",
    uploadedAt: "2024-01-18T16:30:00Z",
    notes: "Updated contract terms",
  },
];

// Mock data for invoices
const mockInvoices = [
  {
    id: "INV-001",
    clientName: "John Doe",
    issueDate: "2022-03-01",
    dueDate: "2022-03-15",
    amount: 150,
    status: "Paid",
  },
  {
    id: "INV-002",
    clientName: "John Doe",
    issueDate: "2024-01-15",
    dueDate: "2024-01-30",
    amount: 200,
    status: "Pending",
  },
];

const folders = [
  "2021",
  "2022",
  "2023",
  "2024",
  "Receipts",
  "Contracts",
  "Other",
];

export function ClientDocuments({ client }: ClientDocumentsProps) {
  const [activeDocTab, setActiveDocTab] = useState("documents");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    folder: "",
    notes: "",
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return (
          <img className="w-8 h-8" src="/icons/client/pdf.svg" alt="PDF" />
        );
      case "doc":
        return (
          <img className="w-8 h-8" src="/icons/client/doc.svg" alt="Document" />
        );
      case "image":
        return (
          <img className="w-8 h-8" src="/icons/client/img.svg" alt="Image" />
        );
      default:
        return <FileText className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      Paid: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Overdue: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        className={
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  // Document columns
  const documentColumns: Column<any>[] = [
    {
      key: "name",
      title: "Document Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          {getFileIcon(row.type)}
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.size}</p>
          </div>
        </div>
      ),
    },
    {
      key: "folder",
      title: "Folder",
      render: (value) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "uploadedAt",
      title: "Created at",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Upload columns
  const uploadColumns: Column<any>[] = [
    {
      key: "name",
      title: "File Name",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3 mx-4">
          {getFileIcon(row.type)}
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.size}</p>
          </div>
        </div>
      ),
    },
    {
      key: "folder",
      title: "Folder",
      render: (value) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-blue-500" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "notes",
      title: "Notes",
      render: (value) => (
        <span className="text-sm text-gray-600">{value || "-"}</span>
      ),
    },
    {
      key: "uploadedAt",
      title: "Uploaded",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Invoice columns
  const invoiceColumns: Column<any>[] = [
    {
      key: "id",
      title: "Invoice Number",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-gray-900 mx-4">{value}</span>
      ),
    },
    {
      key: "clientName",
      title: "Client Name",
      render: (value) => value,
    },
    {
      key: "issueDate",
      title: "Issue Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "dueDate",
      title: "Due Date",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "amount",
      title: "Amount ($)",
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => getStatusBadge(value),
    },
  ];

  const handleUpload = () => {
    // TODO: Implement file upload logic
    console.log("Upload file with form:", uploadForm);
    setIsUploadDialogOpen(false);
    setUploadForm({ folder: "", notes: "" });
  };

  const documentsActions = (
    <Button className="bg-green-600 hover:bg-green-700">
      <Plus className="h-4 w-4 mr-2" />
      Create Folder
    </Button>
  );

  const uploadsActions = (
    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document for{" "}
            {client.businessName || `${client.firstName} ${client.lastName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder">For Tax Year</Label>
            <Select
              value={uploadForm.folder}
              onValueChange={(value) =>
                setUploadForm((prev) => ({ ...prev, folder: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder} value={folder}>
                    {folder}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter a notes..."
              value={uploadForm.notes}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsUploadDialogOpen(false);
              setUploadForm({ folder: "", notes: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            className="bg-green-600 hover:bg-green-700"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Tabs
        value={activeDocTab}
        onValueChange={setActiveDocTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="uploads" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Uploads
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <Documents isBordered title="Documents" folders={mockFolders} />
        </TabsContent>

        <TabsContent value="uploads">
          <DataTable
            data={mockUploads}
            columns={uploadColumns}
            title="Uploads"
            subtitle="Files uploaded by client or admin"
            actions={uploadsActions}
            selectable={false}
            onSelectionChange={() => {}}
            getRowId={(row) => row.id}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <ClientInvoices clientId={client._id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
