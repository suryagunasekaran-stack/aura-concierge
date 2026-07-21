import { formatTime, type ChatMessage } from "@/lib/chat";
import { MessageContent } from "@/components/MessageContent";

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-enter flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`shadow-sm ${
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-aura-primary px-3.5 py-2.5 text-white"
            : "max-w-[92%] rounded-2xl rounded-bl-sm bg-aura-bubble-in px-4 py-3 text-aura-text"
        }`}
      >
        <MessageContent
          text={message.text}
          variant={isUser ? "user" : "assistant"}
        />
        <p
          className={`mt-1.5 text-right text-[11px] ${
            isUser ? "text-white/70" : "text-aura-text-muted"
          }`}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
