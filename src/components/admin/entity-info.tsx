"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import {
  Globe,
  Building2,
  MapPin,
  Phone,
  Mail,
  Hash,
  FileText,
} from "lucide-react";

interface EntityInfoProps {
  client: ClientUser;
}

export function EntityInfo({ client }: EntityInfoProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  return (
    <div className="space-y-6">
      {/* Entity Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Entity Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Entity Name
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {displayValue(client.entityName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Publication Country
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                {displayValue(client.publicationCountry)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">EIN</label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                {displayValue(client.entityEin)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {displayValue(client.entityPhoneNo)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Email Address
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {displayValue(client.entityEmailAddress)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Entity Address
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {displayValue(client.entityAddress)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
