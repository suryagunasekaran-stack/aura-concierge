import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/backend";

export async function GET() {
  try {
    const response = await proxyBackend("/training", { method: "GET" });
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await proxyBackend("/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: body?.filename,
        content: body?.content,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.error ?? "backend_error",
          message: data.message,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}

export async function DELETE() {
  try {
    const response = await proxyBackend("/training", { method: "DELETE" });
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
