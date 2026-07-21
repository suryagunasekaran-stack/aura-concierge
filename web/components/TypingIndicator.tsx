export function TypingIndicator() {
  return (
    <div className="message-enter flex justify-start">
      <div className="rounded-2xl rounded-bl-sm bg-aura-bubble-in px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot h-2 w-2 rounded-full bg-aura-primary/50" />
          <span className="typing-dot h-2 w-2 rounded-full bg-aura-primary/50" />
          <span className="typing-dot h-2 w-2 rounded-full bg-aura-primary/50" />
        </div>
      </div>
    </div>
  );
}
