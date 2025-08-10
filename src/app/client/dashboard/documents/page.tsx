import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Eye, Calendar, User } from "lucide-react";
import { DocumentsTab } from "@/components/client/documents-tab";

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 ">
      <DocumentsTab isBordered={true} />
    </div>
  );
}
