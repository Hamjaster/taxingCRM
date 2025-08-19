"use client";

import { ClientUser } from "@/types";

interface EntityInfoTabProps {
  clientUser: ClientUser;
}

export function EntityInfoTab({ clientUser }: EntityInfoTabProps) {
  // Helper function to display value or dash
  const displayValue = (value: string | undefined | null) => value || "-";

  return (
    <div className="space-y-8 bg-white py-5 px-1">
      {/* Entity Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Entity Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Publication Country
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.publicationCountry)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity EIN
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityEin)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Phone
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityPhoneNo)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Email
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityEmailAddress)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Address
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityAddress)}
            </p>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Owner Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              First Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.ownerFirstName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Middle Initial
            </label>
            <p className="text-gray-900">{displayValue(clientUser.ownerMi)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Last Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.ownerLastName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Date of Birth
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.ownerDateOfBirth)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">SSN</label>
            <p className="text-gray-900">
              {clientUser.ownerSsn
                ? `***-**-${clientUser.ownerSsn.slice(-4)}`
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Services and Details */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Services and Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Services to Provide
            </label>
            <p className="text-gray-900">
              {clientUser.servicesToProvide &&
              clientUser.servicesToProvide.length > 0
                ? clientUser.servicesToProvide.join(", ")
                : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Service of Process Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.serviceOfProcessName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Service of Process Address
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.serviceOfProcessAddress)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Registered Agent Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.registeredAgentName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Registered Agent Address
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.registeredAgentAddress)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Publication Details
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.publicationDetails)}
            </p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Street</label>
            <p className="text-gray-900">{displayValue(clientUser.street)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">APT</label>
            <p className="text-gray-900">{displayValue(clientUser.apt)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">City</label>
            <p className="text-gray-900">{displayValue(clientUser.city)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">State</label>
            <p className="text-gray-900">{displayValue(clientUser.state)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
            <p className="text-gray-900">{displayValue(clientUser.zipCode)}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {clientUser.notes && (
        <div className="space-y-4 px-5">
          <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{clientUser.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
