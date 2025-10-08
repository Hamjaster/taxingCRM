"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import {
  FolderIcon,
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Upload,
  Download,
  Trash2,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchFolders,
  fetchFolderWithDocuments,
  createFolder,
  updateFolder,
  deleteFolder,
  uploadDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  setCurrentView,
  clearError,
  FolderItem,
  DocumentItem,
  setDownloadUrl,
} from "@/store/slices/documentSlice";
import { Client } from "@/types";
import { createNotification } from "@/lib/utils";
import { typeOfNotification } from "@/contexts/useNotifications";

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <img className="w-16" src="/icons/client/pdf.svg" alt="" />;
    case "doc":
    case "docx":
      return <img className="w-16" src="/icons/client/doc.svg" alt="" />;
    case "image":
      return <img className="w-16" src="/icons/client/img.svg" alt="" />;
    case "xlsx":
    case "xls":
      return <img className="w-16" src="/icons/client/doc.svg" alt="" />;
    default:
      return <img className="w-16" src="/icons/client/doc.svg" alt="" />;
  }
}

function getFolderIcon(folders: FolderItem[], folderName: string) {
  const colors = ["red", "blue", "green", "orange"];
  const folderIndex = folders.findIndex((f) => f.name === folderName);
  const colorClass = colors[folderIndex % colors.length] || "blue";

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        className="w-16"
        src={`/icons/client/${colorClass}-folder.svg`}
        alt={`${folderName} folder`}
      />
    </div>
  );
}

