import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const u = await getSession();
  return u
    ? NextResponse.json({ name: u.name }, { headers: { "Cache-Control": "private, no-store" } })
    : new NextResponse(null, { status: 401, headers: { "Cache-Control": "no-store" } });
}