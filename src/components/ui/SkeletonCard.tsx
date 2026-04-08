import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  lines?: number;
  showAvatar?: boolean;
}

export function SkeletonCard({
  className,
  lines = 3,
  showAvatar = false,
}: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border p-4 animate-fade-in",
        className,
      )}
    >
      {showAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-1/3 rounded" />
            <div className="skeleton h-3 w-1/4 rounded" />
          </div>
        </div>
      )}
      <div className="space-y-2.5">
        {Array.from({ length: lines }, (_, i) => `sk-line-${i}`).map(
          (key, i) => (
            <div
              key={key}
              className="skeleton h-3 rounded"
              style={{ width: i === lines - 1 ? "65%" : "100%" }}
            />
          ),
        )}
      </div>
    </div>
  );
}

export function SkeletonDocumentCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card border border-border p-4 flex items-center gap-4",
        className,
      )}
    >
      <div className="skeleton h-12 w-12 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2 min-w-0">
        <div className="skeleton h-4 w-3/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
      <div className="skeleton h-8 w-16 rounded" />
    </div>
  );
}
