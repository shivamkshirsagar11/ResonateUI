import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, SendHorizonal } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const MAX_CHARS = 3000;

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function MessageInput({
  onSend,
  isLoading,
  disabled,
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isLoading, disabled, onSend]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value.slice(0, MAX_CHARS);
    setValue(newValue);
    // Auto-resize
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }

  const remaining = MAX_CHARS - value.length;
  const isNearLimit = remaining < 200;
  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="px-4 py-3 border-t border-border bg-card/40 backdrop-blur-sm">
      <div
        className={cn(
          "flex items-end gap-3 rounded-2xl border border-border bg-background/60",
          "px-4 py-2.5 transition-smooth",
          "focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_oklch(0.65_0.25_300/0.12)]",
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={
            disabled
              ? "Select a session to start chatting…"
              : "Ask anything about your documents… (Enter to send, Shift+Enter for new line)"
          }
          disabled={disabled || isLoading}
          data-ocid="message-input"
          className={cn(
            "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50",
            "resize-none focus:outline-none min-h-[24px] max-h-[120px] leading-6",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        <div className="flex items-center gap-2 flex-shrink-0 pb-0.5">
          {isNearLimit && (
            <span
              className={cn(
                "text-xs tabular-nums",
                remaining < 50
                  ? "text-destructive"
                  : "text-muted-foreground/60",
              )}
            >
              {remaining}
            </span>
          )}

          <Button
            size="icon"
            onClick={handleSend}
            disabled={!canSend}
            data-ocid="send-btn"
            className={cn(
              "h-8 w-8 rounded-xl shrink-0 transition-smooth",
              "bg-gradient-to-br from-primary to-primary/70",
              "hover:from-primary/90 hover:to-primary/60",
              "disabled:opacity-40 disabled:cursor-not-allowed",
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <SendHorizonal className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground/40 text-center mt-2">
        DocMind AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
