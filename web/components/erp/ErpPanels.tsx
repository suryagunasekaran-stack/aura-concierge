"use client";

import {
  ACCOUNTING_SYNC,
  FORECAST,
  INITIAL_AUDIT_LOG,
  approvalTypeLabel,
  auditActionLabel,
  formatSgd,
  type AccountingSync,
  type AuditLogEntry,
  type ErpApproval,
  type ForecastPoint,
} from "@/lib/erp/mockErpIntegration";

type ErpOpsPanelProps = {
  sync: AccountingSync;
  forecast: ForecastPoint[];
  auditLog: AuditLogEntry[];
};

function formatSyncTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-SG", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function ErpOpsPanel({ sync, forecast, auditLog }: ErpOpsPanelProps) {
  const maxRevenue = Math.max(...forecast.map((p) => p.revenue), 1);
  const latest = forecast[forecast.length - 1];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/70 p-4 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg text-aura-text sm:text-xl">
            ERP &amp; accounting
          </h2>
          <p className="mt-0.5 text-xs text-aura-text-muted">
            {sync.provider} sync · audit trail · revenue forecast
          </p>
        </div>
        <span className="rounded-full border border-aura-primary/20 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-aura-primary">
          {sync.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: "Invoices synced", value: String(sync.invoicesSynced) },
          { label: "Receivables", value: formatSgd(sync.outstandingReceivables) },
          { label: "Payables", value: formatSgd(sync.outstandingPayables) },
          {
            label: "Sep net (proj.)",
            value: latest ? formatSgd(latest.net) : "—",
          },
        ].map((kpi) => (
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

      <p className="mt-3 text-[11px] text-aura-text-muted">
        Last sync: {formatSyncTime(sync.lastSyncAt)} · via WhatsApp ERP connector
      </p>

      <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
            Revenue forecast
          </h3>
          <ul className="space-y-2">
            {forecast.map((point) => (
              <li
                key={point.month}
                className="grid grid-cols-[40px_1fr_72px] items-center gap-2"
              >
                <span className="text-xs text-aura-text-muted">{point.month}</span>
                <div className="h-2 overflow-hidden rounded-full bg-aura-thread">
                  <div
                    className="h-full rounded-full bg-aura-primary/80"
                    style={{
                      width: `${Math.max((point.revenue / maxRevenue) * 100, 4)}%`,
                    }}
                  />
                </div>
                <span className="text-right text-xs text-aura-text">
                  {formatSgd(point.net)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
            Audit log
          </h3>
          <ul className="space-y-2">
            {auditLog.slice(0, 5).map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-aura-primary/8 bg-white/60 px-2.5 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-aura-thread px-1.5 py-0.5 text-[10px] font-medium text-aura-primary">
                    {auditActionLabel(entry.action)}
                  </span>
                  <span className="text-[10px] text-aura-text-muted">
                    {entry.erpSystem}
                  </span>
                </div>
                <p className="mt-1 text-xs text-aura-text">{entry.detail}</p>
                <p className="mt-0.5 text-[10px] text-aura-text-muted">
                  {entry.actor} · {formatSyncTime(entry.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type ErpApprovalsPanelProps = {
  approvals: ErpApproval[];
  onApprove: (id: string) => void;
  status: string | null;
};

export function ErpApprovalsPanel({
  approvals,
  onApprove,
  status,
}: ErpApprovalsPanelProps) {
  const pending = approvals.filter((a) => a.status === "pending");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/70 p-4 shadow-[0_12px_40px_rgba(31,110,86,0.06)] backdrop-blur-sm sm:p-5">
      <div className="mb-3">
        <h2 className="font-serif text-lg text-aura-text sm:text-xl">
          Role-based approvals
        </h2>
        <p className="mt-0.5 text-xs text-aura-text-muted">
          Manager / owner sign-off from WhatsApp · posted to ERP &amp;{" "}
          {ACCOUNTING_SYNC.provider}
        </p>
      </div>

      {status ? (
        <p className="mb-3 rounded-xl border border-aura-primary/20 bg-white/80 px-3 py-2 text-xs font-medium text-aura-primary">
          {status}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
        {pending.length ? (
          pending.map((approval) => (
            <div
              key={approval.id}
              className="rounded-xl border border-aura-primary/12 bg-white/80 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-aura-primary">
                    {approval.erpRef}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-aura-text">
                    {approval.title}
                  </p>
                </div>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                  Pending
                </span>
              </div>
              <p className="mt-2 text-xs text-aura-text-muted">
                {approvalTypeLabel(approval.type)} · {formatSgd(approval.amount)} ·
                requested by {approval.requestedBy}
              </p>
              <p className="mt-1 text-[10px] text-aura-text-muted">
                Requires: {approval.requiredRole}
              </p>
              <button
                type="button"
                onClick={() => onApprove(approval.id)}
                className="mt-3 rounded-full bg-aura-primary px-3 py-1.5 text-xs font-medium text-white transition hover:bg-aura-primary-dark"
              >
                Approve via WhatsApp
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-aura-text-muted">No pending approvals.</p>
        )}

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
            Recently approved
          </h3>
          <ul className="space-y-2">
            {approvals
              .filter((a) => a.status === "approved")
              .map((approval) => (
                <li
                  key={approval.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-aura-primary/8 px-2.5 py-2 text-xs"
                >
                  <span className="truncate text-aura-text">
                    {approval.erpRef} · {approval.title}
                  </span>
                  <span className="shrink-0 text-aura-text-muted">
                    {formatSgd(approval.amount)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
