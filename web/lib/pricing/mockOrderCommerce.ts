/** Mock WhatsApp order · payment · invoice commerce flow. */

export type OrderStep = "browse" | "order" | "payment" | "invoice";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "SGD";
};

export type OrderLine = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
};

export type CommerceOrder = {
  id: string;
  orderRef: string;
  customerName: string;
  lines: OrderLine[];
  subtotal: number;
  gst: number;
  total: number;
  currency: "SGD";
  status: "draft" | "confirmed" | "paid";
  createdAt: string;
};

export type PaymentRecord = {
  id: string;
  orderRef: string;
  method: "PayNow" | "Card";
  amount: number;
  status: "pending" | "completed";
  paidAt: string | null;
};

export type InvoiceRecord = {
  id: string;
  invoiceNo: string;
  orderRef: string;
  customerName: string;
  amount: number;
  gst: number;
  total: number;
  issuedAt: string;
  erpSync: "Xero";
};

export type CommerceChatItem =
  | {
      kind: "message";
      id: string;
      role: "user" | "assistant";
      text: string;
      timestamp: Date;
    }
  | {
      kind: "product";
      id: string;
      product: Product;
      timestamp: Date;
    }
  | {
      kind: "order";
      id: string;
      order: CommerceOrder;
      timestamp: Date;
    }
  | {
      kind: "payment";
      id: string;
      payment: PaymentRecord;
      timestamp: Date;
    }
  | {
      kind: "invoice";
      id: string;
      invoice: InvoiceRecord;
      timestamp: Date;
    };

export const CATALOG: Product[] = [
  {
    id: "prod_serum",
    name: "Aura Post-care Serum Bundle",
    description: "Hydrating serum + SPF 50 · clinic retail favourite",
    price: 145,
    currency: "SGD",
  },
  {
    id: "prod_cleanser",
    name: "Gentle Gel Cleanser 200ml",
    description: "Daily cleanser for post-laser recovery",
    price: 68,
    currency: "SGD",
  },
];

const GST_RATE = 0.09;
const BASE_TS = new Date("2026-07-23T02:00:00.000Z").getTime();

function ts(minutesAgo: number): Date {
  return new Date(BASE_TS - minutesAgo * 60 * 1000);
}

export function formatSgd(amount: number): string {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function stepLabel(step: OrderStep): string {
  switch (step) {
    case "browse":
      return "Browse";
    case "order":
      return "Order";
    case "payment":
      return "Payment";
    case "invoice":
      return "Invoice";
    default:
      return step;
  }
}

export function buildOrder(
  product: Product,
  customerName: string,
  qty = 1,
): CommerceOrder {
  const subtotal = product.price * qty;
  const gst = Number((subtotal * GST_RATE).toFixed(2));
  const total = Number((subtotal + gst).toFixed(2));
  const suffix = crypto.randomUUID().slice(0, 4).toUpperCase();

  return {
    id: `ord_${suffix}`,
    orderRef: `OR-${suffix}`,
    customerName,
    lines: [
      {
        productId: product.id,
        name: product.name,
        qty,
        unitPrice: product.price,
      },
    ],
    subtotal,
    gst,
    total,
    currency: "SGD",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
}

export function buildPayment(order: CommerceOrder): PaymentRecord {
  return {
    id: `pay_${order.id}`,
    orderRef: order.orderRef,
    method: "PayNow",
    amount: order.total,
    status: "pending",
    paidAt: null,
  };
}

export function buildInvoice(
  order: CommerceOrder,
  payment: PaymentRecord,
): InvoiceRecord {
  return {
    id: `inv_${order.id}`,
    invoiceNo: `INV-${order.orderRef.replace("OR-", "")}`,
    orderRef: order.orderRef,
    customerName: order.customerName,
    amount: order.subtotal,
    gst: order.gst,
    total: order.total,
    issuedAt: payment.paidAt ?? new Date().toISOString(),
    erpSync: "Xero",
  };
}

export function buildInitialCommerceThread(): CommerceChatItem[] {
  const product = CATALOG[0]!;

  return [
    {
      kind: "message",
      id: "oc_msg_1",
      role: "assistant",
      text: "Hi Mei Ling ✨ Need anything from our retail shelf?",
      timestamp: ts(18),
    },
    {
      kind: "message",
      id: "oc_msg_2",
      role: "user",
      text: "Got the post-care serum bundle ah? How much?",
      timestamp: ts(16),
    },
    {
      kind: "message",
      id: "oc_msg_3",
      role: "assistant",
      text: "Yes! Here’s the bundle we recommend after HydraFacial:",
      timestamp: ts(15),
    },
    {
      kind: "product",
      id: "oc_prod_1",
      product,
      timestamp: ts(14),
    },
  ];
}

export function placeOrderMessages(
  product: Product,
  customerName: string,
): { items: CommerceChatItem[]; order: CommerceOrder; step: OrderStep } {
  const now = new Date();
  const order = buildOrder(product, customerName);

  return {
    step: "order",
    order,
    items: [
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "user",
        text: `Order 1 × ${product.name} please`,
        timestamp: now,
      },
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Order confirmed — summary below. Ready to pay?",
        timestamp: new Date(now.getTime() + 500),
      },
      {
        kind: "order",
        id: crypto.randomUUID(),
        order,
        timestamp: new Date(now.getTime() + 900),
      },
    ],
  };
}

export function paymentMessages(
  order: CommerceOrder,
): { items: CommerceChatItem[]; payment: PaymentRecord; step: OrderStep } {
  const now = new Date();
  const payment = buildPayment(order);

  return {
    step: "payment",
    payment,
    items: [
      {
        kind: "payment",
        id: crypto.randomUUID(),
        payment,
        timestamp: now,
      },
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Tap PayNow to complete — I’ll issue your invoice right after.",
        timestamp: new Date(now.getTime() + 400),
      },
    ],
  };
}

export function completePaymentMessages(
  order: CommerceOrder,
  payment: PaymentRecord,
): {
  items: CommerceChatItem[];
  payment: PaymentRecord;
  invoice: InvoiceRecord;
  order: CommerceOrder;
  step: OrderStep;
} {
  const now = new Date();
  const paidPayment: PaymentRecord = {
    ...payment,
    status: "completed",
    paidAt: now.toISOString(),
  };
  const paidOrder: CommerceOrder = { ...order, status: "paid" };
  const invoice = buildInvoice(paidOrder, paidPayment);

  return {
    step: "invoice",
    order: paidOrder,
    payment: paidPayment,
    invoice,
    items: [
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "user",
        text: "Paid already ✓",
        timestamp: now,
      },
      {
        kind: "message",
        id: crypto.randomUUID(),
        role: "assistant",
        text: `Payment received — ${formatSgd(paidPayment.amount)}. Invoice below; synced to Xero.`,
        timestamp: new Date(now.getTime() + 500),
      },
      {
        kind: "invoice",
        id: crypto.randomUUID(),
        invoice,
        timestamp: new Date(now.getTime() + 900),
      },
    ],
  };
}
