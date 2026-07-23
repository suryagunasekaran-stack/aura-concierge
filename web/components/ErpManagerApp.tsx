"use client";

import { useCallback, useState } from "react";
import { DemoNav } from "@/components/DemoNav";
import { ErpWhatsAppPreview } from "@/components/erp/ErpWhatsAppPreview";
import { ErpApprovalsPanel, ErpOpsPanel } from "@/components/erp/ErpPanels";
import {
  ACCOUNTING_SYNC,
  FORECAST,
  INITIAL_APPROVALS,
  INITIAL_AUDIT_LOG,
  approveViaWhatsApp,
  buildInitialErpThread,
  type ErpApproval,
  type ErpChatMessage,
  type AuditLogEntry,
} from "@/lib/erp/mockErpIntegration";

export function ErpManagerApp() {
  const [approvals, setApprovals] = useState<ErpApproval[]>(INITIAL_APPROVALS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [thread, setThread] = useState<ErpChatMessage[]>(() =>
    buildInitialErpThread(),
  );
  const [status, setStatus] = useState<string | null>(null);

  const handleApprove = useCallback((id: string) => {
    const approval = approvals.find((a) => a.id === id);
    if (!approval || approval.status !== "pending") return;

    const result = approveViaWhatsApp(approval, "Dr. Lim (Owner)", "owner");

    setApprovals((current) =>
      current.map((a) => (a.id === id ? result.approval : a)),
    );
    setAuditLog((current) => [result.audit, ...current]);
    setThread((current) => [...current, ...result.chatReplies]);
    setStatus(`${approval.erpRef} approved — synced to ${ACCOUNTING_SYNC.provider}.`);
    window.setTimeout(() => setStatus(null), 4500);
  }, [approvals]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aura-primary">
            AURA · MVP
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-wide text-aura-text">
            ERP via WhatsApp
          </h1>
          <p className="mt-1 max-w-xl text-sm text-aura-text-muted">
            Clinic ops over WhatsApp — accounting sync, role-based approvals,
            audit trail, and forecasting connected to your ERP.
          </p>
        </div>
        <DemoNav current="erp" />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2 lg:gap-5 lg:min-h-[720px]">
        <div className="min-h-[480px] lg:row-span-2 lg:min-h-0">
          <ErpWhatsAppPreview thread={thread} />
        </div>
        <div className="min-h-[320px] lg:min-h-0">
          <ErpOpsPanel
            sync={ACCOUNTING_SYNC}
            forecast={FORECAST}
            auditLog={auditLog}
          />
        </div>
        <div className="min-h-[380px] lg:min-h-0">
          <ErpApprovalsPanel
            approvals={approvals}
            onApprove={handleApprove}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}
