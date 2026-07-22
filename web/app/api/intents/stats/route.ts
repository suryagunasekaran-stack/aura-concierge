import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/backend";

export async function GET() {
  try {
    const response = await proxyBackend("/intents/stats", { method: "GET" });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error ?? "backend_error", message: data.message },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
