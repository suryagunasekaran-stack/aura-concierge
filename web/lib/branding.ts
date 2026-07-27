import { DEMO_SESSION_ID, WELCOME_MESSAGE } from "@/lib/constants";

export type MindboxsBranding = {
  version: 1;
  colors: Record<string, string | undefined>;
  logoUrl?: string | null;
  copy: {
    welcomeMessage?: string;
    clinicName?: string;
    tagline?: string;
    assistantName?: string;
    avatarInitial?: string;
  };
  knowledge: { id: string; filename: string; content: string; byteSize: number }[];
  updatedAt: string;
};

const COLOR_TO_CSS: Record<string, string> = {
  primary: "--aura-primary",
  primaryDark: "--aura-primary-dark",
  text: "--aura-text",
  textMuted: "--aura-text-muted",
  pageStart: "--aura-page-start",
  pageEnd: "--aura-page-end",
  bubbleIn: "--aura-bubble-in",
  thread: "--aura-thread",
  gold: "--aura-gold",
};

export function brandingHost(): string {
  return (
    process.env.NEXT_PUBLIC_MINDBOXS_URL ||
    process.env.MINDBOXS_URL ||
    "https://mindboxs-mvp.vercel.app"
  );
}

export function readBrandingSlugFromLocation(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("branding") || params.get("tenant") || null;
}

export async function fetchBranding(
  slug: string,
): Promise<MindboxsBranding | null> {
  const url = new URL(
    `${brandingHost()}/api/branding/${encodeURIComponent(slug)}`,
  );
  url.searchParams.set("_", String(Date.now()));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as MindboxsBranding;
}

export function applyBrandingToDocument(branding: MindboxsBranding) {
  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(COLOR_TO_CSS)) {
    const value = branding.colors?.[key];
    if (value) root.style.setProperty(cssVar, value);
  }
}

export function sessionIdForBranding(slug: string | null): string {
  if (!slug) return DEMO_SESSION_ID;
  return `${DEMO_SESSION_ID}::${slug}`;
}

export function welcomeFromBranding(branding: MindboxsBranding | null): string {
  return branding?.copy?.welcomeMessage?.trim() || WELCOME_MESSAGE;
}

export function clinicNameFromBranding(
  branding: MindboxsBranding | null,
): string {
  return branding?.copy?.clinicName?.trim() || "Aura Concierge";
}

export function assistantNameFromBranding(
  branding: MindboxsBranding | null,
): string {
  return (
    branding?.copy?.assistantName?.trim() ||
    clinicNameFromBranding(branding)
  );
}

export function taglineFromBranding(branding: MindboxsBranding | null): string {
  return branding?.copy?.tagline?.trim() || "AI Concierge · Demo as Mei Ling";
}

export function avatarInitialFromBranding(
  branding: MindboxsBranding | null,
): string {
  const initial = branding?.copy?.avatarInitial?.trim();
  if (initial) return initial.slice(0, 2).toUpperCase();
  return clinicNameFromBranding(branding).charAt(0).toUpperCase() || "A";
}

export function knowledgeDocsFromBranding(branding: MindboxsBranding | null) {
  if (!branding?.knowledge?.length) return undefined;
  return branding.knowledge.map((d) => ({
    filename: d.filename,
    content: d.content,
  }));
}
