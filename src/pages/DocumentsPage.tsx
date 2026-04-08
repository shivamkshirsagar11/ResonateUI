import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Files, Upload } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DeleteModal } from "../components/documents/DeleteModal";
import { DocumentGrid } from "../components/documents/DocumentGrid";
import { SearchBar } from "../components/documents/SearchBar";
import {
  useDeleteDocument,
  useDocuments,
  useRenameDocument,
} from "../hooks/useDocuments";
import type { DocumentInfo } from "../types";

type FilterTab = "All" | "PDF" | "DOCX" | "TXT";

const FILTER_TABS: FilterTab[] = ["All", "PDF", "DOCX", "TXT"];

function matchesFilter(doc: DocumentInfo, tab: FilterTab) {
  if (tab === "All") return true;
  if (tab === "PDF") return doc.mimeType === "application/pdf";
  if (tab === "DOCX")
    return doc.mimeType.includes("word") || doc.mimeType.includes("docx");
  if (tab === "TXT") return doc.mimeType.includes("text");
  return true;
}

export default function DocumentsPage() {
  const { data: documents = [], isLoading } = useDocuments();
  const deleteMutation = useDeleteDocument();
  const renameMutation = useRenameDocument();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [pendingDelete, setPendingDelete] = useState<DocumentInfo | null>(null);

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesSearch && matchesFilter(doc, activeTab);
    });
  }, [documents, search, activeTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      All: 0,
      PDF: 0,
      DOCX: 0,
      TXT: 0,
    };
    for (const doc of documents) {
      counts.All++;
      if (doc.mimeType === "application/pdf") counts.PDF++;
      else if (doc.mimeType.includes("word") || doc.mimeType.includes("docx"))
        counts.DOCX++;
      else if (doc.mimeType.includes("text")) counts.TXT++;
    }
    return counts;
  }, [documents]);

  const handleRename = useCallback(
    (id: string, name: string) => {
      renameMutation.mutate({ documentId: id, name });
    },
    [renameMutation],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (!pendingDelete) return;
    deleteMutation.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }, [pendingDelete, deleteMutation]);

  const hasQuery = search.trim().length > 0 || activeTab !== "All";

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="documents-page">
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border bg-card">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
              <Files className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-display font-bold text-foreground">
                  My Documents
                </h1>
                {!isLoading && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-0"
                    data-ocid="doc-count-badge"
                  >
                    {documents.length}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage and chat with your uploaded documents
              </p>
            </div>
          </div>

          <Button
            size="sm"
            className="gap-1.5 flex-shrink-0"
            asChild
            data-ocid="upload-doc-btn"
          >
            <Link to="/home/upload">
              <Upload className="h-3.5 w-3.5" />
              Upload
            </Link>
          </Button>
        </div>

        {/* Search + filters row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            className="w-full sm:w-72"
          />

          {/* Filter tabs */}
          <div
            className="flex items-center gap-1 bg-muted/50 rounded-lg p-1"
            role="tablist"
            aria-label="Filter by file type"
            data-ocid="doc-filter-tabs"
          >
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  activeTab === tab
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTab(tab)}
                data-ocid={`filter-tab-${tab.toLowerCase()}`}
              >
                {tab}
                {!isLoading && tabCounts[tab] > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-4 h-4 rounded-full text-[10px] px-1",
                      activeTab === tab
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {tabCounts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <DocumentGrid
          documents={filtered}
          isLoading={isLoading}
          hasSearchQuery={hasQuery}
          onDelete={setPendingDelete}
          onRename={handleRename}
        />
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <DeleteModal
          open={!!pendingDelete}
          documentName={pendingDelete.name}
          isPending={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
