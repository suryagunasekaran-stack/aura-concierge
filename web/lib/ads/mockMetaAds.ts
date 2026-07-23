/** Mock Meta Marketing / WhatsApp Ads API–shaped types for the demo. */

export type CampaignObjective = "MESSAGES" | "LEADS" | "TRAFFIC";
export type CampaignStatus = "ACTIVE" | "PAUSED" | "PENDING_REVIEW";
export type AdCta =
  | "BOOK_NOW"
  | "LEARN_MORE"
  | "SEND_MESSAGE"
  | "GET_OFFER";

export type AdCreative = {
  id: string;
  campaignId: string;
  headline: string;
  body: string;
  cta: AdCta;
  imageLabel: string;
  imageTone: "sage" | "gold" | "mist";
};

export type CampaignInsights = {
  impressions: number;
  clicks: number;
  /** Meta returns CTR as a percentage string; we keep a number for UI math. */
  ctr: number;
  spend: number;
  conversations: number;
  leads: number;
  currency: "SGD";
};

export type AdCampaign = {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  dailyBudget: number;
  durationDays: number;
  audience: {
    countries: string[];
    ageMin: number;
    ageMax: number;
    interests: string[];
  };
  creative: AdCreative;
  insights: CampaignInsights;
  createdAt: string;
};

export type CreateCampaignInput = {
  name: string;
  objective: CampaignObjective;
  dailyBudget: number;
  durationDays: number;
  headline: string;
  body: string;
  cta: AdCta;
  countries: string;
  ageMin: number;
  ageMax: number;
  interests: string;
};

export const CTA_LABELS: Record<AdCta, string> = {
  BOOK_NOW: "Book now",
  LEARN_MORE: "Learn more",
  SEND_MESSAGE: "Send message",
  GET_OFFER: "Get offer",
};

export const OBJECTIVE_LABELS: Record<CampaignObjective, string> = {
  MESSAGES: "Messages",
  LEADS: "Leads",
  TRAFFIC: "Traffic",
};

export const STATUS_LABELS: Record<CampaignStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  PENDING_REVIEW: "Pending review",
};

const SEED_CREATED = "2026-07-18T09:00:00.000Z";

export const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: "camp_hydra_glow",
    name: "HydraFacial Summer Glow",
    objective: "MESSAGES",
    status: "ACTIVE",
    dailyBudget: 80,
    durationDays: 14,
    audience: {
      countries: ["SG"],
      ageMin: 25,
      ageMax: 45,
      interests: ["Aesthetics", "Skincare", "Wellness"],
    },
    creative: {
      id: "ad_hydra_glow",
      campaignId: "camp_hydra_glow",
      headline: "Glow up this weekend ✨",
      body: "Book a HydraFacial at Aura Aesthetic Clinic — complimentary skin consult with your first visit.",
      cta: "BOOK_NOW",
      imageLabel: "HydraFacial",
      imageTone: "sage",
    },
    insights: {
      impressions: 42840,
      clicks: 2142,
      ctr: 5.0,
      spend: 612.4,
      conversations: 186,
      leads: 94,
      currency: "SGD",
    },
    createdAt: SEED_CREATED,
  },
  {
    id: "camp_laser_clear",
    name: "Pico Laser Clear Skin",
    objective: "LEADS",
    status: "ACTIVE",
    dailyBudget: 120,
    durationDays: 21,
    audience: {
      countries: ["SG"],
      ageMin: 28,
      ageMax: 50,
      interests: ["Laser treatments", "Pigmentation", "Beauty"],
    },
    creative: {
      id: "ad_laser_clear",
      campaignId: "camp_laser_clear",
      headline: "Stubborn spots? We can help",
      body: "Pico laser packages from Aura — chat with our concierge for a personalised quote.",
      cta: "SEND_MESSAGE",
      imageLabel: "Pico Laser",
      imageTone: "mist",
    },
    insights: {
      impressions: 31120,
      clicks: 1245,
      ctr: 4.0,
      spend: 890.15,
      conversations: 142,
      leads: 118,
      currency: "SGD",
    },
    createdAt: "2026-07-12T04:30:00.000Z",
  },
  {
    id: "camp_bridal_edit",
    name: "Bridal Edit Soft Launch",
    objective: "TRAFFIC",
    status: "PAUSED",
    dailyBudget: 60,
    durationDays: 10,
    audience: {
      countries: ["SG", "MY"],
      ageMin: 24,
      ageMax: 40,
      interests: ["Weddings", "Bridal beauty"],
    },
    creative: {
      id: "ad_bridal_edit",
      campaignId: "camp_bridal_edit",
      headline: "Your bridal skin plan",
      body: "Explore Aura’s bridal facial packages — timeline-friendly treatments before the big day.",
      cta: "LEARN_MORE",
      imageLabel: "Bridal Edit",
      imageTone: "gold",
    },
    insights: {
      impressions: 18450,
      clicks: 738,
      ctr: 4.0,
      spend: 310.0,
      conversations: 52,
      leads: 28,
      currency: "SGD",
    },
    createdAt: "2026-07-05T11:15:00.000Z",
  },
];

