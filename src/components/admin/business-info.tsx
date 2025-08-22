"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Hash,
} from "lucide-react";

interface BusinessInfoProps {
  client: ClientUser;
}

export function BusinessInfo({ client }: BusinessInfoProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  const maskSSN = (ssn: string) => {
    if (!ssn) return "-";
    return `***-**-${ssn.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Business Name
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {displayValue(client.businessName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">EIN</label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                {displayValue(client.ein)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Entity Structure
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.entityStructure)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date Business Formed
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {client.dateBusinessFormed
                  ? new Date(client.dateBusinessFormed).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                S-Election Effective Date
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                {client.sElectionEffectiveDate
                  ? new Date(client.sElectionEffectiveDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Number of Shareholders
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                {displayValue(client.noOfShareholders)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shareholder Information */}
      {client.shareholders && client.shareholders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Shareholder Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {client.shareholders.map((shareholder, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Shareholder #{index + 1}
                    </h4>
                    {shareholder.ownership && (
                      <Badge variant="outline">
                        {shareholder.ownership}% ownership
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {[
                          shareholder.firstName,
                          shareholder.mi,
                          shareholder.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ") || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {shareholder.dateOfBirth
                          ? new Date(
                              shareholder.dateOfBirth
                            ).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        SSN
                      </label>
                      <p className="mt-1 text-gray-900">
                        {maskSSN(shareholder.ssn)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {displayValue(shareholder.phoneNo)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {displayValue(shareholder.email)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Business Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Street Address
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.street)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Apartment/Suite
              </label>
              <p className="mt-1 text-gray-900">{displayValue(client.apt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">City</label>
              <p className="mt-1 text-gray-900">{displayValue(client.city)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">State</label>
              <p className="mt-1 text-gray-900">{displayValue(client.state)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                ZIP Code
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.zipCode)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Notes */}
      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Client Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {client.notes}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
