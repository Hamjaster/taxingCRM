import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Eye, Calendar, User } from "lucide-react";
import { Folder } from "@/types";
import { Documents } from "@/components/ui/documents";
import { mockFolders } from "@/types/constants";

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 ">
      <Documents
        isBordered={true}
        title="Documentations"
        folders={mockFolders}
      />
    </div>
  );
}
