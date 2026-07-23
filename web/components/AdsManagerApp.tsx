"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { AdsChatPreview } from "@/components/ads/AdsChatPreview";
import { AdsMetricsPanel } from "@/components/ads/AdsMetricsPanel";
import { CampaignCreator } from "@/components/ads/CampaignCreator";
import {
  INITIAL_CAMPAIGNS,
  buildInitialPreviewThread,
  createCampaignFromInput,
  type AdCampaign,
  type AdCreative,
  type CreateCampaignInput,
  type PreviewThreadItem,
} from "@/lib/ads/mockMetaAds";

export function AdsManagerApp() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [thread, setThread] = useState<PreviewThreadItem[]>(() =>
    buildInitialPreviewThread(INITIAL_CAMPAIGNS),
  );
  const [status, setStatus] = useState<string | null>(null);

  const handleCreate = useCallback((input: CreateCampaignInput) => {
    const campaign = createCampaignFromInput(input);
    setCampaigns((current) => [campaign, ...current]);
    setThread((current) => [
      ...current,
      {
        kind: "ad",
        id: `live_ad_${campaign.creative.id}`,
        creative: campaign.creative,
        timestamp: new Date(),
      },
      {
        kind: "message",
        id: `live_msg_${campaign.id}`,
        role: "assistant",
        text: `New campaign “${campaign.name}” is pending Meta review — preview injected into this WhatsApp thread.`,
        timestamp: new Date(),
      },
    ]);
    setStatus(`Created “${campaign.name}” · pending review (demo).`);
    window.setTimeout(() => setStatus(null), 4500);
  }, []);

  const handleAdCta = useCallback((creative: AdCreative) => {
    setThread((current) => [
      ...current,
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "user",
        text: `I'm interested in: ${creative.headline}`,
        timestamp: new Date(),
      },
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "assistant",
        text: `Great choice! That Click-to-WhatsApp ad opened this chat. I can check availability or book a consult for “${creative.imageLabel}” — what works for you?`,
        timestamp: new Date(),
      },
    ]);
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aura-primary">
            AURA · MVP
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-wide text-aura-text">
            Ads Manager
          </h1>
          <p className="mt-1 max-w-xl text-sm text-aura-text-muted">
            Demo of Meta Ad Manager / WhatsApp Click-to-WhatsApp — preview ads,
            monitor mock insights, and create campaigns.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-full border border-aura-primary/25 bg-white/70 px-3 py-1.5 text-sm text-aura-primary transition hover:bg-white"
          >
            Open chat
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-aura-primary px-3 py-1.5 text-sm font-medium text-white transition hover:bg-aura-primary-dark"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5 lg:min-h-[720px]">
        <div className="min-h-[480px] lg:row-span-2 lg:min-h-0">
          <AdsChatPreview thread={thread} onAdCta={handleAdCta} />
        </div>
        <div className="min-h-[320px] lg:min-h-0">
          <AdsMetricsPanel campaigns={campaigns} />
        </div>
        <div className="min-h-[380px] lg:min-h-0">
          <CampaignCreator onCreate={handleCreate} status={status} />
        </div>
      </div>
    </div>
  );
}
