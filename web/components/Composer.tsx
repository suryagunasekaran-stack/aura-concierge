"use client";

import { FormEvent, KeyboardEvent } from "react";

type ComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder: string;
};

export function Composer({
  value,
  onChange,
  onSend,
  disabled,
  placeholder,
}: ComposerProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!value.trim() || disabled) return;
      onSend();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-aura-primary/10 bg-white/90 px-4 py-3 backdrop-blur-sm"
    >
      <textarea
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="max-h-28 min-h-[42px] flex-1 resize-none rounded-2xl border border-aura-primary/15 bg-white px-4 py-2.5 text-[15px] text-aura-text outline-none transition placeholder:text-aura-text-muted/70 focus:border-aura-primary/40 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-aura-primary text-white transition hover:bg-aura-primary-dark disabled:cursor-not-allowed disabled:opacity-45"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5 translate-x-px"
          aria-hidden="true"
        >
          <path d="M3.4 20.6 21 12 3.4 3.4l-.9 7.3 10.2 1.5-10.2 1.5.9 7.3z" />
        </svg>
      </button>
    </form>
  );
}
