import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonList } from "@/components/ui/SkeletonList";
import { Button } from "@/components/ui/button";
import { useChatSessions } from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import type { ChatSessionInfo } from "@/types";
import { Clock, FileText, MessageSquarePlus } from "lucide-react";
import { useState } from "react";
import { NewSessionModal } from "./NewSessionModal";

interface ChatSidebarProps {
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
}

function formatRelativeTime(ts: bigint): string {
  const diff = Date.now() - Number(ts);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function SessionItem({
  session,
  isActive,
  docNames,
  onClick,
}: {
  session: ChatSessionInfo;
  isActive: boolean;
  docNames: string[];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="chat-session-item"
      className={cn(
        "w-full text-left px-3 py-3 rounded-xl transition-smooth group",
        "hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-primary/10 border border-primary/30"
          : "border border-transparent",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          className={cn(
            "text-sm font-medium font-display truncate",
            isActive ? "text-primary" : "text-foreground",
          )}
        >
          {session.title}
        </span>
        <span className="text-xs text-muted-foreground flex-shrink-0 flex items-center gap-1 mt-0.5">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(session.updatedAt)}
        </span>
      </div>

      {docNames.length > 0 && (
        <div className="flex items-center gap-1 mb-1.5">
          <FileText className="h-3 w-3 text-muted-foreground/70 flex-shrink-0" />
          <span className="text-xs text-muted-foreground/70 truncate">
            {docNames.slice(0, 2).join(", ")}
            {docNames.length > 2 && ` +${docNames.length - 2}`}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground/60">
          {session.messageCount} message{session.messageCount !== 1 ? "s" : ""}
        </span>
        {isActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </div>
    </button>
  );
}

export function ChatSidebar({
  activeSessionId,
  onSelectSession,
}: ChatSidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const { data: sessions, isLoading } = useChatSessions();
  const { data: documents } = useDocuments();

  const docMap = new Map((documents ?? []).map((d) => [d.id, d.name]));

  function getDocNames(docIds: string[]): string[] {
    return docIds.map((id) => docMap.get(id) ?? "Unknown").filter(Boolean);
  }

  return (
    <>
      <aside
        className="w-72 flex-shrink-0 flex flex-col border-r border-border bg-card/60 backdrop-blur-sm"
        data-ocid="chat-sidebar"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div>
            <h2 className="text-sm font-display font-semibold text-foreground">
              Chat Sessions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sessions?.length ?? 0} conversation
              {(sessions?.length ?? 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            size="sm"
            variant="default"
            onClick={() => setShowModal(true)}
            data-ocid="new-session-btn"
            className="h-8 gap-1.5 text-xs"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
          {isLoading ? (
            <SkeletonList count={4} variant="chat" />
          ) : !sessions || sessions.length === 0 ? (
            <EmptyState
              variant="chat"
              title="No sessions yet"
              description="Start a new chat to ask questions about your documents."
              action={
                <Button
                  size="sm"
                  onClick={() => setShowModal(true)}
                  data-ocid="empty-new-session-btn"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                  Start your first chat
                </Button>
              }
            />
          ) : (
            sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                docNames={getDocNames(session.documentIds)}
                onClick={() => onSelectSession(session.id)}
              />
            ))
          )}
        </div>
      </aside>

      <NewSessionModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={(id) => {
          onSelectSession(id);
          setShowModal(false);
        }}
      />
    </>
  );
}
