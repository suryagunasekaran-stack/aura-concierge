"use client";

import { useState, type FormEvent } from "react";
import {
  CTA_LABELS,
  OBJECTIVE_LABELS,
  type AdCta,
  type CampaignObjective,
  type CreateCampaignInput,
} from "@/lib/ads/mockMetaAds";

type CampaignCreatorProps = {
  onCreate: (input: CreateCampaignInput) => void;
  status: string | null;
};

const OBJECTIVES = Object.keys(OBJECTIVE_LABELS) as CampaignObjective[];
const CTAS = Object.keys(CTA_LABELS) as AdCta[];

const fieldClass =
  "w-full rounded-lg border border-aura-primary/20 bg-white px-2.5 py-1.5 text-sm text-aura-text outline-none transition focus:border-aura-primary/45";

const labelClass =
  "mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-aura-text-muted";

export function CampaignCreator({ onCreate, status }: CampaignCreatorProps) {
  const [name, setName] = useState("");
  const [objective, setObjective] = useState<CampaignObjective>("MESSAGES");
  const [dailyBudget, setDailyBudget] = useState(75);
  const [durationDays, setDurationDays] = useState(14);
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState<AdCta>("BOOK_NOW");
  const [countries, setCountries] = useState("SG");
  const [ageMin, setAgeMin] = useState(25);
  const [ageMax, setAgeMax] = useState(45);
  const [interests, setInterests] = useState("Aesthetics, Skincare");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !headline.trim() || !body.trim()) return;

    onCreate({
      name,
      objective,
      dailyBudget,
      durationDays,
      headline,
      body,
      cta,
      countries,
      ageMin,
      ageMax,
      interests,
    });

    setName("");
    setHeadline("");
    setBody("");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/70 p-4 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm sm:p-5">
      <div className="mb-3">
        <h2 className="font-serif text-lg text-aura-text sm:text-xl">
          Campaign creator
        </h2>
        <p className="mt-0.5 text-xs text-aura-text-muted">
          Draft a WhatsApp Click-to-WhatsApp campaign · demo create only
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="ads-camp-name">
              Campaign name
            </label>
            <input
              id="ads-camp-name"
              className={fieldClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HydraFacial Weekend Push"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-objective">
              Objective
            </label>
            <select
              id="ads-objective"
              className={fieldClass}
              value={objective}
              onChange={(e) =>
                setObjective(e.target.value as CampaignObjective)
              }
            >
              {OBJECTIVES.map((key) => (
                <option key={key} value={key}>
                  {OBJECTIVE_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-cta">
              CTA
            </label>
            <select
              id="ads-cta"
              className={fieldClass}
              value={cta}
              onChange={(e) => setCta(e.target.value as AdCta)}
            >
              {CTAS.map((key) => (
                <option key={key} value={key}>
                  {CTA_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-budget">
              Daily budget (SGD)
            </label>
            <input
              id="ads-budget"
              type="number"
              min={10}
              max={5000}
              className={fieldClass}
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-duration">
              Duration (days)
            </label>
            <input
              id="ads-duration"
              type="number"
              min={1}
              max={90}
              className={fieldClass}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="ads-headline">
              Ad headline
            </label>
            <input
              id="ads-headline"
              className={fieldClass}
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Glow up this weekend ✨"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="ads-body">
              Ad body
            </label>
            <textarea
              id="ads-body"
              rows={2}
              className={`${fieldClass} resize-none`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Short WhatsApp-friendly copy…"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-countries">
              Countries
            </label>
            <input
              id="ads-countries"
              className={fieldClass}
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="SG, MY"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-interests">
              Interests
            </label>
            <input
              id="ads-interests"
              className={fieldClass}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Aesthetics, Skincare"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-age-min">
              Age min
            </label>
            <input
              id="ads-age-min"
              type="number"
              min={18}
              max={65}
              className={fieldClass}
              value={ageMin}
              onChange={(e) => setAgeMin(Number(e.target.value) || 18)}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="ads-age-max">
              Age max
            </label>
            <input
              id="ads-age-max"
              type="number"
              min={18}
              max={65}
              className={fieldClass}
              value={ageMax}
              onChange={(e) => setAgeMax(Number(e.target.value) || 45)}
            />
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            className="rounded-full bg-aura-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-aura-primary-dark"
          >
            Create campaign
          </button>
          {status ? (
            <p className="text-xs font-medium text-aura-primary">{status}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
