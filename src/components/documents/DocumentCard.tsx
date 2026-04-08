import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  File,
  FileText,
  FileType,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { DocumentInfo } from "../../types";

function getFileIcon(mimeType: string) {
  if (mimeType === "application/pdf") {
    return <FileType className="h-6 w-6 text-primary" />;
  }
  if (mimeType.includes("word") || mimeType.includes("docx")) {
    return <FileText className="h-6 w-6 text-accent" />;
  }
  return <File className="h-6 w-6 text-muted-foreground" />;
}

function getFileTypeBadge(mimeType: string) {
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("word") || mimeType.includes("docx")) return "DOCX";
  if (mimeType.includes("text")) return "TXT";
  return "FILE";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface DocumentCardProps {
  doc: DocumentInfo;
  index: number;
  onDelete: (doc: DocumentInfo) => void;
  onRename: (id: string, name: string) => void;
}

export function DocumentCard({
  doc,
  index,
  onDelete,
  onRename,
}: DocumentCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(doc.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = useCallback(() => {
    setEditValue(doc.name);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 30);
  }, [doc.name]);

  const commitEdit = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== doc.name) {
      onRename(doc.id, trimmed);
    }
    setIsEditing(false);
  }, [editValue, doc.id, doc.name, onRename]);

  const cancelEdit = useCallback(() => {
    setEditValue(doc.name);
    setIsEditing(false);
  }, [doc.name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") commitEdit();
      if (e.key === "Escape") cancelEdit();
    },
    [commitEdit, cancelEdit],
  );

  const typeBadge = getFileTypeBadge(doc.mimeType);
  const badgeColor =
    typeBadge === "PDF"
      ? "bg-primary/15 text-primary"
      : typeBadge === "DOCX"
        ? "bg-accent/15 text-accent"
        : "bg-muted text-muted-foreground";

  return (
    <div
      className={cn(
        "group relative rounded-xl bg-card border border-border p-5 flex flex-col gap-4",
        "cursor-default select-none",
        "transition-all duration-200 ease-out",
        "hover:scale-[1.02] hover:shadow-lg hover:border-primary/50",
        "hover:shadow-primary/10",
        "animate-slide-up",
      )}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
      data-ocid="document-card"
    >
      {/* Top row: icon + type badge */}
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-muted p-3 flex-shrink-0">
          {getFileIcon(doc.mimeType)}
        </div>
        <span
          className={cn(
            "text-xs font-mono font-semibold px-2 py-0.5 rounded-full",
            badgeColor,
          )}
        >
          {typeBadge}
        </span>
      </div>

      {/* Title (editable) */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 text-sm font-medium bg-input border border-primary rounded-md px-2 py-1 text-foreground outline-none focus:ring-1 focus:ring-primary"
              data-ocid="doc-rename-input"
              aria-label="Rename document"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-primary hover:bg-primary/10 flex-shrink-0"
              onClick={commitEdit}
              aria-label="Save rename"
              data-ocid="doc-rename-save"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:bg-muted flex-shrink-0"
              onClick={cancelEdit}
              aria-label="Cancel rename"
              data-ocid="doc-rename-cancel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            className="text-left w-full text-sm font-medium text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors duration-150"
            onClick={startEdit}
            title="Click to rename"
            data-ocid="doc-title-editable"
          >
            {doc.name}
          </button>
        )}
      </div>

      {/* Meta: date + size */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>{formatDate(doc.uploadedAt)}</span>
        <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
        <span>{formatBytes(doc.size)}</span>
        {doc.pageCount && (
          <>
            <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
            <span>{doc.pageCount}p</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 text-xs h-8 text-primary hover:bg-primary/10 hover:text-primary"
          onClick={() => navigate({ to: "/home/chat" })}
          data-ocid="doc-chat-btn"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Chat
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
          onClick={startEdit}
          aria-label="Rename document"
          data-ocid="doc-rename-btn"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(doc)}
          aria-label="Delete document"
          data-ocid="doc-delete-btn"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
