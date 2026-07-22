const TRAINING_MS = 5000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function TrainingLoader() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-aura-primary/20 bg-aura-thread/50 px-4 py-10"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center gap-1.5">
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-aura-primary/60" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-aura-primary/60" />
        <span className="typing-dot h-2.5 w-2.5 rounded-full bg-aura-primary/60" />
      </div>
      <p className="mt-4 text-sm font-medium text-aura-primary">Training…</p>
      <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-aura-primary/15">
        <div className="training-progress h-full rounded-full bg-aura-primary/70" />
      </div>
    </div>
  );
}

export { TRAINING_MS, sleep };
