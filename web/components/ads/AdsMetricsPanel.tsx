"use client";

import { useMemo } from "react";
import {
  OBJECTIVE_LABELS,
  STATUS_LABELS,
  aggregateInsights,
  formatCompact,
  formatSgd,
  type AdCampaign,
} from "@/lib/ads/mockMetaAds";

type AdsMetricsPanelProps = {
  campaigns: AdCampaign[];
};

function statusClass(status: AdCampaign["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "bg-aura-thread text-aura-primary";
    case "PAUSED":
      return "bg-amber-50 text-amber-800";
    case "PENDING_REVIEW":
      return "bg-sky-50 text-sky-800";
    default:
      return "bg-aura-thread text-aura-text-muted";
  }
}

export function AdsMetricsPanel({ campaigns }: AdsMetricsPanelProps) {
  const totals = useMemo(() => aggregateInsights(campaigns), [campaigns]);
  const maxSpend = useMemo(
    () => Math.max(...campaigns.map((c) => c.insights.spend), 1),
    [campaigns],
  );

  const kpis = [
    { label: "Impressions", value: formatCompact(totals.impressions) },
    { label: "Clicks", value: formatCompact(totals.clicks) },
    { label: "CTR", value: `${totals.ctr.toFixed(2)}%` },
    { label: "Spend", value: formatSgd(totals.spend) },
    { label: "Conversations", value: formatCompact(totals.conversations) },
    { label: "Cost / lead", value: formatSgd(totals.costPerLead) },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/70 p-4 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg text-aura-text sm:text-xl">
            Ad performance
          </h2>
          <p className="mt-0.5 text-xs text-aura-text-muted">
            Mock insights shaped like Meta Marketing API · WhatsApp placements
          </p>
        </div>
        <span className="rounded-full border border-aura-primary/20 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-aura-primary">
          Meta Ads API
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-aura-primary/10 bg-aura-thread/40 px-2.5 py-2"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-aura-text-muted">
              {kpi.label}
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-aura-text">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
            Spend by campaign
          </h3>
          {campaigns.length ? (
            <ul className="space-y-2">
              {campaigns.map((camp) => (
                <li
                  key={camp.id}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(72px,1.2fr)_52px] items-center gap-2"
                >
                  <span className="truncate text-xs text-aura-text">
                    {camp.name}
                  </span>
                  <div className="h-2 overflow-hidden rounded-full bg-aura-thread">
                    <div
                      className="h-full rounded-full bg-aura-primary/80"
                      style={{
                        width: `${Math.max((camp.insights.spend / maxSpend) * 100, 4)}%`,
                      }}
                    />
                  </div>
                  <span className="text-right text-xs text-aura-text-muted">
                    {formatSgd(camp.insights.spend)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-aura-text-muted">No campaigns yet.</p>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
            Campaigns
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b border-aura-primary/10 text-aura-text-muted">
                <tr>
                  <th className="pb-1.5 pr-2 font-medium">Name</th>
                  <th className="pb-1.5 pr-2 font-medium">Objective</th>
                  <th className="pb-1.5 pr-2 font-medium">Status</th>
                  <th className="pb-1.5 font-medium">Leads</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className="border-b border-aura-primary/8 align-middle"
                  >
                    <td className="max-w-[140px] truncate py-2 pr-2 text-aura-text">
                      {camp.name}
                    </td>
                    <td className="py-2 pr-2 text-aura-text-muted">
                      {OBJECTIVE_LABELS[camp.objective]}
                    </td>
                    <td className="py-2 pr-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${statusClass(camp.status)}`}
                      >
                        {STATUS_LABELS[camp.status]}
                      </span>
                    </td>
                    <td className="py-2 text-aura-text-muted">
                      {camp.insights.leads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
