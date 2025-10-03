"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Plus, Upload } from "lucide-react";
import { ClientUser } from "@/types";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateClient: (clientId: string, clientData: any) => void;
  client: ClientUser | null;
}

type ClientType = "Individual" | "Business" | "Entity";
type IndividualTabType =
  | "taxpayer"
  | "spouse"
  | "dependent"
  | "address"
  | "clientNote";
type BusinessTabType =
  | "businessInfo"
  | "address"
  | "shareholders"
  | "clientNote";
type EntityTabType =
  | "entityInfo"
  | "ownerInfo"
  | "serviceToProvide"
  | "serviceOfProcess"
  | "registeredAgent"
  | "publication"
  | "clientNote";

interface Shareholder {
  ownership: string;
  firstName: string;
  mi: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  phoneNo: string;
  email: string;
}

interface FormData {
  clientType: ClientType;
  // Individual fields
  firstName: string;
  mi: string;
  lastName: string;
  dateOfBirth: string;
  ssn: string;
  phoneNo: string;
  email: string;
  status: string;
  profileImage?: string;
  // Spouse fields
  spouseFirstName: string;
  spouseMi: string;
  spouseLastName: string;
  spouseDateOfBirth: string;
  spouseSsn: string;
  spousePhoneNo: string;
  spouseEmail: string;
  // Dependent fields
  dependents: Array<{
    firstName: string;
    mi: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phoneNo: string;
    email: string;
  }>;
  // Business fields
  businessName: string;
  ein: string;
  entityStructure: string;
  dateBusinessFormed: string;
  sElectionEffectiveDate: string;
  noOfShareholders: string;
  shareholders: Shareholder[];
  // Address fields
  street: string;
  apt: string;
  city: string;
  state: string;
  zipCode: string;
  // Notes
  notes: string;
  // Entity fields
  entityName: string;
  publicationCountry: string;
  entityEin: string;
  entityPhoneNo: string;
  entityEmailAddress: string;
  entityAddress: string;

  // Owner Info fields
  ownerFirstName: string;
  ownerMi: string;
  ownerLastName: string;
  ownerDateOfBirth: string;
  ownerSsn: string;

  // Service fields
  servicesToProvide: string[];
  serviceOfProcessName: string;
  serviceOfProcessAddress: string;
  registeredAgentName: string;
  registeredAgentAddress: string;
  publicationDetails: string;
}

const initialFormData: FormData = {
  clientType: "Individual",
  firstName: "",
  mi: "",
  lastName: "",
  dateOfBirth: "",
  ssn: "",
  phoneNo: "",
  email: "",
  status: "Active",
  spouseFirstName: "",
  spouseMi: "",
  spouseLastName: "",
  spouseDateOfBirth: "",
  spouseSsn: "",
  spousePhoneNo: "",
  spouseEmail: "",
  dependents: [],
  businessName: "",
  ein: "",
  entityStructure: "",
  dateBusinessFormed: "",
  sElectionEffectiveDate: "",
  noOfShareholders: "1",
  shareholders: [
    {
      ownership: "",
      firstName: "",
      mi: "",
      lastName: "",
      dateOfBirth: "",
      ssn: "",
      phoneNo: "",
      email: "",
    },
  ],
  street: "",
  apt: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
  // Entity fields
  entityName: "",
  publicationCountry: "",
  entityEin: "",
  entityPhoneNo: "",
  entityEmailAddress: "",
  entityAddress: "",

  // Owner Info fields
  ownerFirstName: "",
  ownerMi: "",
  ownerLastName: "",
  ownerDateOfBirth: "",
  ownerSsn: "",

  // Service fields
  servicesToProvide: [],
  serviceOfProcessName: "",
  serviceOfProcessAddress: "",
  registeredAgentName: "",
  registeredAgentAddress: "",
  publicationDetails: "",
};

