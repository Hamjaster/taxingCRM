"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, Plus, MoreVertical } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { CreateClientDialog } from "@/components/admin/create-client-dialog";
import { Client, ClientUser } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchAdminClients,
  createClient,
  updateClientStatus,
} from "@/store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function StatusBadge({ status }: { status: boolean }) {
  if (status) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
      Inactive
    </span>
  );
}

export default function ClientListPage() {
  const dispatch = useAppDispatch();
  const { clients, isLoading, error, hasFetchedClients } = useAppSelector(
    (state) => state.auth
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    console.log("hasFetchedClients", hasFetchedClients);
    if (!hasFetchedClients) {
      dispatch(fetchAdminClients());
      console.log("fetching clients");
    }
  }, [hasFetchedClients, dispatch]);

  // Filter clients based on search query and client type
  const filteredClients = useMemo(() => {
    let filtered = clients;

    // Filter by client type
    if (clientTypeFilter !== "all") {
      filtered = filtered.filter(
        (client) =>
          client.clientType.toLowerCase() === clientTypeFilter.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (client) =>
          client.firstName?.toLowerCase().includes(query) ||
          client.lastName?.toLowerCase().includes(query) ||
          client.spouseFirstName?.toLowerCase().includes(query) ||
          client.businessName?.toLowerCase().includes(query) ||
          client.ssn?.includes(query) ||
          client.phone?.includes(query) ||
          client.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [clients, searchQuery, clientTypeFilter]);

  const handleAddClient = async (clientData: any) => {
    const resultAction = await dispatch(createClient(clientData));
    if (createClient.fulfilled.match(resultAction)) {
      console.log("Client created successfully");
      setIsCreateClientOpen(false);
    } else {
      console.error("Failed to create client:", resultAction.payload);
    }
  };

  const handleToggleClientStatus = async (
    clientId: string,
    currentStatus: "Active" | "Inactive"
  ) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const resultAction = await dispatch(
      updateClientStatus({ clientId, status: newStatus })
    );
    if (updateClientStatus.fulfilled.match(resultAction)) {
      console.log("Client status updated successfully");
    } else {
      console.error("Failed to update client status:", resultAction.payload);
    }
  };

  const columns: Column<ClientUser>[] = [
    {
      key: "taxpayer",
      title: "Taxpayer",
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={row.avatar || "/placeholder.svg?height=32&width=32"}
            />
            <AvatarFallback className="bg-orange-100 text-orange-600 text-sm font-medium">
              {row.businessName
                ? row.businessName.charAt(0)
                : row.firstName.charAt(0)}
              {row.businessName
                ? row.businessName.charAt(1)
                : row.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-gray-900">
            {row.businessName || `${row.firstName} ${row.lastName}`}
          </span>
        </div>
      ),
    },
    {
      key: "spouse",
      title: "Spouse/EIN",
      sortable: true,
      render: (_, row) => (
        <span className="text-gray-600">
          {row.clientType === "Business"
            ? row.ein
            : row.spouseFirstName
            ? `${row.spouseFirstName} ${row.spouseLastName}`
            : "-"}
        </span>
      ),
    },
    {
      key: "ssn",
      title: "SSN",
      render: (_, row) => (
        <span className="text-gray-600">{row.ssn || "-"}</span>
      ),
    },
    {
      key: "phone",
      title: "Phone Number",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value === "Active"} />,
    },
    {
      key: "action",
      title: "Action",
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleToggleClientStatus(row._id, row.status)}
            >
              {row.status === "Active" ? "Deactivate" : "Activate"} Client
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                (window.location.href = `/admin/dashboard/clients/${row._id}`)
              }
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const actions = (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-64 border-gray-200"
        />
      </div>

      <Button
        variant="outline"
        className="gap-2 border-gray-200 bg-transparent"
      >
        <Filter className="h-4 w-4" />
        Filters
      </Button>

      <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
        <SelectTrigger className="w-32 border-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="business">Business</SelectItem>
          <SelectItem value="entity">Entity</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={() => setIsCreateClientOpen(true)}
        className="bg-green-600 hover:bg-green-700 gap-2"
      >
        <Plus className="h-4 w-4" />
        New Client
      </Button>
    </div>
  );

  return (
    <>
      {error && (
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error Loading Clients</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}
      <div className="flex-1 space-y-6 p-6">
        {isLoading && clients.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading clients...</p>
            </div>
          </div>
        ) : (
          <DataTable
            data={filteredClients}
            columns={columns}
            title="Client List"
            subtitle="Manage all Clients here"
            actions={actions}
            selectable={true}
            onSelectionChange={setSelectedRows}
            getRowId={(row) => row._id}
          />
        )}
      </div>

      <CreateClientDialog
        open={isCreateClientOpen}
        onOpenChange={setIsCreateClientOpen}
        onAddClient={handleAddClient}
      />
    </>
  );
}
