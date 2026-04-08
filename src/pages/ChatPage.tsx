import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useState } from "react";

export default function ChatPage() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  return (
    <div className="flex h-full overflow-hidden" data-ocid="chat-page">
      <ChatSidebar
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
      />
      <ChatWindow
        sessionId={activeSessionId}
        onSessionDeleted={() => setActiveSessionId(null)}
      />
    </div>
  );
}
