"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageContentProps = {
  text: string;
  variant: "user" | "assistant";
};

export function MessageContent({ text, variant }: MessageContentProps) {
  if (variant === "user") {
    return (
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{text}</p>
    );
  }

  return (
    <div className="chat-markdown text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0">{children}</p>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1.5 mt-3 first:mt-0 text-[13px] font-semibold uppercase tracking-[0.08em] text-aura-primary">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-1 mt-2.5 text-[14px] font-semibold text-aura-text">
              {children}
            </h4>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-aura-text">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="mb-2.5 space-y-1.5 pl-0 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2.5 list-decimal space-y-1.5 pl-5 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2 text-[14px] leading-snug text-aura-text">
              <span
                aria-hidden="true"
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-aura-primary/70"
              />
              <span className="min-w-0 flex-1">{children}</span>
            </li>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-aura-primary underline underline-offset-2"
            >
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
