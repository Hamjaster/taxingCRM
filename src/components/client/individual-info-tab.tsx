"use client";

import { ClientUser } from "@/types";

interface IndividualInfoTabProps {
  clientUser: ClientUser;
}

export function IndividualInfoTab({ clientUser }: IndividualInfoTabProps) {
  // Helper function to display value or dash
  const displayValue = (value: string | undefined | null) => value || "-";

  return (
    <div className="space-y-8 bg-white py-5 px-1">
      {/* Personal Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              First Name
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.firstName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Middle Initial
            </label>
            <p className="text-gray-900">{displayValue(clientUser.mi)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Last Name
            </label>
            <p className="text-gray-900">{displayValue(clientUser.lastName)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Date of Birth
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.dateOfBirth)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">SSN</label>
            <p className="text-gray-900">
              {clientUser.ssn ? `***-**-${clientUser.ssn.slice(-4)}` : "-"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Phone Number
            </label>
            <p className="text-gray-900">{displayValue(clientUser.phone)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <p className="text-gray-900">{displayValue(clientUser.email)}</p>
          </div>
        </div>
      </div>

      {/* Spouse Information */}
      {clientUser.spouse && (
        <div className="space-y-4 px-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Spouse Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                First Name
              </label>
              <p className="text-gray-900">
                {displayValue(clientUser.spouseFirstName)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Middle Initial
              </label>
              <p className="text-gray-900">
                {displayValue(clientUser.spouseMi)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Last Name
              </label>
              <p className="text-gray-900">
                {displayValue(clientUser.spouseLastName)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Date of Birth
              </label>
              <p className="text-gray-900">
                {displayValue(clientUser.spouseDateOfBirth)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">SSN</label>
              <p className="text-gray-900">
                {clientUser.spouseSsn
                  ? `***-**-${clientUser.spouseSsn.slice(-4)}`
                  : "-"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Phone Number
              </label>
              <p className="text-gray-900">
                {displayValue(clientUser.spousePhoneNo)}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Email</label>
              <p className="text-gray-900">
                {displayValue(clientUser.spouseEmail)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dependents */}
      {clientUser.dependents && clientUser.dependents.length > 0 && (
        <div className="space-y-4 px-5">
          <h3 className="text-lg font-semibold text-gray-900">Dependents</h3>
          {clientUser.dependents.map((dependent, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Dependent #{index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900">
                    {displayValue(dependent.firstName)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Middle Initial
                  </label>
                  <p className="text-gray-900">{displayValue(dependent.mi)}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900">
                    {displayValue(dependent.lastName)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {displayValue(dependent.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    SSN
                  </label>
                  <p className="text-gray-900">
                    {dependent.ssn ? `***-**-${dependent.ssn.slice(-4)}` : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {displayValue(dependent.phoneNo)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">
                    {displayValue(dependent.email)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
