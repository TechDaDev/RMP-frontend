import { useState } from "react";
import { useAppPreferences } from "@/components/AppPreferencesProvider";
import { Button } from "@/components/ui/Button";
import { completeLabOrderItems } from "@/lib/laboratory/laboratoryService";
import type { LaboratoryCompletionResult, LaboratoryOrderItem } from "@/types/laboratory";
import { LaboratoryItemCompletionForm } from "./LaboratoryItemCompletionForm";

interface LaboratoryCompleteItemButtonProps {
  orderId: string;
  item: LaboratoryOrderItem;
  disabled?: boolean;
  onCompleted: (
    result: LaboratoryCompletionResult,
    completedItemIds?: string[],
  ) => Promise<void> | void;
}

export function LaboratoryCompleteItemButton({
  orderId,
  item,
  disabled = false,
  onCompleted,
}: LaboratoryCompleteItemButtonProps) {
  const { t } = useAppPreferences();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setError(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    if (isSubmitting) {
      return;
    }
    setError(null);
    setIsFormOpen(false);
    setNote("");
  };

  const handleSubmit = async () => {
    if (!item.id) {
      setError(t.laboratory.itemCompletionFailed);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await completeLabOrderItems(orderId, {
        items: [
          {
            lab_order_item_id: item.id,
            status: "completed",
            note: note.trim() || undefined,
          },
        ],
      });

      await onCompleted(response, [item.id]);
      setIsFormOpen(false);
      setNote("");
    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message || t.laboratory.itemCompletionFailed);
      } else {
        setError(t.laboratory.itemCompletionFailed);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isFormOpen) {
    return (
      <Button
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={handleOpen}
        disabled={disabled}
      >
        {t.laboratory.markItemCompleted}
      </Button>
    );
  }

  return (
    <LaboratoryItemCompletionForm
      note={note}
      onNoteChange={setNote}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      error={error}
    />
  );
}
