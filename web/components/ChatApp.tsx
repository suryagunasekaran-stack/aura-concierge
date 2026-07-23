"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DemoNav } from "@/components/DemoNav";
import { Composer } from "@/components/Composer";
import { ExamplePrompts } from "@/components/ExamplePrompts";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { DEMO_CUSTOMER_NAME, WELCOME_MESSAGE } from "@/lib/constants";
import { createMessage, type ChatMessage } from "@/lib/chat";
import { EXAMPLE_PROMPTS, RESET_MESSAGE } from "@/lib/examples";

const PLACEHOLDER_ROTATE_MS = 4000;

function initialMessages(): ChatMessage[] {
  return [createMessage("assistant", WELCOME_MESSAGE)];
}

export function ChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const threadRef = useRef<HTMLDivElement>(null);

  const rotatingPlaceholder = EXAMPLE_PROMPTS[placeholderIndex]?.text ?? "Type a message…";

  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages, isPending]);

  useEffect(() => {
    if (input.trim()) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % EXAMPLE_PROMPTS.length);
    }, PLACEHOLDER_ROTATE_MS);

    return () => clearInterval(interval);
  }, [input]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    const userMessage = createMessage("user", trimmed);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setMessages((current) => [
        ...current,
        createMessage("assistant", data.reply),
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to reach the assistant";
      setError(message);
    } finally {
      setIsPending(false);
    }
  }, [isPending]);

  async function handleRestart() {
    if (isPending) return;

    setMessages(initialMessages());
    setInput("");
    setError(null);
    setPlaceholderIndex(0);
    setIsPending(true);

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: RESET_MESSAGE }),
      });
    } catch {
      // UI is already reset; backend reset is best-effort
    } finally {
      setIsPending(false);
    }
  }

  function handleSend() {
    void sendMessage(input);
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-4 py-10">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-serif text-4xl tracking-[0.18em] text-aura-primary">
            AURA
          </h1>
          <span className="rounded border border-aura-primary/25 bg-white/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-aura-primary">
            MVP
          </span>
        </div>
        <p className="mt-2 text-sm text-aura-text-muted">
          AI Concierge · Demo as {DEMO_CUSTOMER_NAME}
        </p>
        <DemoNav current="chat" variant="inline" />
      </header>

      <div className="flex w-full max-w-[460px] flex-1 flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/60 shadow-[0_20px_60px_rgba(31,110,86,0.08)] backdrop-blur-sm">
        <div className="border-b border-aura-primary/10 bg-aura-primary px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Aura Concierge</p>
                <p className="text-xs text-white/75">
                  {isPending ? "typing…" : "online"}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                onClick={() => void handleRestart()}
                disabled={isPending}
                className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                Start over
              </button>
              <button
                type="button"
                onClick={() => void handleRestart()}
                disabled={isPending}
                className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white/90 transition hover:bg-white/10 disabled:opacity-50"
              >
                Restart
              </button>
            </div>
          </div>
        </div>

        <div
          ref={threadRef}
          className="chat-thread flex min-h-[420px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isPending ? <TypingIndicator /> : null}
        </div>

        {error ? (
          <p className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <ExamplePrompts
          examples={EXAMPLE_PROMPTS}
          onSelect={(text) => void sendMessage(text)}
          disabled={isPending}
        />

        <Composer
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isPending}
          placeholder={input.trim() ? "Type a message…" : rotatingPlaceholder}
        />
      </div>
    </div>
  );
}
