import { EmptyState } from "@/components/ui/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useChatSession,
  useDeleteChatSession,
  useSendMessage,
} from "@/hooks/useChat";
import { useDocuments } from "@/hooks/useDocuments";
import { cn } from "@/lib/utils";
import { Bot, FileText, MessageSquarePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AISkeleton, MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
  sessionId: string | null;
  onSessionDeleted: () => void;
}

function ChatWindowSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-border flex items-center gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-24 ml-auto" />
      </div>
      <div className="flex-1 px-6 py-6 space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "flex",
              i % 2 === 0 ? "justify-end" : "justify-start",
            )}
          >
            <Skeleton
              className={cn("h-14 rounded-2xl", i % 2 === 0 ? "w-56" : "w-72")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatWindow({ sessionId, onSessionDeleted }: ChatWindowProps) {
  const { data: session, isLoading } = useChatSession(sessionId);
  const { data: documents } = useDocuments();
  const sendMessage = useSendMessage();
  const deleteSession = useDeleteChatSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [latestAIMessageId, setLatestAIMessageId] = useState<string | null>(
    null,
  );

  const messageCount = session?.messages.length ?? 0;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally scroll on message count or pending state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount, sendMessage.isPending]);

  async function handleSend(content: string) {
    if (!sessionId) return;
    try {
      const result = await sendMessage.mutateAsync({ sessionId, content });
      setLatestAIMessageId(result.id);
    } catch (_) {
      // silent
    }
  }

  async function handleDelete() {
    if (!sessionId) return;
    await deleteSession.mutateAsync(sessionId);
    onSessionDeleted();
  }

  const docMap = new Map((documents ?? []).map((d) => [d.id, d.name]));
  const linkedDocs = (session?.documentIds ?? [])
    .map((id) => docMap.get(id))
    .filter((n): n is string => !!n);

  if (!sessionId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/40">
        <EmptyState
          variant="chat"
          title="No session selected"
          description="Pick an existing session from the sidebar or start a new one to begin chatting with your documents."
          action={
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquarePlus className="h-4 w-4 text-primary" />
              Click <strong className="text-foreground">New</strong> in the
              sidebar
            </div>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-background/40">
        <ChatWindowSkeleton />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background/40">
        <EmptyState
          variant="default"
          title="Session not found"
          description="This session may have been deleted."
        />
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col min-w-0 bg-background/40"
      data-ocid="chat-window"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-display font-semibold text-foreground truncate">
              {session.title}
            </h2>
            {linkedDocs.length > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <FileText className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
                <p className="text-xs text-muted-foreground/60 truncate">
                  {linkedDocs.slice(0, 2).join(", ")}
                  {linkedDocs.length > 2 && ` +${linkedDocs.length - 2} more`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Delete session */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              data-ocid="clear-session-btn"
              aria-label="Delete this session"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card border-border">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display">
                Delete session?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>"{session.title}"</strong>{" "}
                and all its messages. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid="delete-cancel-btn">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                data-ocid="delete-confirm-btn"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 space-y-5"
        data-ocid="messages-area"
      >
        {session.messages.length === 0 && !sendMessage.isPending ? (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              variant="chat"
              title="Conversation is empty"
              description="Ask your first question — the AI will search through your linked documents to find the best answer."
            />
          </div>
        ) : (
          <>
            {session.messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                animate={
                  msg.id === latestAIMessageId && msg.role === "assistant"
                }
              />
            ))}

            {/* AI typing skeleton */}
            {sendMessage.isPending && <AISkeleton />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <MessageInput
        onSend={handleSend}
        isLoading={sendMessage.isPending}
        disabled={false}
      />
    </div>
  );
}
