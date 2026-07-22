import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/backend";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const qs = searchParams.toString();
    const path = qs ? `/intents?${qs}` : "/intents";

    const response = await proxyBackend(path, { method: "GET" });
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

export async function DELETE() {
  try {
    const response = await proxyBackend("/intents", { method: "DELETE" });
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
