"use client";

import { useEffect, useRef } from "react";
import { formatTime } from "@/lib/chat";
import {
  CTA_LABELS,
  type AdCreative,
  type PreviewThreadItem,
} from "@/lib/ads/mockMetaAds";

type AdsChatPreviewProps = {
  thread: PreviewThreadItem[];
  onAdCta: (creative: AdCreative) => void;
};

const TONE_STYLES: Record<
  AdCreative["imageTone"],
  { bg: string; accent: string }
> = {
  sage: {
    bg: "linear-gradient(145deg, #1f6e56 0%, #3a8f72 55%, #c9a962 140%)",
    accent: "#e8f0ec",
  },
  gold: {
    bg: "linear-gradient(145deg, #8a7340 0%, #c9a962 50%, #e8d5a3 120%)",
    accent: "#fff8e8",
  },
  mist: {
    bg: "linear-gradient(145deg, #3d5a6c 0%, #6a8fa3 55%, #dce8e2 130%)",
    accent: "#eef4f0",
  },
};

function SponsoredAdCard({
  creative,
  timestamp,
  onCta,
}: {
  creative: AdCreative;
  timestamp: Date;
  onCta: () => void;
}) {
  const tone = TONE_STYLES[creative.imageTone];

  return (
    <div className="message-enter flex justify-start">
      <div className="max-w-[92%] overflow-hidden rounded-2xl rounded-bl-sm border border-aura-primary/15 bg-aura-bubble-in shadow-sm">
        <div className="flex items-center justify-between gap-2 border-b border-aura-primary/8 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aura-text-muted">
            Sponsored · WhatsApp
          </span>
          <span className="text-[10px] text-aura-text-muted">
            Click-to-WhatsApp
          </span>
        </div>

        <div
          className="relative flex h-28 items-end px-3 py-2.5"
          style={{ background: tone.bg }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, white 0%, transparent 45%)",
            }}
          />
          <p
            className="relative text-sm font-semibold tracking-wide"
            style={{ color: tone.accent }}
          >
            {creative.imageLabel}
          </p>
        </div>

        <div className="px-3.5 py-3">
          <p className="text-[11px] font-medium text-aura-primary">
            Aura Aesthetic Clinic
          </p>
          <p className="mt-1 text-sm font-semibold text-aura-text">
            {creative.headline}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-aura-text-muted">
            {creative.body}
          </p>
          <button
            type="button"
            onClick={onCta}
            className="mt-3 w-full rounded-full bg-aura-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-aura-primary-dark"
          >
            {CTA_LABELS[creative.cta]}
          </button>
          <p suppressHydrationWarning className="mt-2 text-right text-[11px] text-aura-text-muted">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrganicBubble({
  role,
  text,
  timestamp,
}: {
  role: "assistant" | "user";
  text: string;
  timestamp: Date;
}) {
  const isUser = role === "user";

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

export function AdsChatPreview({ thread, onAdCta }: AdsChatPreviewProps) {
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
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Aura Concierge</p>
            <p className="text-xs text-white/75">
              WhatsApp · ad preview thread
            </p>
          </div>
        </div>
      </div>

      <div
        ref={threadRef}
        className="chat-thread flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
      >
        {thread.map((item) =>
          item.kind === "ad" ? (
            <SponsoredAdCard
              key={item.id}
              creative={item.creative}
              timestamp={item.timestamp}
              onCta={() => onAdCta(item.creative)}
            />
          ) : (
            <OrganicBubble
              key={item.id}
              role={item.role}
              text={item.text}
              timestamp={item.timestamp}
            />
          ),
        )}
      </div>

      <div className="border-t border-aura-primary/10 bg-white/80 px-4 py-3">
        <p className="text-center text-[11px] text-aura-text-muted">
          Demo feed — sponsored cards mirror Meta Click-to-WhatsApp ads
        </p>
      </div>
    </div>
  );
}
