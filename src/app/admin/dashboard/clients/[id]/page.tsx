"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  clearError,
  fetchClientById,
  updateClientDetails,
} from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, User, Building2, Globe } from "lucide-react";
import { ClientPersonalInfo } from "@/components/admin/client-personal-info";
import { ClientTasks } from "@/components/admin/client-tasks";
import { ClientDocuments } from "@/components/admin/client-documents";
import { ClientNotes } from "@/components/admin/client-notes";
import { BusinessInfo } from "@/components/admin/business-info";
import { EntityInfo } from "@/components/admin/entity-info";
import { OwnerInfo } from "@/components/admin/owner-info";
import { Services } from "@/components/admin/services";
import { RegisteredAgent } from "@/components/admin/registered-agent";
import { Publication } from "@/components/admin/publication";
import { ClientServices } from "@/components/admin/client-services";
import { ClientInvoices } from "@/components/admin/client-invoices";
import { DatePicker } from "@/components/ui/date-picker";
import { EditClientDialog } from "@/components/admin/edit-client-dialog";

interface ClientProfilePageProps {
  params: {
    id: string;
  };
}

export default function ClientProfilePage({ params }: ClientProfilePageProps) {
  const dispatch = useAppDispatch();
  const { selectedClient, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const [activeTab, setActiveTab] = useState("personal-info");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (params.id) {
      dispatch(fetchClientById(params.id));
    }
  }, [dispatch, params.id]);

  useEffect(() => {
    if (selectedClient) {
      setActiveTab(
        selectedClient.clientType === "Individual"
          ? "personal-info"
          : selectedClient.clientType === "Business"
          ? "business-info"
          : "entity-info"
      );
    }
  }, [selectedClient]);

  const handleEditProfile = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdateClient = async (clientId: string, clientData: any) => {
    try {
      await dispatch(
        updateClientDetails({ clientId, updates: clientData })
      ).unwrap();
      // Optionally show success message
      console.log("Client updated successfully");
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  const handleGoBack = () => {
    router.push("/admin/dashboard/clients");
    dispatch(clearError());
  };

  const getClientDisplayName = () => {
    if (!selectedClient) return "";
    return (
      selectedClient.businessName ||
      selectedClient.entityName ||
      `${selectedClient.firstName} ${selectedClient.lastName}`
    );
  };

  const getClientTypeIcon = () => {
    if (!selectedClient) return <User className="h-5 w-5" />;
    switch (selectedClient.clientType.toLowerCase()) {
      case "business":
        return <Building2 className="h-5 w-5" />;
      case "entity":
        return <Globe className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getClientTypeBadgeColor = () => {
    if (!selectedClient) return "bg-gray-100 text-gray-800";
    switch (selectedClient.clientType.toLowerCase()) {
      case "business":
        return "bg-blue-100 text-blue-800";
      case "entity":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 h-[80vh] justify-center items-center">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading client profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error Loading Client</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button variant="outline" onClick={handleGoBack} className="mt-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Client Profile
          </h1>
        </div>
        <Button
          onClick={handleEditProfile}
          className="bg-green-600 hover:bg-green-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>
      {selectedClient && (
        <>
          {/* Client Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        selectedClient.avatar ||
                        "/placeholder.svg?height=64&width=64"
                      }
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-xl font-medium">
                      {selectedClient.businessName
                        ? selectedClient.businessName.charAt(0)
                        : selectedClient.firstName.charAt(0)}
                      {selectedClient.businessName
                        ? selectedClient.businessName.charAt(1)
                        : selectedClient.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {getClientDisplayName()}
                    </h2>
                    <p className="text-gray-600">{selectedClient.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getClientTypeBadgeColor()}>
                        {getClientTypeIcon()}
                        <span className="ml-1">
                          {selectedClient.clientType}
                        </span>
                      </Badge>
                      <Badge
                        className={
                          selectedClient.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedClient.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Client ID: {selectedClient._id}</p>
                  <p>
                    Created:{" "}
                    {new Date(selectedClient.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="flex flex-row  gap-3">
              {selectedClient.clientType === "Individual" && (
                <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              )}
              {selectedClient.clientType === "Business" && (
                <>
                  <TabsTrigger value="business-info">Business Info</TabsTrigger>
                  <TabsTrigger value="service-to-provide">Services</TabsTrigger>
                </>
              )}
              {selectedClient.clientType === "Entity" && (
                <>
                  <TabsTrigger value="entity-info">Entity Info</TabsTrigger>
                  <TabsTrigger value="owner-info">Owner Info</TabsTrigger>
                  <TabsTrigger value="service-to-provide">Services</TabsTrigger>
                  <TabsTrigger value="service-of-process">
                    Service of Process
                  </TabsTrigger>
                  <TabsTrigger value="registered-agent">
                    Registered Agent
                  </TabsTrigger>
                  <TabsTrigger value="publication">Publication</TabsTrigger>
                </>
              )}
              <TabsTrigger value="task">Task</TabsTrigger>

              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="client-notes">Client Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <ClientPersonalInfo client={selectedClient} />
            </TabsContent>

            <TabsContent value="business-info">
              <BusinessInfo client={selectedClient} />
            </TabsContent>

            <TabsContent value="entity-info">
              <EntityInfo client={selectedClient} />
            </TabsContent>

            <TabsContent value="task">
              <ClientTasks clientId={selectedClient._id} />
            </TabsContent>

            <TabsContent value="documents">
              <ClientDocuments client={selectedClient} />
            </TabsContent>

            <TabsContent value="client-notes">
              <ClientNotes
                clientId={selectedClient._id}
                notes={selectedClient.notes || ""}
              />
            </TabsContent>

            <TabsContent value="owner-info">
              <OwnerInfo client={selectedClient} />
            </TabsContent>

            <TabsContent value="service-to-provide">
              <Services client={selectedClient} />
            </TabsContent>

            <TabsContent value="service-of-process">
              <RegisteredAgent client={selectedClient} />
            </TabsContent>

            <TabsContent value="registered-agent">
              <RegisteredAgent client={selectedClient} />
            </TabsContent>

            <TabsContent value="publication">
              <Publication client={selectedClient} />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Edit Client Dialog */}
      {selectedClient && (
        <EditClientDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateClient={handleUpdateClient}
          client={selectedClient}
        />
      )}
    </div>
  );
}
