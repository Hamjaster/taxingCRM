"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import { UserCheck, MapPin, FileText, Building, Users } from "lucide-react";

interface RegisteredAgentProps {
  client: ClientUser;
}

export function RegisteredAgent({ client }: RegisteredAgentProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  const hasRegisteredAgentInfo =
    client.registeredAgentName || client.registeredAgentAddress;
  const hasServiceOfProcessInfo =
    client.serviceOfProcessName || client.serviceOfProcessAddress;

  return (
    <div className="space-y-6">
      {/* Registered Agent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Registered Agent
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasRegisteredAgentInfo ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Agent Name
                </label>
                <p className="mt-1 text-gray-900 font-medium">
                  {displayValue(client.registeredAgentName)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Agent Address
                </label>
                <p className="mt-1 text-gray-900 flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span>{displayValue(client.registeredAgentAddress)}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Registered Agent Information
              </h3>
              <p className="text-gray-600">
                No registered agent has been assigned for this entity.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
