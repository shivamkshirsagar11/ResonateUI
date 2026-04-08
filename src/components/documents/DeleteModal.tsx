import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteModalProps {
  open: boolean;
  documentName: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({
  open,
  documentName,
  isPending,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent
        className="bg-card border-border max-w-md"
        data-ocid="delete-modal"
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex-shrink-0 rounded-full bg-destructive/15 p-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground font-display text-lg">
              Delete document?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-muted-foreground text-sm leading-relaxed pl-11">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              "{documentName}"
            </span>
            ? This action cannot be undone and all associated chat history will
            be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 mt-2">
          <AlertDialogCancel
            onClick={onCancel}
            className="bg-muted border-border hover:bg-muted/80"
            disabled={isPending}
            data-ocid="delete-modal-cancel"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="min-w-24 gap-2"
            data-ocid="delete-modal-confirm"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
