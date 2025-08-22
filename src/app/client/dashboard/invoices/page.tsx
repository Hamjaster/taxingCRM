"use client";

import { useState, useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Input } from "@/components/ui/input";
import { Search, Receipt } from "lucide-react";
import { InvoiceStatus } from "@/types";
import {
  fetchInvoices,
  clearError,
  PopulatedInvoice,
} from "@/store/slices/invoiceSlice";

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const getStatusColor = () => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700";
      case "Sent":
        return "bg-blue-100 text-blue-700";
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDotColor = () => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Overdue":
        return "bg-red-500";
      case "Sent":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`}></div>
      {status}
    </span>
  );
}

function InvoiceCard({ invoice }: { invoice: PopulatedInvoice }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="outline-dotted outline-1 border-gray-200 rounded-lg p-6 bg-white">
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
            <span className="text-gray-600 text-sm">
              {formatDate(invoice.issueDate)}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <div className="border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
            <span className="text-gray-600 text-sm">
              {formatDate(invoice.dueDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Service Details Header */}
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-sm font-medium text-gray-700">Service name</div>
        <div className="text-sm font-medium text-gray-700">Total Amount</div>
        <div className="text-sm font-medium text-gray-700">Status</div>
      </div>

      {/* Service Details Row */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="text-sm text-gray-600">
          <div className="font-medium">{invoice.serviceName}</div>
          {invoice.serviceDescription && (
            <div className="text-xs text-gray-500 mt-1">
              {invoice.serviceDescription}
            </div>
          )}
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-medium">
            {formatCurrency(invoice.totalAmount)}
          </div>
          {invoice.amountPaid > 0 && (
            <div className="text-xs text-green-600">
              Paid: {formatCurrency(invoice.amountPaid)}
            </div>
          )}
          {invoice.remainingBalance > 0 && (
            <div className="text-xs text-red-600">
              Balance: {formatCurrency(invoice.remainingBalance)}
            </div>
          )}
        </div>
        <div>
          <StatusBadge status={invoice.status} />
        </div>
      </div>

      {/* Additional Details */}
      {invoice.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-2">Notes</div>
          <div className="text-sm text-gray-600">{invoice.notes}</div>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { invoices, isLoading, error } = useAppSelector(
    (state) => state.invoices
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch invoices for the current client
  useEffect(() => {
    if (user) {
      dispatch(fetchInvoices({}));
    }
  }, [dispatch, user]);

  // Filter invoices based on search query
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) {
      return invoices;
    }

    const query = searchQuery.toLowerCase().trim();
    return invoices.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.serviceName.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query) ||
        invoice.totalAmount.toString().includes(query)
    );
  }, [invoices, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading invoices...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6 text-green-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Invoices</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => dispatch(fetchInvoices({}))}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && invoices.length === 0 && (
        <div className="text-center py-12">
          <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No invoices yet
          </h3>
          <p className="text-gray-500">
            Your invoices will appear here once they are created by your tax
            professional.
          </p>
        </div>
      )}

      {/* Invoices Grid */}
      {!isLoading && !error && filteredInvoices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice._id} invoice={invoice} />
          ))}
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        !error &&
        invoices.length > 0 &&
        filteredInvoices.length === 0 &&
        searchQuery.trim() && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No invoices found matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-green-600 hover:text-green-800 text-sm underline"
            >
              Clear search
            </button>
          </div>
        )}
    </div>
  );
}
