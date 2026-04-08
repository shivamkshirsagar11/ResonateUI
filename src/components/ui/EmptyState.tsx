import { cn } from "@/lib/utils";
import { FileText, MessageSquare, Upload } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateVariant = "documents" | "chat" | "search" | "default";

const VARIANTS: Record<
  EmptyStateVariant,
  { icon: ReactNode; title: string; description: string }
> = {
  documents: {
    icon: <FileText className="h-12 w-12 text-primary/60" />,
    title: "No documents yet",
    description:
      "Upload your first document to start asking questions and getting AI-powered insights.",
  },
  chat: {
    icon: <MessageSquare className="h-12 w-12 text-primary/60" />,
    title: "Start a conversation",
    description:
      "Select a document from your library and ask any question — your AI assistant will find the answers.",
  },
  search: {
    icon: <FileText className="h-12 w-12 text-muted-foreground/50" />,
    title: "No results found",
    description: "Try a different search term or clear your filters.",
  },
  default: {
    icon: <Upload className="h-12 w-12 text-primary/60" />,
    title: "Nothing here yet",
    description: "Get started by uploading content.",
  },
};

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  variant = "default",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const config = VARIANTS[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className,
      )}
      data-ocid="empty-state"
    >
      {/* Glowing icon background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-150" />
        <div className="relative rounded-2xl bg-card border border-border p-5 shadow-xs">
          {config.icon}
        </div>
      </div>

      <h3 className="text-lg font-display font-semibold text-foreground mb-2">
        {title ?? config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-6">
        {description ?? config.description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
