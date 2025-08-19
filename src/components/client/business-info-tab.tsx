import { ClientUser } from "@/types";

interface BusinessInfoTabProps {
  clientUser: ClientUser;
}

export function BusinessInfoTab({ clientUser }: BusinessInfoTabProps) {
  // Helper function to display value or dash
  const displayValue = (value: string | undefined | null) => value || "-";
  return (
    <div className="space-y-8 bg-white py-5 px-1">
      {/* Business Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Business Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Name</label>
            <p className="text-gray-900">
              {displayValue(clientUser.businessName)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">EIN</label>
            <p className="text-gray-900">{displayValue(clientUser.ein)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Structure
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.entityStructure)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Date Business Formed
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.dateBusinessFormed)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              S Election Effective Date
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.sElectionEffectiveDate)}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              No of Shareholders
            </label>
            <p className="text-gray-900">
              {displayValue(clientUser.noOfShareholders)}
            </p>
          </div>
        </div>
      </div>

      {/* Shareholders */}
      {clientUser.shareholders && clientUser.shareholders.length > 0 && (
        <div className="space-y-4 px-5">
          <h3 className="text-lg font-semibold text-gray-900">Shareholders</h3>
          {clientUser.shareholders.map((shareholder, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                Shareholder #{index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.firstName)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Middle Initial
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.mi)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.lastName)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Date of Birth
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.dateOfBirth)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    SSN
                  </label>
                  <p className="text-gray-900">
                    {shareholder.ssn
                      ? `***-**-${shareholder.ssn.slice(-4)}`
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Phone Number
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.phoneNo)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.email)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">
                    Ownership %
                  </label>
                  <p className="text-gray-900">
                    {displayValue(shareholder.ownership)}
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
    </div>
  );
}