export type AggregatedInsights = CampaignInsights & {
  costPerLead: number;
  costPerConversation: number;
};

export function aggregateInsights(campaigns: AdCampaign[]): AggregatedInsights {
  const totals = campaigns.reduce(
    (acc, camp) => {
      acc.impressions += camp.insights.impressions;
      acc.clicks += camp.insights.clicks;
      acc.spend += camp.insights.spend;
      acc.conversations += camp.insights.conversations;
      acc.leads += camp.insights.leads;
      return acc;
    },
    {
      impressions: 0,
      clicks: 0,
      spend: 0,
      conversations: 0,
      leads: 0,
    },
  );

  const ctr =
    totals.impressions > 0
      ? Number(((totals.clicks / totals.impressions) * 100).toFixed(2))
      : 0;

  return {
    ...totals,
    ctr,
    currency: "SGD",
    costPerLead:
      totals.leads > 0 ? Number((totals.spend / totals.leads).toFixed(2)) : 0,
    costPerConversation:
      totals.conversations > 0
        ? Number((totals.spend / totals.conversations).toFixed(2))
        : 0,
  };
}

export function formatSgd(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-SG", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

const IMAGE_TONES: AdCreative["imageTone"][] = ["sage", "gold", "mist"];

function pickTone(seed: string): AdCreative["imageTone"] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % IMAGE_TONES.length;
  }
  return IMAGE_TONES[hash] ?? "sage";
}

/** Build a new campaign with synthetic insights scaled from budget. */
export function createCampaignFromInput(
  input: CreateCampaignInput,
): AdCampaign {
  const id = `camp_${crypto.randomUUID().slice(0, 8)}`;
  const creativeId = `ad_${crypto.randomUUID().slice(0, 8)}`;
  const countries = input.countries
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean);
  const interests = input.interests
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  const estimatedImpressions = Math.round(input.dailyBudget * input.durationDays * 38);
  const estimatedCtr =
    input.objective === "MESSAGES" ? 4.8 : input.objective === "LEADS" ? 4.1 : 3.6;
  const estimatedClicks = Math.round((estimatedImpressions * estimatedCtr) / 100);
  const estimatedSpend = Number(
    (input.dailyBudget * Math.min(input.durationDays, 3) * 0.65).toFixed(2),
  );
  const conversations = Math.round(estimatedClicks * 0.09);
  const leads = Math.round(conversations * (input.objective === "LEADS" ? 0.75 : 0.45));

  return {
    id,
    name: input.name.trim(),
    objective: input.objective,
    status: "PENDING_REVIEW",
    dailyBudget: input.dailyBudget,
    durationDays: input.durationDays,
    audience: {
      countries: countries.length ? countries : ["SG"],
      ageMin: input.ageMin,
      ageMax: input.ageMax,
      interests: interests.length ? interests : ["Aesthetics"],
    },
    creative: {
      id: creativeId,
      campaignId: id,
      headline: input.headline.trim(),
      body: input.body.trim(),
      cta: input.cta,
      imageLabel: input.name.trim().slice(0, 28) || "New campaign",
      imageTone: pickTone(input.name),
    },
    insights: {
      impressions: estimatedImpressions,
      clicks: estimatedClicks,
      ctr: estimatedCtr,
      spend: estimatedSpend,
      conversations,
      leads,
      currency: "SGD",
    },
    createdAt: new Date().toISOString(),
  };
}

export type PreviewThreadItem =
  | {
      kind: "message";
      id: string;
      role: "assistant" | "user";
      text: string;
      timestamp: Date;
    }
  | {
      kind: "ad";
      id: string;
      creative: AdCreative;
      timestamp: Date;
    };

export function buildInitialPreviewThread(
  campaigns: AdCampaign[],
): PreviewThreadItem[] {
  const activeCreatives = campaigns
    .filter((c) => c.status === "ACTIVE")
    .map((c) => c.creative);

  const base: PreviewThreadItem[] = [
    {
      kind: "message",
      id: "seed_msg_1",
      role: "assistant",
      text: "Hi Mei Ling ✨ Welcome to Aura Concierge — how can I help today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
    },
  ];

  if (activeCreatives[0]) {
    base.push({
      kind: "ad",
      id: `seed_ad_${activeCreatives[0].id}`,
      creative: activeCreatives[0],
      timestamp: new Date(Date.now() - 1000 * 60 * 16),
    });
  }

  base.push({
    kind: "message",
    id: "seed_msg_2",
    role: "user",
    text: "Wah this HydraFacial promo looks nice, still available ah?",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
  });

  base.push({
    kind: "message",
    id: "seed_msg_3",
    role: "assistant",
    text: "Yes! The complimentary consult still applies this week. Want me to check Saturday slots?",
    timestamp: new Date(Date.now() - 1000 * 60 * 11),
  });

  if (activeCreatives[1]) {
    base.push({
      kind: "ad",
      id: `seed_ad_${activeCreatives[1].id}`,
      creative: activeCreatives[1],
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    });
  }

  return base;
}
