/** Mock ERP / accounting integration data for WhatsApp ops demo. */

export type ErpRole = "owner" | "manager" | "finance" | "staff";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type AuditAction =
  | "approval_requested"
  | "approval_granted"
  | "invoice_synced"
  | "forecast_generated"
  | "po_created";

export type ErpApproval = {
  id: string;
  type: "purchase_order" | "refund" | "vendor_payment" | "inventory_adjustment";
  title: string;
  amount: number;
  currency: "SGD";
  requestedBy: string;
  requiredRole: ErpRole;
  status: ApprovalStatus;
  erpRef: string;
  createdAt: string;
};

export type AccountingSync = {
  provider: "Xero" | "QuickBooks";
  status: "connected" | "syncing" | "error";
  lastSyncAt: string;
  invoicesSynced: number;
  outstandingReceivables: number;
  outstandingPayables: number;
  currency: "SGD";
};

export type ForecastPoint = {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
};

export type AuditLogEntry = {
  id: string;
  action: AuditAction;
  actor: string;
  role: ErpRole;
  detail: string;
  erpSystem: string;
  timestamp: string;
};

export type ErpChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
  /** Links a chat turn to an approval or audit event */
  linkedApprovalId?: string;
};

export const ACCOUNTING_SYNC: AccountingSync = {
  provider: "Xero",
  status: "connected",
  lastSyncAt: "2026-07-23T01:45:00.000Z",
  invoicesSynced: 1284,
  outstandingReceivables: 42850,
  outstandingPayables: 18620,
  currency: "SGD",
};

export const INITIAL_APPROVALS: ErpApproval[] = [
  {
    id: "appr_po_4521",
    type: "purchase_order",
    title: "Dermal filler stock — Allergan batch",
    amount: 12400,
    currency: "SGD",
    requestedBy: "Sarah (Ops)",
    requiredRole: "manager",
    status: "pending",
    erpRef: "PO-4521",
    createdAt: "2026-07-23T02:10:00.000Z",
  },
  {
    id: "appr_ref_881",
    type: "refund",
    title: "Partial refund — HydraFacial no-show policy",
    amount: 180,
    currency: "SGD",
    requestedBy: "Front desk",
    requiredRole: "manager",
    status: "pending",
    erpRef: "RF-881",
    createdAt: "2026-07-23T01:55:00.000Z",
  },
  {
    id: "appr_vp_220",
    type: "vendor_payment",
    title: "Laser consumables — vendor Net-30",
    amount: 3200,
    currency: "SGD",
    requestedBy: "Finance bot",
    requiredRole: "finance",
    status: "approved",
    erpRef: "VP-220",
    createdAt: "2026-07-22T09:30:00.000Z",
  },
];

export const FORECAST: ForecastPoint[] = [
  { month: "May", revenue: 118000, expenses: 72000, net: 46000 },
  { month: "Jun", revenue: 124500, expenses: 74800, net: 49700 },
  { month: "Jul", revenue: 131200, expenses: 76900, net: 54300 },
  { month: "Aug", revenue: 138400, expenses: 79200, net: 59200 },
  { month: "Sep", revenue: 145800, expenses: 81800, net: 64000 },
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "log_1",
    action: "invoice_synced",
    actor: "Aura ERP connector",
    role: "finance",
    detail: "42 invoices pushed to Xero · batch #20260723-01",
    erpSystem: "Xero",
    timestamp: "2026-07-23T01:45:00.000Z",
  },
  {
    id: "log_2",
    action: "approval_requested",
    actor: "Sarah (Ops)",
    role: "staff",
    detail: "PO-4521 submitted for manager approval via WhatsApp",
    erpSystem: "Internal ERP",
    timestamp: "2026-07-23T02:10:00.000Z",
  },
  {
    id: "log_3",
    action: "forecast_generated",
    actor: "Aura forecasting",
    role: "finance",
    detail: "Rolling 90-day revenue forecast refreshed",
    erpSystem: "Internal ERP",
    timestamp: "2026-07-22T16:00:00.000Z",
  },
  {
    id: "log_4",
    action: "approval_granted",
    actor: "Dr. Lim (Owner)",
    role: "owner",
    detail: "VP-220 vendor payment approved from WhatsApp",
    erpSystem: "Xero",
    timestamp: "2026-07-22T09:32:00.000Z",
  },
];

export function formatSgd(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildInitialErpThread(): ErpChatMessage[] {
  return [
    {
      id: "erp_msg_1",
      role: "assistant",
      text: "Hi Dr. Lim — Aura Ops on WhatsApp. I’m synced with Xero and your internal ERP. What do you need?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: "erp_msg_2",
      role: "user",
      text: "Any POs waiting for my approval?",
      timestamp: new Date(Date.now() - 1000 * 60 * 22),
    },
    {
      id: "erp_msg_3",
      role: "assistant",
      text: "Yes — 2 pending:\n\n• PO-4521 · Dermal filler stock · S$12,400 · Sarah (Ops)\n• RF-881 · Partial refund · S$180 · Front desk\n\nReply “approve PO-4521” or tap Approve in the panel.",
      timestamp: new Date(Date.now() - 1000 * 60 * 21),
      linkedApprovalId: "appr_po_4521",
    },
    {
      id: "erp_msg_4",
      role: "user",
      text: "Show July forecast vs expenses",
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
    {
      id: "erp_msg_5",
      role: "assistant",
      text: "July forecast (ERP + Xero actuals):\n\nRevenue S$131,200 · Expenses S$76,900 · Net S$54,300\n\nSep projection net S$64,000 (+18% vs Jul). Full chart is in the dashboard panel.",
      timestamp: new Date(Date.now() - 1000 * 60 * 13),
    },
  ];
}

export function approvalTypeLabel(type: ErpApproval["type"]): string {
  switch (type) {
    case "purchase_order":
      return "Purchase order";
    case "refund":
      return "Refund";
    case "vendor_payment":
      return "Vendor payment";
    case "inventory_adjustment":
      return "Inventory";
    default:
      return type;
  }
}

export function auditActionLabel(action: AuditAction): string {
  switch (action) {
    case "approval_requested":
      return "Approval requested";
    case "approval_granted":
      return "Approved";
    case "invoice_synced":
      return "Invoice sync";
    case "forecast_generated":
      return "Forecast";
    case "po_created":
      return "PO created";
    default:
      return action;
  }
}

export function approveViaWhatsApp(
  approval: ErpApproval,
  actor: string,
  role: ErpRole,
): { approval: ErpApproval; audit: AuditLogEntry; chatReplies: ErpChatMessage[] } {
  const now = new Date();
  const updated: ErpApproval = { ...approval, status: "approved" };

  const audit: AuditLogEntry = {
    id: `log_${crypto.randomUUID().slice(0, 8)}`,
    action: "approval_granted",
    actor,
    role,
    detail: `${approval.erpRef} approved via WhatsApp · posted to ${ACCOUNTING_SYNC.provider}`,
    erpSystem: ACCOUNTING_SYNC.provider,
    timestamp: now.toISOString(),
  };

  const chatReplies: ErpChatMessage[] = [
    {
      id: crypto.randomUUID(),
      role: "user",
      text: `Approve ${approval.erpRef}`,
      timestamp: now,
    },
    {
      id: crypto.randomUUID(),
      role: "assistant",
      text: `Done — ${approval.erpRef} approved and logged. ${ACCOUNTING_SYNC.provider} sync queued. Audit trail updated.`,
      timestamp: new Date(now.getTime() + 500),
      linkedApprovalId: approval.id,
    },
  ];

  return { approval: updated, audit, chatReplies };
}