export function EditClientDialog({
  open,
  onOpenChange,
  onUpdateClient,
  client,
}: EditClientDialogProps) {
  const [activeTab, setActiveTab] = useState<
    IndividualTabType | BusinessTabType | EntityTabType
  >("taxpayer");
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Populate form data when client changes
  useEffect(() => {
    if (client) {
      const populatedData: FormData = {
        clientType: client.clientType as ClientType,
        firstName: client.firstName || "",
        mi: client.mi || "",
        lastName: client.lastName || "",
        dateOfBirth: client.dateOfBirth || "",
        ssn: client.ssn || "",
        phoneNo: client.phone || "",
        email: client.email || "",
        status: client.status || "Active",
        profileImage: client.avatar || "",
        spouseFirstName: client.spouseFirstName || "",
        spouseMi: client.spouseMi || "",
        spouseLastName: client.spouseLastName || "",
        spouseDateOfBirth: client.spouseDateOfBirth || "",
        spouseSsn: client.spouseSsn || "",
        spousePhoneNo: client.spousePhoneNo || "",
        spouseEmail: client.spouseEmail || "",
        dependents: client.dependents || [],
        businessName: client.businessName || "",
        ein: client.ein || "",
        entityStructure: client.entityStructure || "",
        dateBusinessFormed: client.dateBusinessFormed || "",
        sElectionEffectiveDate: client.sElectionEffectiveDate || "",
        noOfShareholders: client.noOfShareholders || "1",
        shareholders: client.shareholders || [
          {
            ownership: "",
            firstName: "",
            mi: "",
            lastName: "",
            dateOfBirth: "",
            ssn: "",
            phoneNo: "",
            email: "",
          },
        ],
        street: client.street || "",
        apt: client.apt || "",
        city: client.city || "",
        state: client.state || "",
        zipCode: client.zipCode || "",
        notes: client.notes || "",
        entityName: client.entityName || "",
        publicationCountry: client.publicationCountry || "",
        entityEin: client.entityEin || "",
        entityPhoneNo: client.entityPhoneNo || "",
        entityEmailAddress: client.entityEmailAddress || "",
        entityAddress: client.entityAddress || "",
        ownerFirstName: client.ownerFirstName || "",
        ownerMi: client.ownerMi || "",
        ownerLastName: client.ownerLastName || "",
        ownerDateOfBirth: client.ownerDateOfBirth || "",
        ownerSsn: client.ownerSsn || "",
        servicesToProvide: client.servicesToProvide || [],
        serviceOfProcessName: client.serviceOfProcessName || "",
        serviceOfProcessAddress: client.serviceOfProcessAddress || "",
        registeredAgentName: client.registeredAgentName || "",
        registeredAgentAddress: client.registeredAgentAddress || "",
        publicationDetails: client.publicationDetails || "",
      };

      setFormData(populatedData);

      // Set active tab based on client type
      if (client.clientType === "Business") {
        setActiveTab("businessInfo");
      } else if (client.clientType === "Entity") {
        setActiveTab("entityInfo");
      } else {
        setActiveTab("taxpayer");
      }
    }
  }, [client]);

  const handleClose = () => {
    setFormData(initialFormData);
    setActiveTab("taxpayer");
    onOpenChange(false);
  };

  const handleClientTypeChange = (clientType: ClientType) => {
    setFormData((prev) => ({ ...prev, clientType }));
    // Reset active tab based on client type
    if (clientType === "Business") {
      setActiveTab("businessInfo");
    } else if (clientType === "Entity") {
      setActiveTab("entityInfo");
    } else {
      setActiveTab("taxpayer");
    }
  };

  const getTabsForClientType = (): Array<{ id: string; label: string }> => {
    if (formData.clientType === "Business") {
      return [
        { id: "businessInfo", label: "Business Info." },
        { id: "address", label: "Address" },
        { id: "shareholders", label: "Shareholders" },
        { id: "clientNote", label: "Client Note" },
      ];
    } else if (formData.clientType === "Entity") {
      return [
        { id: "entityInfo", label: "Entity Info." },
        { id: "ownerInfo", label: "Owner Info" },
        { id: "serviceToProvide", label: "Service to Provide" },
        { id: "serviceOfProcess", label: "Service of Process" },
        { id: "registeredAgent", label: "Registered Agent" },
        { id: "publication", label: "Publication" },
        { id: "clientNote", label: "Client Note" },
      ];
    }
    return [
      { id: "taxpayer", label: "Tax payer" },
      { id: "spouse", label: "Spouse" },
      { id: "dependent", label: "Dependent" },
      { id: "address", label: "Address" },
      { id: "clientNote", label: "Client Note" },
    ];
  };

  const handleNext = () => {
    const tabs = getTabsForClientType();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id as any);
    }
  };

  const handleBack = () => {
    const tabs = getTabsForClientType();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id as any);
    }
  };

  const handleSubmit = () => {
    if (!client) return;

    // Validate required fields before submission
    const validateRequiredFields = () => {
      const errors: string[] = [];

      if (formData.clientType === "Business") {
        if (!formData.businessName.trim())
          errors.push("Business Name is required");
        if (!formData.shareholders[0]?.firstName?.trim())
          errors.push("Shareholder First Name is required");
        if (!formData.shareholders[0]?.lastName?.trim())
          errors.push("Shareholder Last Name is required");
        if (!formData.shareholders[0]?.phoneNo?.trim())
          errors.push("Shareholder Phone Number is required");
        if (!formData.shareholders[0]?.email?.trim())
          errors.push("Login Email is required");
      } else if (formData.clientType === "Entity") {
        if (!formData.entityName.trim()) errors.push("Entity Name is required");
        if (!formData.phoneNo.trim())
          errors.push("Entity Phone Number is required");
        if (!formData.email.trim()) errors.push("Login Email is required");
        if (!formData.ownerFirstName.trim())
          errors.push("Owner First Name is required");
        if (!formData.ownerLastName.trim())
          errors.push("Owner Last Name is required");
      } else {
        if (!formData.firstName.trim()) errors.push("First Name is required");
        if (!formData.lastName.trim()) errors.push("Last Name is required");
        if (!formData.phoneNo.trim()) errors.push("Phone Number is required");
        if (!formData.email.trim()) errors.push("Login Email is required");
      }

      if (errors.length > 0) {
        alert("Please fill in all required fields:\n" + errors.join("\n"));
        return false;
      }
      return true;
    };

    if (!validateRequiredFields()) {
      return;
    }

    // Create client object that matches API expectations
    let updatedClient: any;

    if (formData.clientType === "Business") {
      updatedClient = {
        firstName: formData.businessName.split(" ")[0] || "Business",
        lastName:
          formData.businessName.split(" ").slice(1).join(" ") || "Client",
        email: formData.shareholders[0]?.email || "business@example.com",
        phone: formData.shareholders[0]?.phoneNo || "",
        clientType: "Business",
        businessName: formData.businessName,
        ein: formData.ein,
        ssn: formData.ein, // Use EIN as SSN for business
        address: `${formData.street} ${formData.apt}, ${formData.city}`.trim(),
        // Additional business fields
        entityStructure: formData.entityStructure,
        dateBusinessFormed: formData.dateBusinessFormed,
        sElectionEffectiveDate: formData.sElectionEffectiveDate,
        noOfShareholders: formData.noOfShareholders,
        shareholders: formData.shareholders,
        street: formData.street,
        apt: formData.apt,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        notes: formData.notes,
        status: formData.status,
      };
    } else if (formData.clientType === "Entity") {
      updatedClient = {
        firstName: formData.entityName.split(" ")[0] || "Entity",
        lastName:
          formData.entityName.split(" ").slice(1).join(" ") || "Formation",
        email: formData.email || "entity@example.com",
        phone: formData.phoneNo || "",
        clientType: "Entity",
        ssn: formData.entityEin || formData.ownerSsn,
        address: formData.entityAddress,
        // Additional entity fields
        entityName: formData.entityName,
        publicationCountry: formData.publicationCountry,
        entityEin: formData.entityEin,
        ownerFirstName: formData.ownerFirstName,
        ownerMi: formData.ownerMi,
        ownerLastName: formData.ownerLastName,
        ownerDateOfBirth: formData.ownerDateOfBirth,
        ownerSsn: formData.ownerSsn,
        servicesToProvide: formData.servicesToProvide,
        serviceOfProcessName: formData.serviceOfProcessName,
        serviceOfProcessAddress: formData.serviceOfProcessAddress,
        registeredAgentName: formData.registeredAgentName,
        registeredAgentAddress: formData.registeredAgentAddress,
        publicationDetails: formData.publicationDetails,
        notes: formData.notes,
        status: formData.status,
      };
    } else {
      updatedClient = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNo,
        clientType: "Individual",
        ssn: formData.ssn,
        address: `${formData.street} ${formData.apt}, ${formData.city}`.trim(),
        // Additional individual fields
        mi: formData.mi,
        dateOfBirth: formData.dateOfBirth,
        profileImage: formData.profileImage,
        spouseFirstName: formData.spouseFirstName,
        spouseMi: formData.spouseMi,
        spouseLastName: formData.spouseLastName,
        spouseDateOfBirth: formData.spouseDateOfBirth,
        spouseSsn: formData.spouseSsn,
        spousePhoneNo: formData.spousePhoneNo,
        spouseEmail: formData.spouseEmail,
        dependents: formData.dependents,
        street: formData.street,
        apt: formData.apt,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        notes: formData.notes,
        status: formData.status,
      };
    }

    onUpdateClient(client._id, updatedClient);
    handleClose();
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addShareholder = () => {
    setFormData((prev) => ({
      ...prev,
      shareholders: [
        ...prev.shareholders,
        {
          ownership: "",
          firstName: "",
          mi: "",
          lastName: "",
          dateOfBirth: "",
          ssn: "",
          phoneNo: "",
          email: "",
        },
      ],
    }));
  };

  const updateShareholder = (
    index: number,
    field: keyof Shareholder,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      shareholders: prev.shareholders.map((shareholder, i) =>
        i === index ? { ...shareholder, [field]: value } : shareholder
      ),
    }));
  };

  const addDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [
        ...prev.dependents,
        {
          firstName: "",
          mi: "",
          lastName: "",
          dateOfBirth: "",
          ssn: "",
          phoneNo: "",
          email: "",
        },
      ],
    }));
  };

  const updateDependent = (
    index: number,
    field: keyof FormData["dependents"][0],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.map((dependent, i) =>
        i === index ? { ...dependent, [field]: value } : dependent
      ),
    }));
  };

  const removeDependent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }));
  };

  const renderTabs = () => {
    const tabs = getTabsForClientType();

    return (
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-green-600 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // All the render methods from create-client-dialog.tsx (abbreviated for brevity)
  const renderBusinessInfoTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Business Information
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Write Name"
            value={formData.businessName}
            onChange={(e) => updateFormData("businessName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ein">EIN</Label>
          <Input
            id="ein"
            placeholder="Write EIN"
            value={formData.ein}
            onChange={(e) => updateFormData("ein", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="entityStructure">Entity Structure</Label>
          <Input
            id="entityStructure"
            placeholder="Write Entity Structure"
            value={formData.entityStructure}
            onChange={(e) => updateFormData("entityStructure", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateBusinessFormed">Date Business Formed</Label>
          <Input
            id="dateBusinessFormed"
            type="date"
            placeholder="Write Date"
            value={formData.dateBusinessFormed}
            onChange={(e) =>
              updateFormData("dateBusinessFormed", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sElectionEffectiveDate">
            S Election Effective Date
          </Label>
          <Input
            id="sElectionEffectiveDate"
            type="date"
            placeholder="Write Date"
            value={formData.sElectionEffectiveDate}
            onChange={(e) =>
              updateFormData("sElectionEffectiveDate", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="noOfShareholders">No of Shareholders</Label>
          <Select
            value={formData.noOfShareholders}
            onValueChange={(value) => updateFormData("noOfShareholders", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select no of shareholders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Login Credentials Section */}
      <div className="border-t pt-4">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Login Credentials
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessEmail">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="businessEmail"
              type="email"
              placeholder="Enter login email"
              value={formData.shareholders[0]?.email || ""}
              onChange={(e) => {
                const newShareholders = [...formData.shareholders];
                if (newShareholders[0]) {
                  newShareholders[0].email = e.target.value;
                  updateFormData("shareholders", newShareholders);
                }
              }}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
  const renderShareholdersTab = () => (
    <div className="space-y-6">
      {formData.shareholders.map((shareholder, index) => (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Shareholder {index + 1}
          </h3>

          <div className="space-y-2">
            <Label>Ownership %</Label>
            <Input
              placeholder="Write Ownership"
              value={shareholder.ownership}
              onChange={(e) =>
                updateShareholder(index, "ownership", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Write First Name"
                value={shareholder.firstName}
                onChange={(e) =>
                  updateShareholder(index, "firstName", e.target.value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>MI</Label>
              <Input
                placeholder="Write MI"
                value={shareholder.mi}
                onChange={(e) => updateShareholder(index, "mi", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Write Last Name"
                value={shareholder.lastName}
                onChange={(e) =>
                  updateShareholder(index, "lastName", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                placeholder="Write DOB"
                value={shareholder.dateOfBirth}
                onChange={(e) =>
                  updateShareholder(index, "dateOfBirth", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>SSN</Label>
              <Input
                placeholder="Write SSN no"
                value={shareholder.ssn}
                onChange={(e) =>
                  updateShareholder(index, "ssn", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>
                Phone no <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Write Phone no"
                value={shareholder.phoneNo}
                onChange={(e) =>
                  updateShareholder(index, "phoneNo", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Write your Email"
              value={shareholder.email}
              onChange={(e) =>
                updateShareholder(index, "email", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        className="gap-2 bg-transparent"
        onClick={addShareholder}
      >
        <Plus className="h-4 w-4" />
        Add Shareholder
      </Button>
    </div>
  );

  const renderTaxpayerTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Taxpayer</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="Write First Name"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mi">MI</Label>
          <Input
            id="mi"
            placeholder="Write MI"
            value={formData.mi}
            onChange={(e) => updateFormData("mi", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Write Last Name"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            placeholder="Select DOB"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ssn">SSN</Label>
          <Input
            id="ssn"
            placeholder="Write SSN no"
            value={formData.ssn}
            onChange={(e) => updateFormData("ssn", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNo">
            Phone no <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNo"
            placeholder="Write Phone no"
            value={formData.phoneNo}
            onChange={(e) => updateFormData("phoneNo", e.target.value)}
            required
          />
        </div>
      </div>

      {/* Login Credentials Section */}
      <div className="border-t pt-4">
        <h4 className="text-md font-semibold text-gray-900 mb-4">
          Login Credentials
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter login email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Client Profile</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={formData.profileImage || "/placeholder.svg"} />
            <AvatarFallback className="bg-gray-100">
              <Upload className="h-6 w-6 text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );

  const renderSpouseTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Spouse</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            placeholder="Write First Name"
            value={formData.spouseFirstName}
            onChange={(e) => updateFormData("spouseFirstName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mi">MI</Label>
          <Input
            id="mi"
            placeholder="Write MI"
            value={formData.spouseMi}
            onChange={(e) => updateFormData("spouseMi", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            placeholder="Write Last Name"
            value={formData.spouseLastName}
            onChange={(e) => updateFormData("spouseLastName", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            placeholder="Select DOB"
            value={formData.spouseDateOfBirth}
            onChange={(e) =>
              updateFormData("spouseDateOfBirth", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ssn">SSN</Label>
          <Input
            id="ssn"
            placeholder="Write SSN no"
            value={formData.spouseSsn}
            onChange={(e) => updateFormData("spouseSsn", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNo">Phone no</Label>
          <Input
            id="phoneNo"
            placeholder="Write Phone no"
            value={formData.spousePhoneNo}
            onChange={(e) => updateFormData("spousePhoneNo", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Write your Email"
            value={formData.spouseEmail}
            onChange={(e) => updateFormData("spouseEmail", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
  const renderDependentTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Dependent</h3>
        <Button
          type="button"
          variant="outline"
          className="gap-2 bg-transparent"
          onClick={addDependent}
        >
          <Plus className="h-4 w-4" />
          Add Dependent
        </Button>
      </div>

      {formData.dependents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No dependents added yet.</p>
          <p className="text-sm">Click "Add Dependent" to add a dependent.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.dependents.map((dependent, index) => (
            <div
              key={index}
              className="space-y-4 p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-900">
                  Dependent {index + 1}
                </h4>
                {formData.dependents.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDependent(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    placeholder="Write First Name"
                    value={dependent.firstName}
                    onChange={(e) =>
                      updateDependent(index, "firstName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>MI</Label>
                  <Input
                    placeholder="Write MI"
                    value={dependent.mi}
                    onChange={(e) =>
                      updateDependent(index, "mi", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    placeholder="Write Last Name"
                    value={dependent.lastName}
                    onChange={(e) =>
                      updateDependent(index, "lastName", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    placeholder="Select DOB"
                    value={dependent.dateOfBirth}
                    onChange={(e) =>
                      updateDependent(index, "dateOfBirth", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>SSN</Label>
                  <Input
                    placeholder="Write SSN no"
                    value={dependent.ssn}
                    onChange={(e) =>
                      updateDependent(index, "ssn", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone no</Label>
                  <Input
                    placeholder="Write Phone no"
                    value={dependent.phoneNo}
                    onChange={(e) =>
                      updateDependent(index, "phoneNo", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Write your Email"
                  value={dependent.email}
                  onChange={(e) =>
                    updateDependent(index, "email", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddressTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Address</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Street</Label>
          <Input
            id="street"
            placeholder="Street Name"
            value={formData.street}
            onChange={(e) => updateFormData("street", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apt">APT</Label>
          <Input
            id="apt"
            placeholder="Write APT"
            value={formData.apt}
            onChange={(e) => updateFormData("apt", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Write City"
            value={formData.city}
            onChange={(e) => updateFormData("city", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="Write State"
            value={formData.state}
            onChange={(e) => updateFormData("state", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            placeholder="Write Zip Code"
            value={formData.zipCode}
            onChange={(e) => updateFormData("zipCode", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderClientNoteTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notes</h3>

      <div className="space-y-2">
        <Textarea
          placeholder="Enter a notes..."
          value={formData.notes}
          onChange={(e) => updateFormData("notes", e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>
    </div>
  );

  // Entity Info Tab
  const renderEntityInfoTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Entity Information
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entityName">
            Entity Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="entityName"
            placeholder="Write Entity Name"
            value={formData.entityName}
            onChange={(e) => updateFormData("entityName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publicationCountry">Publication - Country</Label>
          <Input
            id="publicationCountry"
            placeholder="Write Publication - Country"
            value={formData.publicationCountry}
            onChange={(e) =>
              updateFormData("publicationCountry", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="entityEin">EIN</Label>
          <Input
            id="entityEin"
            placeholder="Write EIN no"
            value={formData.entityEin}
            onChange={(e) => updateFormData("entityEin", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entityPhoneNo">
            Phone no <span className="text-red-500">*</span>
          </Label>
          <Input
            id="entityPhoneNo"
            placeholder="Write Phone No"
            value={formData.phoneNo}
            onChange={(e) => updateFormData("entityPhoneNo", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="entityEmailAddress">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="entityEmailAddress"
            type="email"
            placeholder="Write Email Address"
            value={formData.email}
            onChange={(e) =>
              updateFormData("entityEmailAddress", e.target.value)
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="entityAddress">Address</Label>
          <Input
            id="entityAddress"
            placeholder="Write Address"
            value={formData.entityAddress}
            onChange={(e) => updateFormData("entityAddress", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderOwnerInfoTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Owner Information</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ownerFirstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ownerFirstName"
            placeholder="Write First Name"
            value={formData.ownerFirstName}
            onChange={(e) => updateFormData("ownerFirstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerMi">MI</Label>
          <Input
            id="ownerMi"
            placeholder="Write MI"
            value={formData.ownerMi}
            onChange={(e) => updateFormData("ownerMi", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerLastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ownerLastName"
            placeholder="Write Last Name"
            value={formData.ownerLastName}
            onChange={(e) => updateFormData("ownerLastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ownerDateOfBirth">Date of Birth</Label>
          <Input
            id="ownerDateOfBirth"
            type="date"
            placeholder="Select DOB"
            value={formData.ownerDateOfBirth}
            onChange={(e) => updateFormData("ownerDateOfBirth", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ownerSsn">SSN</Label>
          <Input
            id="ownerSsn"
            placeholder="Write SSN number"
            value={formData.ownerSsn}
            onChange={(e) => updateFormData("ownerSsn", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderServiceToProvideTab = () => {
    const services = [
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

    const toggleService = (service: string) => {
      setFormData((prev) => ({
        ...prev,
        servicesToProvide: prev.servicesToProvide.includes(service)
          ? prev.servicesToProvide.filter((s) => s !== service)
          : [...prev.servicesToProvide, service],
      }));
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Services to Provide
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={service}
                checked={formData.servicesToProvide.includes(service)}
                onChange={() => toggleService(service)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <Label
                htmlFor={service}
                className="text-sm font-medium text-gray-700"
              >
                {service}
              </Label>
            </div>
          ))}
        </div>

        <Button variant="outline" className="gap-2 bg-transparent">
          Add Other Services
        </Button>
      </div>
    );
  };

  const renderServiceOfProcessTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Service of Process
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceOfProcessName">Name</Label>
          <Input
            id="serviceOfProcessName"
            placeholder="Write Name"
            value={formData.serviceOfProcessName}
            onChange={(e) =>
              updateFormData("serviceOfProcessName", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceOfProcessAddress">Address</Label>
          <Input
            id="serviceOfProcessAddress"
            placeholder="Write Address"
            value={formData.serviceOfProcessAddress}
            onChange={(e) =>
              updateFormData("serviceOfProcessAddress", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderRegisteredAgentTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Registered Agent</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registeredAgentName">Name</Label>
          <Input
            id="registeredAgentName"
            placeholder="Write Name"
            value={formData.registeredAgentName}
            onChange={(e) =>
              updateFormData("registeredAgentName", e.target.value)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registeredAgentAddress">Address</Label>
          <Input
            id="registeredAgentAddress"
            placeholder="Write Address"
            value={formData.registeredAgentAddress}
            onChange={(e) =>
              updateFormData("registeredAgentAddress", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );

  const renderPublicationTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Publication</h3>

      <div className="space-y-2">
        <Label htmlFor="publicationDetails">Publication Details</Label>
        <Textarea
          id="publicationDetails"
          placeholder="Enter publication details..."
          value={formData.publicationDetails}
          onChange={(e) => updateFormData("publicationDetails", e.target.value)}
          rows={6}
          className="resize-none"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (formData.clientType === "Business") {
      switch (activeTab) {
        case "businessInfo":
          return renderBusinessInfoTab();
        case "address":
          return renderAddressTab();
        case "shareholders":
          return renderShareholdersTab();
        case "clientNote":
          return renderClientNoteTab();
        default:
          return renderBusinessInfoTab();
      }
    } else if (formData.clientType === "Entity") {
      switch (activeTab) {
        case "entityInfo":
          return renderEntityInfoTab();
        case "ownerInfo":
          return renderOwnerInfoTab();
        case "serviceToProvide":
          return renderServiceToProvideTab();
        case "serviceOfProcess":
          return renderServiceOfProcessTab();
        case "registeredAgent":
          return renderRegisteredAgentTab();
        case "publication":
          return renderPublicationTab();
        case "clientNote":
          return renderClientNoteTab();
        default:
          return renderEntityInfoTab();
      }
    } else {
      switch (activeTab) {
        case "taxpayer":
          return renderTaxpayerTab();
        case "spouse":
          return renderSpouseTab();
        case "dependent":
          return renderDependentTab();
        case "address":
          return renderAddressTab();
        case "clientNote":
          return renderClientNoteTab();
        default:
          return renderTaxpayerTab();
      }
    }
  };

  const tabs = getTabsForClientType();
  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Client -{" "}
              {client.businessName ||
                client.entityName ||
                `${client.firstName} ${client.lastName}`}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Required fields note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              Fields marked with{" "}
              <span className="text-red-500 font-semibold">*</span> are required
              and must be filled out.
            </p>
          </div>

          {/* Client Class Selector */}
          {/* <div className="space-y-2 w-full">
            <Label htmlFor="clientClass">
              Client Class <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.clientType}
              onValueChange={handleClientTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Entity">Entity</SelectItem>
              </SelectContent>
            </Select>
          </div> */}

          {/* Tabs */}
          {renderTabs()}

          {/* Tab Content */}
          {renderTabContent()}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            {!isFirstTab && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {isLastTab ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
              >
                Update Client
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
