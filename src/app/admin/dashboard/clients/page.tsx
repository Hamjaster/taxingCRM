"use client";

import { useState, useMemo } from "react";
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
import { Search, Filter, Plus } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { CreateClientDialog } from "@/components/admin/create-client-dialog";
import { Client } from "@/types";

const initialClients: Client[] = [
  {
    id: "1",
    firstName: "JOHN",
    lastName: "SMITH",
    spouse: "DEVINA SMITH",
    ssn: "987-65-4321",
    phoneNumber: "631-998-0967",
    status: "Active",
    clientType: "Individual",
  },
  {
    id: "2",
    firstName: "JOHN",
    lastName: "SMITH",
    spouse: "DEVINA SMITH",
    ssn: "987-65-4321",
    phoneNumber: "631-998-0967",
    status: "Inactive",
    clientType: "Individual",
  },
  {
    id: "3",
    firstName: "Jason",
    lastName: "Newman",
    businessName: "Newman Corp",
    ein: "12-3456789",
    ssn: "987-65-4321",
    phoneNumber: "764-88-0923",
    email: "xshjfbksjp@yahoo.com",
    address: "66 Broad Rd, Farmingville",
    status: "Active",
    clientType: "Business",
  },
];

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  if (status === "Active") {
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
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState<string>("all");
  const [isCreateClientOpen, setIsCreateClientOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
          client.firstName.toLowerCase().includes(query) ||
          client.lastName.toLowerCase().includes(query) ||
          client.spouse?.toLowerCase().includes(query) ||
          client.businessName?.toLowerCase().includes(query) ||
          client.ssn.includes(query) ||
          client.phoneNumber.includes(query) ||
          client.email?.toLowerCase().includes(query) ||
          client.status.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [clients, searchQuery, clientTypeFilter]);

  const handleAddClient = (newClient: Omit<Client, "id">) => {
    const client: Client = {
      ...newClient,
      id: Date.now().toString(), // Simple ID generation
    };
    setClients((prev) => [...prev, client]);
  };

  const columns: Column<Client>[] = [
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
      title: "Spouse",
      sortable: true,
      render: (_, row) => (
        <span className="text-gray-600">
          {row.clientType === "Business" ? row.ein : row.spouse || "-"}
        </span>
      ),
    },
    {
      key: "ssn",
      title: "SSN",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "phoneNumber",
      title: "Phone Number",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      key: "status",
      title: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    {
      key: "action",
      title: "Action",
      render: () => (
        <Button
          variant="link"
          className="p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
        >
          Check Details
        </Button>
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
      <div className="flex-1 space-y-6 p-6">
        <DataTable
          data={filteredClients}
          columns={columns}
          title="Client List"
          subtitle="Manage all Clients here"
          actions={actions}
          selectable={true}
          onSelectionChange={setSelectedRows}
          getRowId={(row) => row.id}
        />
      </div>

      <CreateClientDialog
        open={isCreateClientOpen}
        onOpenChange={setIsCreateClientOpen}
        onAddClient={handleAddClient}
      />
    </>
  );
}
