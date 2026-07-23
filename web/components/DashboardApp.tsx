"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TrainingLoader, TRAINING_MS, sleep } from "@/components/TrainingLoader";

type Tab = "intents" | "knowledge";

type IntentEvent = {
  id: number;
  session_id: string;
  user_text: string;
  intent: string;
  confidence: number | null;
  tool_calls: string[] | unknown;
  reply_preview: string | null;
  created_at: string;
};

type IntentStats = {
  total: number;
  byIntent: { intent: string; count: number }[];
  labels?: string[];
};

type TrainingDoc = {
  id: number;
  filename: string;
  byte_size: number;
  created_at: string;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

function asToolList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  return [];
}

export function DashboardApp() {
  const [tab, setTab] = useState<Tab>("intents");
  const [stats, setStats] = useState<IntentStats | null>(null);
  const [events, setEvents] = useState<IntentEvent[]>([]);
  const [intentFilter, setIntentFilter] = useState("");
  const [docs, setDocs] = useState<TrainingDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const maxCount = useMemo(() => {
    if (!stats?.byIntent?.length) return 1;
    return Math.max(...stats.byIntent.map((row) => row.count), 1);
  }, [stats]);

  const loadIntents = useCallback(async () => {
    const qs = intentFilter
      ? `?limit=50&intent=${encodeURIComponent(intentFilter)}`
      : "?limit=50";
    const [statsRes, eventsRes] = await Promise.all([
      fetch("/api/intents/stats"),
      fetch(`/api/intents${qs}`),
    ]);
    const statsData = await statsRes.json();
    const eventsData = await eventsRes.json();

    if (!statsRes.ok) {
      throw new Error(statsData.message ?? statsData.error ?? "Failed to load stats");
    }
    if (!eventsRes.ok) {
      throw new Error(
        eventsData.message ?? eventsData.error ?? "Failed to load intents",
      );
    }

    setStats(statsData);
    setEvents(eventsData.events ?? []);
  }, [intentFilter]);

  const loadTraining = useCallback(async () => {
    const res = await fetch("/api/training");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message ?? data.error ?? "Failed to load training");
    }
    setDocs(data.documents ?? []);
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      if (tab === "intents") {
        await loadIntents();
      } else {
        await loadTraining();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setBusy(false);
    }
  }, [tab, loadIntents, loadTraining]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleUpload(file: File | null) {
    if (!file || isTraining) return;
    setIsTraining(true);
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const content = await file.text();
      const uploadTask = (async () => {
        const res = await fetch("/api/training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, content }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message ?? data.error ?? "Upload failed");
        }
        return data;
      })();

      await Promise.all([sleep(TRAINING_MS), uploadTask]);
      setStatus(`Uploaded ${file.name}.`);
      await loadTraining();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsTraining(false);
      setBusy(false);
    }
  }

  async function handleClearIntents() {
    if (!confirm("Clear all intent history?")) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/intents", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Clear failed");
      }
      setIntentFilter("");
      setStatus(`Cleared ${data.deleted ?? 0} intent event(s).`);
      await loadIntents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Clear failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleResetKnowledge() {
    if (!confirm("Clear all uploaded training documents?")) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/training", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Reset failed");
      }
      setStatus(`Reset complete — removed ${data.deleted ?? 0} document(s).`);
      await loadTraining();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteDoc(id: number) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/training/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message ?? data.error ?? "Delete failed");
      }
      await loadTraining();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aura-primary">
            AURA · MVP
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-wide text-aura-text">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-aura-text-muted">
            Intent analytics and knowledge training demo
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={busy}
            className="rounded-full border border-aura-primary/25 bg-white/70 px-3 py-1.5 text-sm text-aura-primary transition hover:bg-white disabled:opacity-50"
          >
            Refresh
          </button>
          <Link
            href="/ads"
            className="rounded-full border border-aura-primary/25 bg-white/70 px-3 py-1.5 text-sm text-aura-primary transition hover:bg-white"
          >
            Ads · Meta &amp; WhatsApp
          </Link>
          <Link
            href="/"
            className="rounded-full bg-aura-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-aura-primary-dark"
          >
            Open chat
          </Link>
        </div>
      </header>

      <div className="mb-6 flex gap-1 rounded-full border border-aura-primary/15 bg-white/60 p-1 backdrop-blur-sm">
        {(
          [
            ["intents", "Intents"],
            ["knowledge", "Knowledge"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === id
                ? "bg-aura-primary text-white"
                : "text-aura-text-muted hover:text-aura-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="mb-4 rounded-xl border border-aura-primary/20 bg-white/80 px-4 py-3 text-sm text-aura-primary">
          {status}
        </p>
      ) : null}

      {tab === "intents" ? (
        <section className="space-y-6">
          <div className="rounded-2xl border border-aura-primary/12 bg-white/70 p-5 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-aura-text">Intent mix</h2>
              <div className="flex items-center gap-3">
                <p className="text-sm text-aura-text-muted">
                  {stats?.total ?? 0} classified turns
                </p>
                <button
                  type="button"
                  onClick={() => void handleClearIntents()}
                  disabled={busy || (stats?.total ?? 0) === 0}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  Clear all
                </button>
              </div>
            </div>
            {stats?.byIntent?.length ? (
              <ul className="space-y-2.5">
                {stats.byIntent.map((row) => (
                  <li key={row.intent} className="grid grid-cols-[140px_1fr_40px] items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setIntentFilter((current) =>
                          current === row.intent ? "" : row.intent,
                        )
                      }
                      className="truncate text-left text-sm text-aura-text hover:text-aura-primary"
                    >
                      {row.intent}
                    </button>
                    <div className="h-2 overflow-hidden rounded-full bg-aura-thread">
                      <div
                        className="h-full rounded-full bg-aura-primary/80"
                        style={{
                          width: `${Math.max((row.count / maxCount) * 100, 4)}%`,
                        }}
                      />
                    </div>
                    <span className="text-right text-sm text-aura-text-muted">
                      {row.count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-aura-text-muted">
                No intents yet — send a few chat messages first.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-aura-primary/12 bg-white/70 p-5 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-aura-text">Recent messages</h2>
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="rounded-lg border border-aura-primary/20 bg-white px-3 py-1.5 text-sm"
              >
                <option value="">All intents</option>
                {(stats?.labels ?? stats?.byIntent?.map((r) => r.intent) ?? []).map(
                  (label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-aura-primary/10 text-aura-text-muted">
                  <tr>
                    <th className="pb-2 pr-3 font-medium">Time</th>
                    <th className="pb-2 pr-3 font-medium">Intent</th>
                    <th className="pb-2 pr-3 font-medium">Message</th>
                    <th className="pb-2 font-medium">Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-aura-primary/8 align-top"
                    >
                      <td className="py-3 pr-3 whitespace-nowrap text-aura-text-muted">
                        {formatTime(event.created_at)}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="rounded-md bg-aura-thread px-2 py-0.5 text-xs font-medium text-aura-primary">
                          {event.intent}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-aura-text">
                        {event.user_text}
                      </td>
                      <td className="py-3 text-aura-text-muted">
                        {asToolList(event.tool_calls).join(", ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!events.length ? (
                <p className="py-6 text-sm text-aura-text-muted">No events yet.</p>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="rounded-2xl border border-aura-primary/12 bg-white/70 p-5 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-xl text-aura-text">
                Training documents
              </h2>
              <button
                type="button"
                onClick={() => void handleResetKnowledge()}
                disabled={busy || docs.length === 0}
                className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                Reset knowledge
              </button>
            </div>

            {isTraining ? (
              <TrainingLoader />
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-aura-primary/30 bg-aura-thread/40 px-4 py-8 text-center transition hover:border-aura-primary/50 hover:bg-aura-thread/70">
                <span className="text-sm font-medium text-aura-primary">
                  Upload a .txt file
                </span>
                <input
                  type="file"
                  accept=".txt,text/plain"
                  className="sr-only"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    e.target.value = "";
                    void handleUpload(file);
                  }}
                />
              </label>
            )}

            <ul className="mt-5 divide-y divide-aura-primary/10">
              {docs.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-aura-text">
                      {doc.filename}
                    </p>
                    <p className="text-xs text-aura-text-muted">
                      {formatBytes(doc.byte_size)} · {formatTime(doc.created_at)}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void handleDeleteDoc(doc.id)}
                    className="shrink-0 text-xs font-medium text-red-700 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {!docs.length ? (
                <li className="py-4 text-sm text-aura-text-muted">
                  No documents uploaded yet.
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
