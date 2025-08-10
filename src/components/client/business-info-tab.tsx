export function BusinessInfoTab() {
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
            <p className="text-gray-900">York Coders Inc</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">EIN</label>
            <p className="text-gray-900">12345</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Entity Structure
            </label>
            <p className="text-gray-900">S-Corp</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Date Business Formed
            </label>
            <p className="text-gray-900">4/15/2025</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              S Election Effective Date
            </label>
            <p className="text-gray-900">4/15/2025</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              No of Shareholders
            </label>
            <p className="text-gray-900">2</p>
          </div>
        </div>
      </div>

      {/* Shareholder #1 Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Shareholder #1 Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Shareholder Name
            </label>
            <p className="text-gray-900">John Doe</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">SSN/EIN</label>
            <p className="text-gray-900">123-09-0987</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Phone Number
            </label>
            <p className="text-gray-900">631-998-0966</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <p className="text-gray-900">yorkcodersinc@gmail.com</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Ownership %
            </label>
            <p className="text-gray-900">50</p>
          </div>
        </div>
      </div>

      {/* Shareholder #2 Information */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Shareholder #2 Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Shareholder Name
            </label>
            <p className="text-gray-900">Jason Goldman</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">SSN/EIN</label>
            <p className="text-gray-900">708-09-7634</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Phone Number
            </label>
            <p className="text-gray-900">631-998-0966</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Email</label>
            <p className="text-gray-900">yorkcodersinc@gmail.com</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Ownership %
            </label>
            <p className="text-gray-900">50</p>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4 px-5">
        <h3 className="text-lg font-semibold text-gray-900">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <label className="text-sm text-gray-500 block mb-1">Street</label>
            <p className="text-gray-900">123 Road street</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">APT</label>
            <p className="text-gray-900">Av</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">City</label>
            <p className="text-gray-900">lahore</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">State</label>
            <p className="text-gray-900">Albania</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 block mb-1">Zip Code</label>
            <p className="text-gray-900">2222-222</p>
          </div>
        </div>
      </div>
    </div>
  );
}
