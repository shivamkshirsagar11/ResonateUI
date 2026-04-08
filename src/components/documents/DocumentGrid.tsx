import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import type { DocumentInfo } from "../../types";
import { DocumentCard } from "./DocumentCard";

interface DocumentGridProps {
  documents: DocumentInfo[];
  isLoading: boolean;
  hasSearchQuery: boolean;
  onDelete: (doc: DocumentInfo) => void;
  onRename: (id: string, name: string) => void;
}

const SKELETON_COUNT = 9;

function SkeletonGridCard({ index }: { index: number }) {
  return (
    <div
      className="rounded-xl bg-card border border-border p-5 flex flex-col gap-4 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between">
        <div className="skeleton h-12 w-12 rounded-lg flex-shrink-0" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-4/5 rounded" />
        <div className="skeleton h-3 w-3/5 rounded" />
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton h-3 w-14 rounded" />
      </div>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <div className="skeleton h-8 flex-1 rounded-md" />
        <div className="skeleton h-8 w-8 rounded-md" />
        <div className="skeleton h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

export function DocumentGrid({
  documents,
  isLoading,
  hasSearchQuery,
  onDelete,
  onRename,
}: DocumentGridProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        aria-label="Loading documents"
        data-ocid="document-grid-loading"
      >
        {Array.from({ length: SKELETON_COUNT }, (_, i) => i).map((i) => (
          <SkeletonGridCard key={`sk-${i}`} index={i} />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return hasSearchQuery ? (
      <div data-ocid="document-grid-empty-search">
        <EmptyState variant="search" />
      </div>
    ) : (
      <div data-ocid="document-grid-empty">
        <EmptyState
          variant="documents"
          action={
            <Button
              onClick={() => navigate({ to: "/home/upload" })}
              className="gap-2"
              data-ocid="empty-upload-cta"
            >
              Upload your first document
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-ocid="document-grid"
    >
      {documents.map((doc, index) => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          index={index}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  );
}
