import { cn } from "@/lib/utils";
import { SkeletonCard, SkeletonDocumentCard } from "./SkeletonCard";

interface SkeletonListProps {
  count?: number;
  variant?: "card" | "document" | "chat";
  className?: string;
}

function SkeletonChatItem() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg">
      <div className="skeleton h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="skeleton h-3.5 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
    </div>
  );
}

export function SkeletonList({
  count = 4,
  variant = "card",
  className,
}: SkeletonListProps) {
  const keys = Array.from({ length: count }, (_, i) => `skel-${variant}-${i}`);

  return (
    <div className={cn("space-y-3", className)}>
      {keys.map((key) => {
        if (variant === "document") {
          return <SkeletonDocumentCard key={key} />;
        }
        if (variant === "chat") {
          return <SkeletonChatItem key={key} />;
        }
        return <SkeletonCard key={key} lines={2} showAvatar />;
      })}
    </div>
  );
}