export function Documents({
  isBordered = false,
  title,
  clientId,
  clientInfo,
}: {
  isBordered: boolean;
  title: string;
  clientId?: string;
  clientInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    businessName?: string;
  };
}) {
  const dispatch = useAppDispatch();
  const {
    folders,
    currentFolderDocuments,
    selectedFolder,
    currentView,
    isLoading,
    isCreatingFolder,
    isUploadingDocument,
    error,
    downloadUrl,
    isDownloadingDocument,
    isDeletingDocument,
  } = useAppSelector((state) => state.documents);
  const { user } = useAppSelector((st) => st.auth);

  // Dialog states
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);

  // Form states
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");

  useEffect(() => {
    dispatch(fetchFolders(clientId));
  }, [dispatch, clientId]);

  const handleFolderClick = (folder: FolderItem) => {
    dispatch(fetchFolderWithDocuments(folder._id));
  };

  const handleBackToFolders = () => {
    dispatch(setCurrentView("folders"));
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !clientId) return;

    try {
      await dispatch(
        createFolder({
          name: newFolderName,
          clientId,
          description: newFolderDescription,
        })
      ).unwrap();

      setIsCreateFolderOpen(false);
      setNewFolderName("");
      setNewFolderDescription("");
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !selectedFolder) return;

    try {
      await dispatch(
        uploadDocument({
          file: selectedFile,
          folderId: selectedFolder._id,
          clientId: (selectedFolder.clientId as any)._id,
          description: uploadDescription,
        })
      ).unwrap();

      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadDescription("");
      if (!user?._id || !clientId) return;

      // Prepare email data if client info is available
      const emailData = clientInfo
        ? {
            clientEmail: clientInfo.email,
            clientName:
              clientInfo.businessName ||
              `${clientInfo.firstName} ${clientInfo.lastName}`,
            adminName: `${user.firstName} ${user.lastName}`,
            type: "DOCUMENT_UPLOADED" as const,
            message: `${user?.firstName} (Admin) uploaded a document in ${selectedFolder.name}`,
            additionalData: {
              documentName: selectedFile?.name,
              folderName: selectedFolder.name,
            },
          }
        : undefined;

      createNotification({
        receiverId: clientId,
        senderId: user?._id,
        type: typeOfNotification.DOCUMENT_UPLOADED,
        message: `${user?.firstName} (Admin) uploaded a document in ${selectedFolder.name}`,
        emailData,
      });
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleEditFolder = (folder: FolderItem) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderDescription(folder.description || "");
    setIsEditFolderOpen(true);
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) return;

    try {
      await dispatch(
        updateFolder({
          folderId: editingFolder._id,
          updates: {
            name: newFolderName,
            description: newFolderDescription,
          },
        })
      ).unwrap();

      setIsEditFolderOpen(false);
      setEditingFolder(null);
      setNewFolderName("");
      setNewFolderDescription("");
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleDeleteFolder = async (folder: FolderItem) => {
    if (
      !confirm(
        `Are you sure you want to delete the folder "${folder.name}" and all its documents?`
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteFolder(folder._id)).unwrap();
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleDownloadDocument = async (document: DocumentItem) => {
    try {
      await dispatch(downloadDocument(document._id))
        .unwrap()
        .then((data) => {
          if (data.downloadUrl) {
            console.log("downloadUrl PRINTED", data.downloadUrl);
            // trigger browser download
            const link = window.document.createElement("a");
            link.href = data.downloadUrl;
            link.setAttribute("download", data.fileName);
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);
          }
        });
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleDeleteDocument = async (document: DocumentItem) => {
    if (!confirm(`Are you sure you want to delete "${document.name}"?`)) {
      return;
    }

    try {
      await dispatch(deleteDocument(document._id)).unwrap();
    } catch (error) {
      // Error handled by Redux
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  // Documents view
  if (currentView === "documents" && selectedFolder) {
    return (
      <div className={` ${isBordered ? "border rounded-lg" : ""} bg-white p-5`}>
        {/* Error display */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
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

        {/* Header with back button */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToFolders}
              className="p-1"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedFolder.name}
            </h3>
            <span className="text-sm text-gray-500">
              ({currentFolderDocuments.length} documents)
            </span>
          </div>
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={isUploadingDocument}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploadingDocument ? "Uploading..." : "Upload Documents"}
          </Button>
        </div>

        {/* Documents Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : currentFolderDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              No documents in this folder yet
            </div>
            {/* <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload First Document
            </Button> */}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
            {currentFolderDocuments.map((document) => (
              <div
                key={document._id}
                className="relative flex p-6 space-y-5 border rounded-lg shadow-sm flex-col items-start group"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      disabled={isDownloadingDocument}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDownloadDocument(document);
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloadingDocument ? "Downloading..." : "Download"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={isDeletingDocument}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDeleteDocument(document);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeletingDocument ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative">{getFileIcon(document.fileType)}</div>
                <div className="text-start w-full">
                  <h4
                    className="text-sm font-medium text-gray-900 truncate"
                    title={document.name}
                  >
                    {document.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(document.size)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(document.createdAt)}
                  </p>
                  {document.description && (
                    <p
                      className="text-xs text-gray-400 mt-1 truncate"
                      title={document.description}
                    >
                      {document.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Document Dialog */}
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a document to {selectedFolder.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.xls,.xlsx"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-500">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a description for this document..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploadingDocument}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadDocument}
                disabled={!selectedFile || isUploadingDocument}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploadingDocument ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Folders view
  return (
    <div className={` ${isBordered ? "border rounded-lg" : ""} bg-white p-5`}>
      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
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

      {/* Header */}
      <div className="flex items-center justify-between py-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {title || "Documents"}
        </h3>
        {clientId && (
          <Button
            onClick={() => setIsCreateFolderOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            disabled={isCreatingFolder}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreatingFolder ? "Creating..." : "Create Folder"}
          </Button>
        )}
      </div>

      {/* Folders Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No folders created yet</div>
          {clientId && (
            <Button
              onClick={() => setIsCreateFolderOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Folder
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
          {folders.map((folder) => (
            <div
              key={folder._id}
              className="relative flex p-6 space-y-5 border rounded-lg shadow-sm flex-col items-start group cursor-pointer"
              onClick={() => handleFolderClick(folder)}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleEditFolder(folder);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDeleteFolder(folder);
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative">
                {getFolderIcon(folders, folder.name)}
              </div>
              <div className="text-start w-full">
                <h4
                  className="text-sm font-medium text-gray-900 truncate"
                  title={folder.name}
                >
                  {folder.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {folder.documentCount || 0} documents
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(folder.createdAt)}
                </p>
                {folder.description && (
                  <p
                    className="text-xs text-gray-400 mt-1 truncate"
                    title={folder.description}
                  >
                    {folder.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Dialog */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder to organize documents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="folderDescription">Description (Optional)</Label>
              <Textarea
                id="folderDescription"
                placeholder="Enter folder description..."
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateFolderOpen(false)}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim() || isCreatingFolder}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreatingFolder ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
            <DialogDescription>Update folder details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="editFolderName">Folder Name</Label>
              <Input
                id="editFolderName"
                placeholder="Enter folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="editFolderDescription">
                Description (Optional)
              </Label>
              <Textarea
                id="editFolderDescription"
                placeholder="Enter folder description..."
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditFolderOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateFolder}
              disabled={!newFolderName.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Update Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
