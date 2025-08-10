"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  serviceName: string;
  price: number;
  status: "Paid" | "Due";
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Due",
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Paid",
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Paid",
  },
  {
    id: "4",
    invoiceNumber: "INV-002",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Paid",
  },
  {
    id: "5",
    invoiceNumber: "INV-003",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Paid",
  },
  {
    id: "6",
    invoiceNumber: "INV-001",
    issueDate: "2025-03-01",
    dueDate: "2025-03-05",
    serviceName: "EIN Application",
    price: 100,
    status: "Due",
  },
];

function StatusBadge({ status }: { status: "Paid" | "Due" }) {
  if (status === "Paid") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
      Due
    </span>
  );
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  return (
    <div className="  outline-dotted outline-1 border-gray-200 rounded-lg p-6 bg-white">
      {/* Invoice Number Header */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Invoice Number
        </h3>
        <p className="text-gray-600">{invoice.invoiceNumber}</p>
      </div>

      {/* Date Fields */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Issue Date
          </label>
          <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
            <span className="text-gray-600 text-sm">{invoice.issueDate}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
            <span className="text-gray-600 text-sm">{invoice.dueDate}</span>
          </div>
        </div>
      </div>

      {/* Service Details Header */}
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-sm font-medium text-gray-700">Service name</div>
        <div className="text-sm font-medium text-gray-700">Price</div>
        <div className="text-sm font-medium text-gray-700">Status</div>
      </div>

      {/* Service Details Row */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-sm text-gray-600">{invoice.serviceName}</div>
        <div className="text-sm text-gray-600">${invoice.price}</div>
        <div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter invoices based on search query
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockInvoices;
    }

    const query = searchQuery.toLowerCase().trim();
    return mockInvoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.serviceName.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query) ||
        invoice.price.toString().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
      </div>

      {/* No Results Message */}
      {filteredInvoices.length === 0 && searchQuery.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No invoices found matching "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
