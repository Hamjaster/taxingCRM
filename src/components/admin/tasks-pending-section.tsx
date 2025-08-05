import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Building, Users, Handshake } from "lucide-react";

const taskCategories = [
  {
    title: "Individual Tax Prep",
    count: "24",
    icon: "/icons/admin/task1.svg",
  },
  {
    title: "S-Corp Tax Prep (1120-S)",
    count: "64",
    icon: "/icons/admin/task2.svg",
  },
  {
    title: "C-Corp Tax Prep (1120)",
    count: "32",
    icon: "/icons/admin/task3.svg",
  },
  {
    title: "Partnership Tax Prep (1065)",
    count: "03",
    icon: "/icons/admin/task4.svg",
  },
];

export function TasksPendingSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            <span>Total Tasks Pending {"  "}</span>
            <span className="text-sm text-gray-500"> (226)</span>
          </h2>
        </div>
        <Button variant="link" className="text-green-600">
          View All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {taskCategories.map((category) => (
          <Card key={category.title} className="bg-[#e6f3eb] border-green-600">
            <CardContent className="px-4">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="rounded-md border-2 border-green-600 p-2 ">
                    {/* <category.icon className="h-5 w-5 text-green-600" /> */}
                    <img src={category.icon} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {category.title}
                  </p>
                  <p className="text-4xl font-bold text-green-700">
                    {category.count}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
