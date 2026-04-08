import { GradientBorder } from "@/components/ui/GradientBorder";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  message: ChatMessage;
  animate?: boolean;
}

function FormattedContent({ content }: { content: string }) {
  // Bold **text** and line breaks
  const parts = content.split(/(\*\*[^*]+\*\*|\n)/g);
  return (
    <span>
      {parts.map((part, i) => {
        const key = `part-${i}-${part.slice(0, 8)}`;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={key}>{part.slice(2, -2)}</strong>;
        }
        if (part === "\n") {
          return <br key={key} />;
        }
        return <span key={key}>{part}</span>;
      })}
    </span>
  );
}

function AnimatedText({ content }: { content: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const words = content.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(words.slice(0, i).join(" "));
      if (i >= words.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [content]);

  return (
    <span>
      {done ? (
        <FormattedContent content={content} />
      ) : (
        <>
          <FormattedContent content={displayed} />
          <span className="inline-block w-1.5 h-4 bg-primary/70 ml-0.5 animate-pulse rounded-sm align-middle" />
        </>
      )}
    </span>
  );
}

function UserBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-end" data-ocid="user-message">
      <div
        className={cn(
          "max-w-[70%] px-4 py-3 rounded-2xl rounded-tr-sm",
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
          "text-sm leading-relaxed shadow-md",
        )}
      >
        <FormattedContent content={message.content} />
      </div>
    </div>
  );
}

function AIBubble({
  message,
  animate,
}: {
  message: ChatMessage;
  animate?: boolean;
}) {
  return (
    <div className="flex items-start gap-3" data-ocid="ai-message">
      {/* AI avatar */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Animated rainbow border bubble */}
      <div className="max-w-[75%]">
        <GradientBorder animated borderWidth={2} radius="1rem">
          <div
            className={cn(
              "px-4 py-3 bg-card/90 backdrop-blur-sm",
              "text-sm leading-relaxed text-foreground",
              "rounded-[calc(1rem-2px)]",
            )}
          >
            {animate ? (
              <AnimatedText content={message.content} />
            ) : (
              <FormattedContent content={message.content} />
            )}
          </div>
        </GradientBorder>
      </div>
    </div>
  );
}

export function AISkeleton() {
  return (
    <div className="flex items-start gap-3" data-ocid="ai-skeleton">
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>
      <div className="max-w-[65%] w-56">
        <GradientBorder animated borderWidth={2} radius="1rem">
          <div className="px-4 py-3 bg-card/90 space-y-2 rounded-[calc(1rem-2px)]">
            <div className="skeleton h-3.5 w-full rounded" />
            <div className="skeleton h-3.5 w-5/6 rounded" />
            <div className="skeleton h-3.5 w-3/4 rounded" />
          </div>
        </GradientBorder>
      </div>
    </div>
  );
}

export function MessageBubble({ message, animate }: MessageBubbleProps) {
  if (message.role === "user") {
    return <UserBubble message={message} />;
  }
  return <AIBubble message={message} animate={animate} />;
}
