"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BusinessInfoTab } from "@/components/client/business-info-tab";
import { Documents } from "@/components/ui/documents";
import { mockFolders } from "@/types/constants";

export default function ClientProfilePage() {
  const [activeTab, setActiveTab] = useState<"business" | "documents">(
    "business"
  );

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">See Profile here</p>
      </div>

      {/* Business Badge */}
      <div className="inline-block">
        <span className="px-3 py-2 text-md font-medium text-green-700   border-b-2 border-green-600">
          Business
        </span>
      </div>

      <div className="bg-white border rounded-md   divide-y">
        {/* Profile Header */}
        <div className="flex items-start p-5 justify-between  ">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-medium">
                YC
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                York Coders Inc
              </h2>
              <p className="text-gray-500 mt-1">yorkcoders@gmail.com</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Edit Profile
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2  p-5">
          <Button
            variant={activeTab === "business" ? "default" : "outline"}
            className={
              activeTab === "business" ? "bg-green-600 hover:bg-green-700" : ""
            }
            onClick={() => setActiveTab("business")}
          >
            Business Info.
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
        {activeTab === "business" && <BusinessInfoTab />}
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
