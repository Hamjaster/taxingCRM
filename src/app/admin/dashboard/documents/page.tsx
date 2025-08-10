import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Search, 
  Upload, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  User,
  Building2,
  MoreHorizontal,
  Trash2,
  Edit
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const documents = [
  {
    id: 1,
    name: "Tax Return 2023.pdf",
    type: "Tax Document",
    client: "John Smith",
    clientCompany: "Smith Consulting LLC",
    size: "2.4 MB",
    uploadedBy: "Admin",
    uploadedAt: "2024-01-15",
    status: "Completed",
    category: "Tax Returns"
  },
  {
    id: 2,
    name: "W-2 Form 2023.pdf",
    type: "Income Document",
    client: "Sarah Johnson",
    clientCompany: "TechCorp Industries",
    size: "1.2 MB",
    uploadedBy: "Client",
    uploadedAt: "2024-01-10",
    status: "Under Review",
    category: "Income Documents"
  },
  {
    id: 3,
    name: "Business Expenses Q4.xlsx",
    type: "Expense Report",
    client: "Michael Brown",
    clientCompany: "RetailPlus Inc",
    size: "856 KB",
    uploadedBy: "Client",
    uploadedAt: "2024-01-08",
    status: "Approved",
    category: "Expense Reports"
  },
  {
    id: 4,
    name: "1099-MISC 2023.pdf",
    type: "Income Document",
    client: "Emily Davis",
    clientCompany: "Startup Innovations",
    size: "945 KB",
    uploadedBy: "Admin",
    uploadedAt: "2024-01-05",
    status: "Completed",
    category: "Income Documents"
  },
  {
    id: 5,
    name: "Corporate Tax Filing.pdf",
    type: "Tax Document",
    client: "John Smith",
    clientCompany: "Smith Consulting LLC",
    size: "3.1 MB",
    uploadedBy: "Admin",
    uploadedAt: "2024-01-03",
    status: "Pending Review",
    category: "Tax Returns"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800";
    case "Approved":
      return "bg-blue-100 text-blue-800";
    case "Pending Review":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Tax Returns":
      return "bg-purple-100 text-purple-800";
    case "Income Documents":
      return "bg-green-100 text-green-800";
    case "Expense Reports":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DocumentsPage() {
  const totalDocuments = documents.length;
  const pendingReview = documents.filter(doc => doc.status === "Under Review" || doc.status === "Pending Review").length;
  const completed = documents.filter(doc => doc.status === "Completed").length;
  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size.split(' ')[0]);
    const unit = doc.size.split(' ')[1];
    return sum + (unit === 'MB' ? size : size / 1024);
  }, 0);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Manage all client documents and files in one place.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingReview}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completed}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-bold text-purple-600">{totalSize.toFixed(1)} MB</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Documents</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search documents..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tax">Tax Returns</SelectItem>
                  <SelectItem value="income">Income Documents</SelectItem>
                  <SelectItem value="expense">Expense Reports</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documents.map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{document.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3" />
                        <span>{document.client} - {document.clientCompany}</span>
                      </div>
                      <span>•</span>
                      <span>{document.size}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{document.uploadedBy}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{document.uploadedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getCategoryColor(document.category)}>
                    {document.category}
                  </Badge>
                  <Badge className={getStatusColor(document.status)}>
                    {document.status}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
