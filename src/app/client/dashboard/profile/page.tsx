"use client";

import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Documents } from "@/components/ui/documents";
import { BusinessInfoTab } from "@/components/client/business-info-tab";
import { IndividualInfoTab } from "@/components/client/individual-info-tab";
import { EntityInfoTab } from "@/components/client/entity-info-tab";
import { mockFolders } from "@/types/constants";
import { ClientUser } from "@/types";
import { User, Building, Globe } from "lucide-react";

export default function ClientProfilePage() {
  const { user, role } = useAppSelector((state) => state.auth);
  const clientUser = role === "client" ? (user as ClientUser) : null;
  const [activeTab, setActiveTab] = useState<"info" | "documents">("info");

  if (!clientUser) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="text-center text-gray-500">
          Loading profile information...
        </div>
      </div>
    );
  }

  // Generate initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getClientTypeIcon = () => {
    switch (clientUser.clientType) {
      case "Individual":
        return <User className="h-5 w-5" />;
      case "Business":
        return <Building className="h-5 w-5" />;
      case "Entity":
        return <Globe className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getClientTypeColor = () => {
    switch (clientUser.clientType) {
      case "Individual":
        return "text-blue-700 border-b-2 border-blue-600";
      case "Business":
        return "text-purple-700 border-b-2 border-purple-600";
      case "Entity":
        return "text-orange-700 border-b-2 border-orange-600";
      default:
        return "text-blue-700 border-b-2 border-blue-600";
    }
  };

  const renderInfoTab = () => {
    switch (clientUser.clientType) {
      case "Individual":
        return <IndividualInfoTab clientUser={clientUser} />;
      case "Business":
        return <BusinessInfoTab clientUser={clientUser} />;
      case "Entity":
        return <EntityInfoTab clientUser={clientUser} />;
      default:
        return <IndividualInfoTab clientUser={clientUser} />;
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your profile information
        </p>
      </div>

      {/* Client Type Badge */}
      <div className="inline-block">
        <span
          className={`px-3 py-2 text-md font-medium flex items-center gap-2 ${getClientTypeColor()}`}
        >
          {getClientTypeIcon()}
          {clientUser.clientType}
        </span>
      </div>

      <div className="bg-white border rounded-md divide-y">
        {/* Profile Header */}
        <div className="flex items-start p-5 justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={clientUser.avatar || clientUser.profileImage} />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
                {getInitials(clientUser.firstName, clientUser.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {clientUser.businessName ||
                  clientUser.entityName ||
                  `${clientUser.firstName} ${clientUser.lastName}`}
              </h2>
              <p className="text-gray-500 mt-1">{clientUser.email}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mt-2">
                {clientUser.status}
              </span>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Edit Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-5">
          <Button
            variant={activeTab === "info" ? "default" : "outline"}
            className={
              activeTab === "info" ? "bg-green-600 hover:bg-green-700" : ""
            }
            onClick={() => setActiveTab("info")}
          >
            {clientUser.clientType} Info
          </Button>
          <Button
            variant={activeTab === "documents" ? "default" : "outline"}
            className={
              activeTab === "documents" ? "bg-green-600 hover:bg-green-700" : ""
            }
            onClick={() => setActiveTab("documents")}
          >
            Documents
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "info" && renderInfoTab()}
        {activeTab === "documents" && (
          <Documents
            title="Documentations"
            folders={mockFolders}
            isBordered={false}
          />
        )}
      </div>
    </div>
  );
}
