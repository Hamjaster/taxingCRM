"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import { Settings, CheckCircle, FileText, Briefcase } from "lucide-react";

interface ServicesProps {
  client: ClientUser;
}

export function Services({ client }: ServicesProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  // All available services
  const allServices = [
    "LLC Formation",
    "Registered Agent",
    "Corporate Minutes",
    "Incorporation",
    "Service of Process",
    "Biennial Statement",
    "EIN Application",
    "LLC Publication",
    "Amendments",
    "Partnership Contract",
    "DBA Application",
  ];

  const selectedServices = client.servicesToProvide || [];

  return (
    <div className="space-y-6">
      {/* Services to Provide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Services to Provide
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <div
                    key={service}
                    className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
                      isSelected
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50 opacity-50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isSelected ? "text-green-800" : "text-gray-500"
                      }`}
                    >
                      {service}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Services Selected
              </h3>
              <p className="text-gray-600">
                No services have been selected for this client.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
