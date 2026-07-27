import { DEMO_SESSION_ID, WELCOME_MESSAGE } from "@/lib/constants";

export type MindboxsBranding = {
  version: 1;
  colors: Record<string, string | undefined>;
  logoUrl?: string | null;
  copy: {
    welcomeMessage?: string;
    clinicName?: string;
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
  const url = `${brandingHost()}/api/branding/${encodeURIComponent(slug)}`;
  const res = await fetch(url, { cache: "no-store" });
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

export function knowledgeDocsFromBranding(branding: MindboxsBranding | null) {
  if (!branding?.knowledge?.length) return undefined;
  return branding.knowledge.map((d) => ({
    filename: d.filename,
    content: d.content,
  }));
}
