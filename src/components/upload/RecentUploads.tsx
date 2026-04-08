import { SkeletonDocumentCard } from "@/components/ui/SkeletonCard";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import { Clock, File, FileImage, FileText, MoreVertical } from "lucide-react";

function getFileIcon(mimeType: string) {
  if (mimeType.includes("pdf")) return <FileText className="w-5 h-5" />;
  if (mimeType.includes("image")) return <FileImage className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
}

function getDocTypeBadge(mimeType: string) {
  if (mimeType.includes("pdf"))
    return { label: "PDF", style: "bg-red-500/15 text-red-400" };
  if (mimeType.includes("wordprocessingml") || mimeType.includes("msword"))
    return { label: "DOCX", style: "bg-blue-500/15 text-blue-400" };
  if (mimeType.includes("text/plain"))
    return { label: "TXT", style: "bg-green-500/15 text-green-400" };
  if (mimeType.includes("markdown"))
    return { label: "MD", style: "bg-purple-500/15 text-purple-400" };
  return { label: "FILE", style: "bg-muted text-muted-foreground" };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatRelativeTime(ts: bigint): string {
  const ms = Number(ts);
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function RecentUploads() {
  const { data: documents, isLoading } = useDocuments();

  const recent = documents?.slice(0, 5) ?? [];

  return (
    <section className="space-y-4" data-ocid="recent-uploads-section">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Recent Uploads
          </h2>
        </div>
        {!isLoading && documents && documents.length > 5 && (
          <a
            href="/home/documents"
            className="text-xs text-primary hover:underline underline-offset-2 transition-smooth"
          >
            View all
          </a>
        )}
      </div>

      {/* Skeleton loading */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => `sk-${i}`).map((key) => (
            <SkeletonDocumentCard key={key} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && recent.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-xl border border-dashed border-border">
          <File className="w-8 h-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">No documents yet</p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            Upload your first document above
          </p>
        </div>
      )}

      {/* Document list */}
      {!isLoading && recent.length > 0 && (
        <ul className="space-y-2">
          {recent.map((doc, i) => {
            const badge = getDocTypeBadge(doc.mimeType);
            return (
              <li
                key={doc.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl",
                  "bg-card border border-border",
                  "hover:border-primary/30 hover:bg-primary/5",
                  "transition-smooth animate-slide-up group",
                )}
                style={{ animationDelay: `${i * 60}ms` }}
                data-ocid={`recent-doc-${doc.id}`}
              >
                {/* File type icon */}
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0",
                    "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-smooth",
                  )}
                >
                  {getFileIcon(doc.mimeType)}
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatBytes(doc.size)}</span>
                    <span className="opacity-40">·</span>
                    <span>{formatRelativeTime(doc.uploadedAt)}</span>
                    {doc.pageCount && (
                      <>
                        <span className="opacity-40">·</span>
                        <span>{doc.pageCount} pages</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badge + menu */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold",
                      badge.style,
                    )}
                  >
                    {badge.label}
                  </span>
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted hover:text-foreground transition-smooth"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
