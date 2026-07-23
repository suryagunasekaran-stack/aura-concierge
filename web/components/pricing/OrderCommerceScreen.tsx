"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DemoNav } from "@/components/DemoNav";
import { formatTime } from "@/lib/chat";
import {
  CATALOG,
  buildInitialCommerceThread,
  completePaymentMessages,
  formatSgd,
  paymentMessages,
  placeOrderMessages,
  stepLabel,
  type CommerceChatItem,
  type CommerceOrder,
  type InvoiceRecord,
  type OrderStep,
  type PaymentRecord,
  type Product,
} from "@/lib/pricing/mockOrderCommerce";

const STEPS: OrderStep[] = ["browse", "order", "payment", "invoice"];

function StepIndicator({ current }: { current: OrderStep }) {
  const currentIdx = STEPS.indexOf(current);

  return (
    <ol className="mb-5 flex flex-wrap items-center gap-2">
      {STEPS.map((step, index) => {
        const done = index < currentIdx;
        const active = step === current;

        return (
          <li key={step} className="flex items-center gap-2">
            {index > 0 ? (
              <span className="text-aura-text-muted">→</span>
            ) : null}
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                active
                  ? "bg-aura-primary text-white"
                  : done
                    ? "bg-aura-thread text-aura-primary"
                    : "border border-aura-primary/20 bg-white/70 text-aura-text-muted"
              }`}
            >
              {index + 1}. {stepLabel(step)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Bubble({
  role,
  text,
  timestamp,
}: {
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}) {
  const isUser = role === "user";

  return (
    <div
      className={`message-enter flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`shadow-sm ${
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-aura-primary px-3.5 py-2.5 text-white"
            : "max-w-[92%] rounded-2xl rounded-bl-sm bg-aura-bubble-in px-4 py-3 text-aura-text"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        <p
          suppressHydrationWarning
          className={`mt-1.5 text-right text-[11px] ${
            isUser ? "text-white/70" : "text-aura-text-muted"
          }`}
        >
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  timestamp,
  onOrder,
  disabled,
}: {
  product: Product;
  timestamp: Date;
  onOrder: () => void;
  disabled: boolean;
}) {
  return (
    <div className="message-enter flex justify-start">
      <div className="max-w-[92%] overflow-hidden rounded-2xl rounded-bl-sm border border-aura-primary/15 bg-aura-bubble-in shadow-sm">
        <div className="border-b border-aura-primary/8 bg-aura-thread/40 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aura-primary">
            Product · WhatsApp catalog
          </span>
        </div>
        <div className="px-3.5 py-3">
          <p className="text-sm font-semibold text-aura-text">{product.name}</p>
          <p className="mt-1 text-xs text-aura-text-muted">{product.description}</p>
          <p className="mt-2 text-lg font-semibold text-aura-primary">
            {formatSgd(product.price)}
          </p>
          <button
            type="button"
            disabled={disabled}
            onClick={onOrder}
            className="mt-3 w-full rounded-full bg-aura-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-aura-primary-dark disabled:opacity-50"
          >
            Place order
          </button>
          <p suppressHydrationWarning className="mt-2 text-right text-[11px] text-aura-text-muted">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, timestamp }: { order: CommerceOrder; timestamp: Date }) {
  return (
    <div className="message-enter flex justify-start">
      <div className="max-w-[92%] overflow-hidden rounded-2xl rounded-bl-sm border border-aura-primary/15 bg-aura-bubble-in shadow-sm">
        <div className="border-b border-aura-primary/8 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aura-text-muted">
            Order · {order.orderRef}
          </span>
        </div>
        <div className="px-3.5 py-3 text-sm">
          {order.lines.map((line) => (
            <div key={line.productId} className="flex justify-between gap-2">
              <span className="text-aura-text">
                {line.qty}× {line.name}
              </span>
              <span className="text-aura-text-muted">
                {formatSgd(line.unitPrice * line.qty)}
              </span>
            </div>
          ))}
          <div className="mt-2 space-y-1 border-t border-aura-primary/10 pt-2 text-xs text-aura-text-muted">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatSgd(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (9%)</span>
              <span>{formatSgd(order.gst)}</span>
            </div>
            <div className="flex justify-between font-semibold text-aura-text">
              <span>Total</span>
              <span>{formatSgd(order.total)}</span>
            </div>
          </div>
          <p suppressHydrationWarning className="mt-2 text-right text-[11px] text-aura-text-muted">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentCard({
  payment,
  timestamp,
  onPay,
  disabled,
}: {
  payment: PaymentRecord;
  timestamp: Date;
  onPay: () => void;
  disabled: boolean;
}) {
  const paid = payment.status === "completed";

  return (
    <div className="message-enter flex justify-start">
      <div className="max-w-[92%] overflow-hidden rounded-2xl rounded-bl-sm border border-aura-gold/35 bg-aura-bubble-in shadow-sm">
        <div className="border-b border-aura-primary/8 bg-aura-thread/40 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aura-primary">
            Payment · {payment.method}
          </span>
        </div>
        <div className="px-3.5 py-3">
          <p className="text-sm font-semibold text-aura-text">
            {formatSgd(payment.amount)}
          </p>
          <p className="mt-1 text-xs text-aura-text-muted">
            Order {payment.orderRef} · {paid ? "Paid" : "Awaiting payment"}
          </p>
          {!paid ? (
            <button
              type="button"
              disabled={disabled}
              onClick={onPay}
              className="mt-3 w-full rounded-full bg-aura-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-aura-primary-dark disabled:opacity-50"
            >
              Pay with PayNow
            </button>
          ) : (
            <p className="mt-3 rounded-full bg-aura-thread px-3 py-2 text-center text-xs font-medium text-aura-primary">
              Payment complete
            </p>
          )}
          <p suppressHydrationWarning className="mt-2 text-right text-[11px] text-aura-text-muted">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

function InvoiceCard({ invoice, timestamp }: { invoice: InvoiceRecord; timestamp: Date }) {
  return (
    <div className="message-enter flex justify-start">
      <div className="max-w-[92%] overflow-hidden rounded-2xl rounded-bl-sm border border-aura-primary/15 bg-aura-bubble-in shadow-sm">
        <div className="border-b border-aura-primary/8 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-aura-text-muted">
            Invoice · {invoice.invoiceNo}
          </span>
        </div>
        <div className="px-3.5 py-3 text-sm">
          <p className="font-medium text-aura-text">{invoice.customerName}</p>
          <p className="mt-1 text-xs text-aura-text-muted">
            Order {invoice.orderRef} · synced to {invoice.erpSync}
          </p>
          <div className="mt-2 space-y-1 text-xs text-aura-text-muted">
            <div className="flex justify-between">
              <span>Amount</span>
              <span>{formatSgd(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span>{formatSgd(invoice.gst)}</span>
            </div>
            <div className="flex justify-between font-semibold text-aura-text">
              <span>Total paid</span>
              <span>{formatSgd(invoice.total)}</span>
            </div>
          </div>
          <button
            type="button"
            className="mt-3 w-full rounded-full border border-aura-primary/25 px-3 py-2 text-xs font-medium text-aura-primary"
          >
            Download PDF (demo)
          </button>
          <p suppressHydrationWarning className="mt-2 text-right text-[11px] text-aura-text-muted">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusPanel({
  step,
  order,
  payment,
  invoice,
}: {
  step: OrderStep;
  order: CommerceOrder | null;
  payment: PaymentRecord | null;
  invoice: InvoiceRecord | null;
}) {
  return (
    <aside className="flex flex-col border-t border-aura-primary/10 bg-white/50 lg:w-72 lg:shrink-0 lg:border-t-0 lg:border-l">
      <div className="border-b border-aura-primary/10 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-aura-text-muted">
          Live status
        </p>
        <p className="mt-0.5 text-sm font-medium text-aura-primary">
          {stepLabel(step)}
        </p>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4 text-xs">
        <section>
          <h3 className="font-semibold text-aura-text">Order</h3>
          {order ? (
            <dl className="mt-2 space-y-1 text-aura-text-muted">
              <div className="flex justify-between">
                <dt>Ref</dt>
                <dd className="text-aura-text">{order.orderRef}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd className="capitalize text-aura-text">{order.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Total</dt>
                <dd className="text-aura-text">{formatSgd(order.total)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-aura-text-muted">No order yet</p>
          )}
        </section>
        <section>
          <h3 className="font-semibold text-aura-text">Payment</h3>
          {payment ? (
            <dl className="mt-2 space-y-1 text-aura-text-muted">
              <div className="flex justify-between">
                <dt>Method</dt>
                <dd className="text-aura-text">{payment.method}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Status</dt>
                <dd className="capitalize text-aura-text">{payment.status}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-aura-text-muted">Not initiated</p>
          )}
        </section>
        <section>
          <h3 className="font-semibold text-aura-text">Invoice</h3>
          {invoice ? (
            <dl className="mt-2 space-y-1 text-aura-text-muted">
              <div className="flex justify-between">
                <dt>No.</dt>
                <dd className="text-aura-text">{invoice.invoiceNo}</dd>
              </div>
              <div className="flex justify-between">
                <dt>ERP</dt>
                <dd className="text-aura-text">{invoice.erpSync}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-aura-text-muted">Pending payment</p>
          )}
        </section>
      </div>
    </aside>
  );
}

export function OrderCommerceScreen() {
  const [thread, setThread] = useState<CommerceChatItem[]>(() =>
    buildInitialCommerceThread(),
  );
  const [step, setStep] = useState<OrderStep>("browse");
  const [order, setOrder] = useState<CommerceOrder | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const product = CATALOG[0]!;

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [thread]);

  const handlePlaceOrder = useCallback(() => {
    if (step !== "browse" || !product) return;
    const result = placeOrderMessages(product, "Mei Ling");
    setThread((current) => [...current, ...result.items]);
    setOrder(result.order);
    setStep(result.step);
  }, [step, product]);

  const handleStartPayment = useCallback(() => {
    if (!order || step !== "order") return;
    const result = paymentMessages(order);
    setThread((current) => [...current, ...result.items]);
    setPayment(result.payment);
    setStep(result.step);
  }, [order, step]);

  const handleCompletePayment = useCallback(() => {
    if (!order || !payment || step !== "payment") return;
    const result = completePaymentMessages(order, payment);
    setThread((current) => [...current, ...result.items]);
    setOrder(result.order);
    setPayment(result.payment);
    setInvoice(result.invoice);
    setStep(result.step);
  }, [order, payment, step]);

  function renderItem(item: CommerceChatItem) {
    switch (item.kind) {
      case "message":
        return (
          <Bubble
            key={item.id}
            role={item.role}
            text={item.text}
            timestamp={item.timestamp}
          />
        );
      case "product":
        return (
          <ProductCard
            key={item.id}
            product={item.product}
            timestamp={item.timestamp}
            onOrder={handlePlaceOrder}
            disabled={step !== "browse"}
          />
        );
      case "order":
        return (
          <OrderCard key={item.id} order={item.order} timestamp={item.timestamp} />
        );
      case "payment":
        return (
          <PaymentCard
            key={item.id}
            payment={item.payment}
            timestamp={item.timestamp}
            onPay={handleCompletePayment}
            disabled={step !== "payment" || item.payment.status === "completed"}
          />
        );
      case "invoice":
        return (
          <InvoiceCard
            key={item.id}
            invoice={item.invoice}
            timestamp={item.timestamp}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-8 sm:py-10">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aura-primary">
            AURA · MVP
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-wide text-aura-text">
            Order · Pay · Invoice
          </h1>
          <p className="mt-1 max-w-lg text-sm text-aura-text-muted">
            Customer orders a product over WhatsApp — order confirmation, PayNow
            payment, and invoice synced to ERP.
          </p>
        </div>
        <DemoNav current="pricing" />
      </header>

      <StepIndicator current={step} />

      <div className="flex min-h-[560px] flex-1 flex-col overflow-hidden rounded-2xl border border-aura-primary/12 bg-white/60 shadow-[0_20px_60px_rgba(31,110,86,0.08)] backdrop-blur-sm lg:flex-row">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="border-b border-aura-primary/10 bg-aura-primary px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold text-white">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Aura Concierge</p>
                <p className="text-xs text-white/75">WhatsApp · retail order</p>
              </div>
            </div>
          </div>

          <div
            ref={threadRef}
            className="chat-thread flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
          >
            {thread.map(renderItem)}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-aura-primary/10 bg-white/80 px-4 py-3">
            {step === "order" ? (
              <button
                type="button"
                onClick={handleStartPayment}
                className="rounded-full bg-aura-primary px-4 py-2 text-xs font-medium text-white hover:bg-aura-primary-dark"
              >
                Proceed to payment
              </button>
            ) : null}
            {step === "invoice" ? (
              <p className="text-xs text-aura-primary">
                Flow complete — order, payment, and invoice on one thread.
              </p>
            ) : null}
          </div>
        </div>

        <StatusPanel
          step={step}
          order={order}
          payment={payment}
          invoice={invoice}
        />
      </div>
    </div>
  );
}
