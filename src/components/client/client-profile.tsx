"use client";

import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, User, Building, Globe } from "lucide-react";
import { ClientUser } from "@/types";

export function ClientProfile() {
  const { user, role } = useAppSelector((state) => state.auth);
  const clientUser = role === "client" ? (user as ClientUser) : null;

  if (!clientUser) {
    return (
      <div className="space-y-6 bg-white shadow-sm border p-6 rounded-xl">
        <div className="text-center text-gray-500">
          Loading client information...
        </div>
      </div>
    );
  }

  // Helper function to display value or dash
  const displayValue = (value: string | undefined | null) => value || "-";

  // Generate initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Build full address
  const buildAddress = () => {
    const parts = [
      clientUser.street,
      clientUser.apt && `Apt ${clientUser.apt}`,
      clientUser.city,
      clientUser.state,
      clientUser.zipCode,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  return (
    <div className="space-y-6 bg-white shadow-sm border p-6 rounded-xl">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={clientUser.avatar || clientUser.profileImage} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-medium">
              {getInitials(clientUser.firstName, clientUser.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {clientUser.firstName} {clientUser.mi && `${clientUser.mi}. `}
              {clientUser.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {clientUser.clientType === "Individual" && (
                <User className="h-4 w-4 text-gray-500" />
              )}
              {clientUser.clientType === "Business" && (
                <Building className="h-4 w-4 text-gray-500" />
              )}
              {clientUser.clientType === "Entity" && (
                <Globe className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-gray-500">{clientUser.clientType}</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 ml-2">
                {clientUser.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="space-y-4">
        {/* Address Card */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0" />
          <div className="h-5 w-0.5 bg-gray-300"></div>
          <p className="text-gray-700">{buildAddress()}</p>
        </div>

        {/* Phone and Email Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
            <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-gray-300"></div>
            <p className="text-gray-700">{displayValue(clientUser.phone)}</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-gray-300"></div>
            <p className="text-gray-700">{displayValue(clientUser.email)}</p>
          </div>
        </div>

        {/* Additional Info based on client type */}
        {clientUser.clientType === "Individual" && clientUser.ssn && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-blue-300"></div>
            <div>
              <p className="text-sm text-blue-600 font-medium">SSN</p>
              <p className="text-blue-700">***-**-{clientUser.ssn.slice(-4)}</p>
            </div>
          </div>
        )}

        {clientUser.clientType === "Business" && clientUser.businessName && (
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
            <Building className="h-5 w-5 text-purple-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-purple-300"></div>
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Business Name
              </p>
              <p className="text-purple-700">{clientUser.businessName}</p>
            </div>
          </div>
        )}

        {clientUser.clientType === "Entity" && clientUser.entityName && (
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
            <Globe className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-orange-300"></div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Entity Name</p>
              <p className="text-orange-700">{clientUser.entityName}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
