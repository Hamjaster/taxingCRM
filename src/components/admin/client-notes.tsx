"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  MessageSquare,
  Calendar,
  User,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";

interface ClientNotesProps {
  clientId: string;
  notes: string;
}

export function ClientNotes({ clientId, notes }: ClientNotesProps) {
  return (
    <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Notes</h3>

      <div className="space-y-2">
        <Textarea
          placeholder="Enter a notes..."
          value={notes}
          // onChange={(e) => setNotes(e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>
    </div>
  );
}
