import type { ExamplePrompt } from "@/lib/examples";

type ExamplePromptsProps = {
  examples: ExamplePrompt[];
  onSelect: (text: string) => void;
  disabled: boolean;
};

export function ExamplePrompts({
  examples,
  onSelect,
  disabled,
}: ExamplePromptsProps) {
  return (
    <div className="border-t border-aura-primary/8 bg-white/80 px-4 py-3 backdrop-blur-sm">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-aura-text-muted">
        Try an example
      </p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {examples.map((example) => (
          <button
            key={example.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(example.text)}
            className="shrink-0 rounded-full border border-aura-primary/15 bg-white px-3 py-1.5 text-[13px] text-aura-text transition hover:border-aura-primary/35 hover:bg-aura-page-start disabled:cursor-not-allowed disabled:opacity-50"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
