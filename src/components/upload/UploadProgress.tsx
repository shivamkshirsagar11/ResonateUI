import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentUploadProgress } from "@/types";
import {
  CheckCircle2,
  File,
  FileImage,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="w-6 h-6" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? ""))
    return <FileImage className="w-6 h-6" />;
  return <File className="w-6 h-6" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadProgressProps {
  progress: DocumentUploadProgress;
  fileSize?: number;
  onCancel?: () => void;
  onUploadAnother?: () => void;
}

export function UploadProgress({
  progress,
  fileSize,
  onCancel,
  onUploadAnother,
}: UploadProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const target = progress.progress;
    const step = target > displayProgress ? 1 : -1;
    if (displayProgress === target) return;

    const timer = setTimeout(() => {
      setDisplayProgress((prev) => {
        const next = prev + step;
        return step > 0 ? Math.min(next, target) : Math.max(next, target);
      });
    }, 12);
    return () => clearTimeout(timer);
  }, [progress.progress, displayProgress]);

  const isComplete = progress.status === "complete";
  const isProcessing = progress.status === "processing";
  const isError = progress.status === "error";

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-500 overflow-hidden",
        isComplete
          ? "border-green-500/40 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.15)]"
          : isError
            ? "border-destructive/40 bg-destructive/5"
            : "border-border bg-card",
      )}
      data-ocid="upload-progress-card"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-all duration-500",
            isComplete
              ? "bg-green-500/15 text-green-400"
              : isError
                ? "bg-destructive/15 text-destructive"
                : "bg-primary/15 text-primary",
          )}
        >
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 animate-fade-in" />
          ) : isProcessing ? (
            <Sparkles className="w-6 h-6 animate-spin" />
          ) : isError ? (
            <X className="w-6 h-6" />
          ) : (
            getFileIcon(progress.fileName)
          )}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {progress.fileName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {fileSize && `${formatBytes(fileSize)} · `}
            {isComplete
              ? "Upload complete"
              : isProcessing
                ? "Processing document…"
                : isError
                  ? "Upload failed"
                  : `Uploading… ${displayProgress}%`}
          </p>
        </div>

        {/* Cancel button (only while uploading) */}
        {!isComplete && !isError && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            aria-label="Cancel upload"
            data-ocid="upload-cancel-btn"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {!isComplete && !isError && (
        <div className="px-5 pb-4 space-y-2">
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            {/* Animated gradient fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${displayProgress}%`,
                background:
                  "linear-gradient(90deg, oklch(0.65 0.25 300), oklch(0.7 0.2 0), oklch(0.6 0.18 150), oklch(0.75 0.18 55))",
                backgroundSize: "300% 100%",
                animation: "gradient-rotate 2s linear infinite",
              }}
            />
            {/* Shimmer effect */}
            <div
              className="absolute inset-y-0 rounded-full opacity-60"
              style={{
                left: `${Math.max(0, displayProgress - 15)}%`,
                width: "15%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {isProcessing ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Extracting text & indexing…
                </span>
              ) : (
                "Uploading…"
              )}
            </span>
            <span className="text-xs font-mono font-semibold text-primary">
              {displayProgress}%
            </span>
          </div>
        </div>
      )}

      {/* Success state */}
      {isComplete && (
        <div className="px-5 pb-5 flex flex-col items-center gap-4 animate-slide-up">
          {/* Success icon ring */}
          <div className="relative flex items-center justify-center w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping opacity-50" />
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-foreground">
              Document ready for chat!
            </p>
            <p className="text-xs text-muted-foreground">
              Your document has been indexed and is ready to query.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadAnother}
            className="gap-2"
            data-ocid="upload-another-btn"
          >
            <UploadCloud className="w-4 h-4" />
            Upload another
          </Button>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="px-5 pb-5 flex items-center gap-3 animate-slide-up">
          <p className="text-sm text-destructive flex-1">
            Something went wrong. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onUploadAnother}
            data-ocid="upload-retry-btn"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
