"use client";

import { useEffect, useRef } from "react";
import { formatTime } from "@/lib/chat";
import type { ErpChatMessage } from "@/lib/erp/mockErpIntegration";

type ErpWhatsAppPreviewProps = {
  thread: ErpChatMessage[];
};

function Bubble({
  role,
  text,
  timestamp,
}: {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
}) {
  const isUser = role === "user";
  const isSystem = role === "system";

  if (isSystem) {
    return (
      <div className="message-enter flex justify-center">
        <p className="rounded-full bg-white/80 px-3 py-1 text-[10px] text-aura-text-muted">
          {text}
        </p>
      </div>
    );
  }

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
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        <p
          suppressHydrationWarning
          className={`mt-1.5 text-right text-[11px] ${
            isUser ? "text-white/70" : "text-aura-text-muted"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}

export function ErpWhatsAppPreview({ thread }: ErpWhatsAppPreviewProps) {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [thread]);

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/60 shadow-[0_20px_60px_rgba(31,110,86,0.08)] backdrop-blur-sm">
      <div className="border-b border-aura-primary/10 bg-aura-primary px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
            O
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Aura Ops · WhatsApp</p>
            <p className="text-xs text-white/75">
              Internal · ERP &amp; accounting via chat
            </p>
          </div>
        </div>
      </div>

      <div
        ref={threadRef}
        className="chat-thread flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
      >
        {thread.map((item) => (
          <Bubble
            key={item.id}
            role={item.role}
            text={item.text}
            timestamp={item.timestamp}
          />
        ))}
      </div>

      <div className="border-t border-aura-primary/10 bg-white/80 px-4 py-3">
        <p className="text-center text-[11px] text-aura-text-muted">
          Clinic staff approve POs, sync invoices, and pull forecasts over WhatsApp
        </p>
      </div>
    </div>
  );
}
