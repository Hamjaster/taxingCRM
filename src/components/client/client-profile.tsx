import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone, Mail } from "lucide-react";

export function ClientProfile() {
  return (
    <div className="space-y-6 bg-white shadow-sm border p-6 rounded-xl">
      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg?height=80&width=80" />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-medium">
              MA
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Muhammad Ali Iftikhar
            </h1>
            <p className="text-gray-500 mt-1">Business Consultant</p>
          </div>
        </div>
        <Button variant="outline" className="border-gray-300 text-gray-700">
          Edit Profile
        </Button>
      </div>

      {/* Contact Information Cards */}
      <div className="space-y-4">
        {/* Address Card */}
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
          <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0" />
          <div className="h-5 w-0.5 bg-gray-300"></div>
          <p className="text-gray-700">
            1234 Main Street, Suite 567, New York, NY 10001, USA
          </p>
        </div>

        {/* Phone and Email Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
            <Phone className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-gray-300"></div>
            <p className="text-gray-700">+1 (212) 555-7890</p>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
            <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <div className="h-5 w-0.5 bg-gray-300"></div>
            <p className="text-gray-700">johndoe@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
