import { NextResponse } from "next/server";
import { DEMO_SESSION_ID } from "@/lib/constants";
import { proxyBackend } from "@/lib/backend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body?.text;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const brandingSlug =
      typeof body?.brandingSlug === "string" ? body.brandingSlug.trim() : "";
    const sessionId =
      typeof body?.sessionId === "string" && body.sessionId.trim()
        ? body.sessionId.trim()
        : brandingSlug
          ? `${DEMO_SESSION_ID}::${brandingSlug}`
          : DEMO_SESSION_ID;

    const knowledgeDocs = Array.isArray(body?.knowledgeDocs)
      ? body.knowledgeDocs
      : undefined;

    const response = await proxyBackend("/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        text: text.trim(),
        knowledgeDocs,
        brandingSlug: brandingSlug || undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error ?? "backend_error" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
