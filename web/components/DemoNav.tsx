import Link from "next/link";

export type DemoPageId = "chat" | "dashboard" | "ads" | "erp" | "pricing";

const DEMO_LINKS: { id: DemoPageId; href: string; label: string }[] = [
  { id: "chat", href: "/", label: "Chat" },
  { id: "dashboard", href: "/dashboard", label: "Dashboard" },
  { id: "ads", href: "/ads", label: "Ads" },
  { id: "erp", href: "/erp", label: "ERP" },
  { id: "pricing", href: "/pricing", label: "Orders" },
];

type DemoNavProps = {
  current: DemoPageId;
  variant?: "inline" | "pills";
};

export function DemoNav({ current, variant = "pills" }: DemoNavProps) {
  if (variant === "inline") {
    return (
      <nav className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {DEMO_LINKS.map((link, index) => (
          <span key={link.id} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <span className="text-xs text-aura-text-muted">·</span>
            ) : null}
            {link.id === current ? (
              <span className="text-xs font-medium text-aura-text-muted">
                {link.label}
              </span>
            ) : (
              <Link
                href={link.href}
                className="text-xs font-medium text-aura-primary underline-offset-2 hover:underline"
              >
                {link.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap gap-2">
      {DEMO_LINKS.map((link) =>
        link.id === current ? (
          <span
            key={link.id}
            className="rounded-full bg-aura-primary px-3 py-1.5 text-sm font-medium text-white"
          >
            {link.label}
          </span>
        ) : (
          <Link
            key={link.id}
            href={link.href}
            className="rounded-full border border-aura-primary/25 bg-white/70 px-3 py-1.5 text-sm text-aura-primary transition hover:bg-white"
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
