import { DropZone } from "@/components/upload/DropZone";
import { RecentUploads } from "@/components/upload/RecentUploads";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { useUploadDocument } from "@/hooks/useDocuments";
import { UploadCloud, Zap } from "lucide-react";
import { useCallback, useState } from "react";

export default function UploadPage() {
  const { mutate: uploadFile, uploadProgress, isPending } = useUploadDocument();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  const resetState = useCallback(() => {
    setShowProgress(false);
    setCurrentFile(null);
    setUploadError(null);
  }, []);

  const handleFileSelected = useCallback(
    (file: File) => {
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadError("File is too large. Maximum size is 50 MB.");
        return;
      }
      const allowed = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
      ];
      if (
        !allowed.includes(file.type) &&
        !file.name.match(/\.(pdf|docx?|txt|md)$/i)
      ) {
        setUploadError(
          "Unsupported file type. Please upload PDF, DOCX, TXT, or MD.",
        );
        return;
      }

      setUploadError(null);
      setCurrentFile(file);
      setShowProgress(true);

      uploadFile(file, {
        onError: () => {
          setUploadError("Upload failed. Please try again.");
        },
      });
    },
    [uploadFile],
  );

  return (
    <div className="min-h-full bg-background" data-ocid="upload-page">
      {/* Page header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 text-primary">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">
                Upload Document
              </h1>
              <p className="text-sm text-muted-foreground">
                Upload files to chat with them using AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Hero tip banner */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          {/* Gradient line at top */}
          <div
            className="absolute inset-x-0 top-0 h-px animate-gradient-rotate"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.65 0.25 300), oklch(0.7 0.2 0), oklch(0.6 0.18 150), oklch(0.75 0.18 55), oklch(0.65 0.25 300))",
              backgroundSize: "400% 100%",
            }}
          />
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">Pro tip:</span>{" "}
              Upload multiple documents to ask questions across all of them at
              once in the Chat section.
            </p>
          </div>
        </div>

        {/* Drop zone or progress */}
        {showProgress && uploadProgress ? (
          <UploadProgress
            progress={uploadProgress}
            fileSize={currentFile?.size}
            onCancel={resetState}
            onUploadAnother={resetState}
          />
        ) : (
          <DropZone
            onFileSelected={handleFileSelected}
            error={uploadError}
            disabled={isPending}
          />
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground">
              recent activity
            </span>
          </div>
        </div>

        {/* Recent uploads */}
        <RecentUploads />
      </div>
    </div>
  );
}
