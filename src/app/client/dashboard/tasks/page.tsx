import { ClientTasks } from "@/components/client/client-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function TasksPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <ClientTasks />
    </div>
  );
}
