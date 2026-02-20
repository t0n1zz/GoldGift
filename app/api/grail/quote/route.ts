import { NextRequest, NextResponse } from "next/server";
import { grailClient } from "@/lib/grail/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amountUsd = Number(body?.amountUsd ?? body?.amount_usd);
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return NextResponse.json(
        { error: "Invalid amount_usd" },
        { status: 400 }
      );
    }
    const quote = await grailClient.getQuote(amountUsd);
    return NextResponse.json(quote);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Quote failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
