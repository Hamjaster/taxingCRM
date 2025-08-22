"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import { User, Calendar, FileText } from "lucide-react";

interface OwnerInfoProps {
  client: ClientUser;
}

export function OwnerInfo({ client }: OwnerInfoProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  const maskSSN = (ssn: string) => {
    if (!ssn) return "-";
    return `***-**-${ssn.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                First Name
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.ownerFirstName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">MI</label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.ownerMi)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Name
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.ownerLastName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date of Birth
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {client.ownerDateOfBirth
                  ? new Date(client.ownerDateOfBirth).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                SSN Number
              </label>
              <p className="mt-1 text-gray-900">{maskSSN(client.ownerSsn)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Owner Name Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Owner Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Full Name</h3>
                <p className="text-lg text-blue-900 font-semibold">
                  {[client.ownerFirstName, client.ownerMi, client.ownerLastName]
                    .filter(Boolean)
                    .join(" ") || "No owner information provided"}
                </p>
              </div>
              {client.ownerDateOfBirth && (
                <Badge variant="outline" className="bg-white">
                  Born: {new Date(client.ownerDateOfBirth).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
