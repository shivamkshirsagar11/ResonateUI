import { cn } from "@/lib/utils";
import { AlertCircle, File, FileImage, FileText, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const FILE_TYPES = [
  {
    ext: "PDF",
    color: "bg-destructive/15 text-destructive border-destructive/30",
  },
  { ext: "DOCX", color: "bg-primary/15 text-primary border-primary/30" },
  { ext: "TXT", color: "bg-accent/15 text-accent-foreground border-accent/30" },
  {
    ext: "MD",
    color: "bg-secondary/15 text-secondary-foreground border-secondary/30",
  },
];

function getFileIcon(mimeType: string) {
  if (mimeType.includes("pdf")) return <FileText className="w-8 h-8" />;
  if (mimeType.includes("image")) return <FileImage className="w-8 h-8" />;
  return <File className="w-8 h-8" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
  disabled?: boolean;
}

export function DropZone({ onFileSelected, error, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-4">
      {/* Main drop zone */}
      <label
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[280px] rounded-2xl cursor-pointer",
          "border-2 border-dashed transition-all duration-300",
          "bg-card/50 backdrop-blur-sm",
          isDragging
            ? "border-primary/80 bg-primary/5 animate-pulse-ring scale-[1.01]"
            : error
              ? "border-destructive/60 bg-destructive/5 animate-shake"
              : "border-border hover:border-primary/50 hover:bg-primary/5",
          disabled && "pointer-events-none opacity-60",
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-ocid="upload-dropzone"
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.txt,.md,.doc"
          onChange={handleChange}
          disabled={disabled}
          data-ocid="upload-file-input"
        />

        {/* Glow ring when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none">
            <div className="absolute inset-0 rounded-2xl animate-gradient-border opacity-30 blur-sm" />
          </div>
        )}

        <div className="relative flex flex-col items-center gap-5 px-8 py-10 text-center">
          {/* Icon with gradient bg */}
          <div
            className={cn(
              "flex items-center justify-center w-20 h-20 rounded-2xl transition-all duration-300",
              isDragging
                ? "bg-primary/20 text-primary scale-110"
                : "bg-muted text-muted-foreground",
            )}
          >
            <Upload
              className={cn(
                "w-9 h-9 transition-all duration-300",
                isDragging && "animate-bounce",
              )}
            />
          </div>

          {/* Text */}
          <div className="space-y-1.5">
            <p className="text-lg font-display font-semibold text-foreground">
              {isDragging ? "Drop it here!" : "Drag & drop your document"}
            </p>
            <p className="text-sm text-muted-foreground">
              or{" "}
              <span className="text-primary font-medium underline-offset-2 hover:underline">
                browse files
              </span>{" "}
              from your computer
            </p>
          </div>

          {/* File type badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {FILE_TYPES.map(({ ext, color }) => (
              <span
                key={ext}
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border",
                  color,
                )}
              >
                .{ext.toLowerCase()}
              </span>
            ))}
          </div>

          {/* Max size note */}
          <p className="text-xs text-muted-foreground/70">
            Max file size: 50 MB
          </p>
        </div>
      </label>

      {/* Selected file preview */}
      {selectedFile && !error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border animate-slide-up">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary flex-shrink-0">
            {getFileIcon(selectedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(selectedFile.size)}
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 animate-slide-up">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
