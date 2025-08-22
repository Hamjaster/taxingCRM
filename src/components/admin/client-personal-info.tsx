"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import {
  User,
  Users,
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface ClientPersonalInfoProps {
  client: ClientUser;
}

export function ClientPersonalInfo({ client }: ClientPersonalInfoProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  const maskSSN = (ssn: string) => {
    if (!ssn) return "-";
    return `***-**-${ssn.slice(-4)}`;
  };

  const renderIndividualInfo = () => (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                First Name
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.firstName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">MI</label>
              <p className="mt-1 text-gray-900">{displayValue(client.mi)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Last Name
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.lastName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                SSN Number
              </label>
              <p className="mt-1 text-gray-900">{maskSSN(client.ssn)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {displayValue(client.phone)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {displayValue(client.email)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spouse Information */}
      {(client.spouseFirstName || client.spouseLastName) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Spouse Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  First Name
                </label>
                <p className="mt-1 text-gray-900">
                  {displayValue(client.spouseFirstName)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">MI</label>
                <p className="mt-1 text-gray-900">
                  {displayValue(client.spouseMi)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Last Name
                </label>
                <p className="mt-1 text-gray-900">
                  {displayValue(client.spouseLastName)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  SSN Number
                </label>
                <p className="mt-1 text-gray-900">
                  {maskSSN(client.spouseSSN)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone Number
                </label>
                <p className="mt-1 text-gray-900 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {displayValue(client.spousePhone)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-gray-900 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {displayValue(client.spouseEmail)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dependents Information */}
      {client.dependents && client.dependents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Dependents Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.dependents.map((dependent, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Dependent #{index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        First Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(dependent.firstName)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        MI
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(dependent.mi)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Last Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(dependent.lastName)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        SSN Number
                      </label>
                      <p className="mt-1 text-gray-900">
                        {maskSSN(dependent.ssn)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {displayValue(dependent.phone)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Email
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {displayValue(dependent.email)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Street
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.street)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">APT</label>
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
                Zip Code
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.zipCode)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBusinessInfo = () => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <p className="mt-1 text-gray-900">{displayValue(client.ein)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Date Business Formed
              </label>
              <p className="mt-1 text-gray-900">
                {client.dateBusinessFormed
                  ? new Date(client.dateBusinessFormed).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Election Effective Date
              </label>
              <p className="mt-1 text-gray-900">
                {client.electionEffectiveDate
                  ? new Date(client.electionEffectiveDate).toLocaleDateString()
                  : "-"}
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
                No of Shareholders
              </label>
              <p className="mt-1 text-gray-900">
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
            <div className="space-y-4">
              {client.shareholders.map((shareholder, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Shareholder #{index + 1}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Shareholder Name
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(shareholder.shareholderName)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        SSN/EIN
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(shareholder.ssnEin)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Phone Number
                      </label>
                      <p className="mt-1 text-gray-900 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {displayValue(shareholder.phoneNumber)}
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
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Ownership %
                      </label>
                      <p className="mt-1 text-gray-900">
                        {displayValue(shareholder.ownershipPercentage)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Address */}
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
                Street
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.street)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">APT</label>
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
                Zip Code
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.zipCode)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEntityInfo = () => (
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
                Name of Entity
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {displayValue(client.entityName)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Country
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.country)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">EIN</label>
              <p className="mt-1 text-gray-900">{displayValue(client.ein)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Phone Number
              </label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {displayValue(client.phone)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-gray-900 flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {displayValue(client.email)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <p className="mt-1 text-gray-900">
                {displayValue(client.address)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {client.clientType.toLowerCase() === "individual" &&
        renderIndividualInfo()}
      {client.clientType.toLowerCase() === "business" && renderBusinessInfo()}
      {client.clientType.toLowerCase() === "entity" && renderEntityInfo()}
    </div>
  );
}
