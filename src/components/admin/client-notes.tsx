"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateClientDetails } from "@/store/slices/authSlice";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ClientNotesProps {
  clientId: string;
  notes: string;
}

export function ClientNotes({ clientId, notes: initialNotes }: ClientNotesProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [notes, setNotes] = useState(initialNotes || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Update local state when notes prop changes (e.g., after refresh)
  useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes]);

  const handleSave = async () => {
    try {
      setSaveStatus("idle");
      setErrorMessage("");
      
      await dispatch(
        updateClientDetails({
          clientId,
          updates: { notes: notes.trim() },
        })
      ).unwrap();

      setSaveStatus("success");
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error: any) {
      setSaveStatus("error");
      setErrorMessage(error || "Failed to save notes. Please try again.");
      // Clear error message after 5 seconds
      setTimeout(() => {
        setSaveStatus("idle");
        setErrorMessage("");
      }, 5000);
    }
  };

  const hasChanges = notes !== (initialNotes || "");

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
        <div className="flex items-center gap-2">
          {saveStatus === "success" && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Saved</span>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>Error</span>
            </div>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            size="sm"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Notes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <Textarea
          placeholder="Enter notes about this client..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          className="resize-none"
        />
        {hasChanges && (
          <p className="text-xs text-gray-500">
            You have unsaved changes. Click "Save Notes" to save.
          </p>
        )}
      </div>
    </div>
  );
}
