import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateChatSession } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import { FileText, Loader2, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

interface NewSessionModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (sessionId: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

export function NewSessionModal({
  open,
  onClose,
  onCreated,
}: NewSessionModalProps) {
  const [title, setTitle] = useState("");
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const { data: documents, isLoading: docsLoading } = useDocuments();
  const createSession = useCreateChatSession();

  function toggleDoc(docId: string) {
    setSelectedDocIds((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId],
    );
  }

  async function handleSubmit() {
    if (!title.trim() || selectedDocIds.length === 0) return;
    try {
      const session = await createSession.mutateAsync({
        title: title.trim(),
        documentIds: selectedDocIds,
      });
      setTitle("");
      setSelectedDocIds([]);
      onCreated(session.id);
    } catch (_) {
      // error handled by mutation
    }
  }

  function handleClose() {
    if (createSession.isPending) return;
    setTitle("");
    setSelectedDocIds([]);
    onClose();
  }

  const canSubmit =
    title.trim().length > 0 &&
    selectedDocIds.length > 0 &&
    !createSession.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="sm:max-w-md bg-card border-border flex flex-col max-h-[90vh]"
        data-ocid="new-session-modal"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-display flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            New Chat Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2 flex-1 overflow-y-auto min-h-0">
          {/* Session name */}
          <div className="space-y-2">
            <Label htmlFor="session-title" className="text-sm font-medium">
              Session name
            </Label>
            <Input
              id="session-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Revenue Analysis"
              data-ocid="session-title-input"
              className="bg-background/60"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Document picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select documents</Label>
              {selectedDocIds.length > 0 && (
                <span className="text-xs text-primary font-medium">
                  {selectedDocIds.length} selected
                </span>
              )}
            </div>

            {docsLoading ? (
              <div className="space-y-2 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : !documents || documents.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center">
                <FileText className="h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No documents uploaded yet.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Upload documents first, then start a chat.
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-52 pr-1">
                <div className="space-y-1.5">
                  {documents.map((doc) => {
                    const isSelected = selectedDocIds.includes(doc.id);
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => toggleDoc(doc.id)}
                        data-ocid="doc-checkbox-item"
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left",
                          isSelected
                            ? "border-primary/40 bg-primary/8"
                            : "border-border hover:border-border/60 hover:bg-secondary/40",
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleDoc(doc.id)}
                          className="flex-shrink-0"
                          aria-label={`Select ${doc.name}`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatSize(doc.size)}
                            {doc.pageCount ? ` · ${doc.pageCount} pages` : ""}
                          </p>
                        </div>
                        <FileText
                          className={cn(
                            "h-4 w-4 flex-shrink-0",
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground/40",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={createSession.isPending}
            data-ocid="modal-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            data-ocid="modal-start-btn"
            className="bg-gradient-to-r from-primary to-primary/80 gap-2"
          >
            {createSession.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquarePlus className="h-4 w-4" />
            )}
            Start Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
