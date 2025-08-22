"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClientUser } from "@/types";
import {
  Newspaper,
  FileText,
  Globe,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface PublicationProps {
  client: ClientUser;
}

export function Publication({ client }: PublicationProps) {
  const displayValue = (value: any) => {
    return value || "-";
  };

  const hasPublicationDetails =
    client.publicationDetails && client.publicationDetails.trim() !== "";
  const hasPublicationCountry =
    client.publicationCountry && client.publicationCountry.trim() !== "";

  return (
    <div className="space-y-6">
      {/* Publication Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Publication Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasPublicationCountry && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-900">
                  Publication Country
                </h3>
              </div>
              <p className="text-blue-800">{client.publicationCountry}</p>
            </div>
          )}

          {hasPublicationDetails ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Publication Details
                </label>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {client.publicationDetails}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Publication Details
              </h3>
              <p className="text-gray-600">
                No publication information has been provided for this entity.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publication Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Publication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-900 mb-2">
                  Publication Requirements
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-800">
                      Publication Country Specified
                    </span>
                    <Badge
                      variant={hasPublicationCountry ? "default" : "outline"}
                      className={
                        hasPublicationCountry
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {hasPublicationCountry ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-800">
                      Publication Details Provided
                    </span>
                    <Badge
                      variant={hasPublicationDetails ? "default" : "outline"}
                      className={
                        hasPublicationDetails
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {hasPublicationDetails ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                {!hasPublicationDetails && !hasPublicationCountry && (
                  <p className="text-sm text-yellow-700 mt-3">
                    Publication information may be required for entity
                    formation. Please ensure all necessary publication
                    requirements are met.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(hasPublicationDetails || hasPublicationCountry) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Publication Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-3">
                Publication Information Complete
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hasPublicationCountry && (
                  <div>
                    <span className="text-sm font-medium text-green-800">
                      Country:
                    </span>
                    <p className="text-green-700">
                      {client.publicationCountry}
                    </p>
                  </div>
                )}
                {hasPublicationDetails && (
                  <div>
                    <span className="text-sm font-medium text-green-800">
                      Details:
                    </span>
                    <p className="text-green-700">
                      {client.publicationDetails.length > 100
                        ? `${client.publicationDetails.substring(0, 100)}...`
                        : client.publicationDetails}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
