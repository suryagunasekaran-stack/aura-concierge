import { NextResponse } from "next/server";
import { proxyBackend } from "@/lib/backend";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const response = await proxyBackend(`/training/${id}`, {
      method: "DELETE",
    });
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
