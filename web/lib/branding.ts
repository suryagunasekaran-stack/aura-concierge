import { DEMO_SESSION_ID, WELCOME_MESSAGE } from "@/lib/constants";

export type MindboxsBranding = {
  version: 1 | 2;
  colors: Record<string, string | undefined>;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  copy: {
    welcomeMessage?: string;
    clinicName?: string;
    tagline?: string;
    assistantName?: string;
    avatarInitial?: string;
    documentTitle?: string;
  };
  prompts?: {
    systemPrompt?: string;
    persona?: string;
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

  const title =
    branding.copy?.documentTitle?.trim() ||
    branding.copy?.clinicName?.trim() ||
    branding.copy?.assistantName?.trim();
  if (title) {
    document.title = title;
  }

  const iconHref =
    branding.faviconUrl?.trim() || branding.logoUrl?.trim() || "";
  if (iconHref) {
    let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = iconHref;
  }
}

export function sessionIdForBranding(slug: string | null): string {
  if (!slug) return DEMO_SESSION_ID;
  return `${DEMO_SESSION_ID}::${slug}`;
}

/**
 * Welcome message. When a branding slug is active, never fall back to Aura copy.
 */
export function welcomeFromBranding(
  branding: MindboxsBranding | null,
  opts?: { brandingSlug?: string | null },
): string {
  const fromProfile = branding?.copy?.welcomeMessage?.trim();
  if (fromProfile) return fromProfile;
  if (opts?.brandingSlug) {
    return "Hi — I'm your AI concierge. How can I help today?";
  }
  return WELCOME_MESSAGE;
}

export function clinicNameFromBranding(
  branding: MindboxsBranding | null,
  opts?: { brandingSlug?: string | null },
): string {
  const name = branding?.copy?.clinicName?.trim();
  if (name) return name;
  if (opts?.brandingSlug) return "Concierge";
  return "Aura Concierge";
}

export function assistantNameFromBranding(
  branding: MindboxsBranding | null,
  opts?: { brandingSlug?: string | null },
): string {
  const name = branding?.copy?.assistantName?.trim();
  if (name) return name;
  return clinicNameFromBranding(branding, opts);
}

export function taglineFromBranding(
  branding: MindboxsBranding | null,
  opts?: { brandingSlug?: string | null },
): string {
  const tag = branding?.copy?.tagline?.trim();
  if (tag) return tag;
  if (opts?.brandingSlug) return "AI Concierge";
  return "AI Concierge · Demo as Mei Ling";
}

export function avatarInitialFromBranding(
  branding: MindboxsBranding | null,
  opts?: { brandingSlug?: string | null },
): string {
  const initial = branding?.copy?.avatarInitial?.trim();
  if (initial) return initial.slice(0, 2).toUpperCase();
  return (
    clinicNameFromBranding(branding, opts).charAt(0).toUpperCase() || "C"
  );
}

export function knowledgeDocsFromBranding(branding: MindboxsBranding | null) {
  if (!branding?.knowledge?.length) return undefined;
  return branding.knowledge.map((d) => ({
    filename: d.filename,
    content: d.content,
  }));
}
