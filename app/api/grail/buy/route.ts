import { NextRequest, NextResponse } from "next/server";
import { grailClient } from "@/lib/grail/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amountUsd = Number(body?.amountUsd ?? body?.amount_usd);
    const buyerWallet = body?.buyerWallet ?? body?.buyer_wallet;
    const giftId = body?.giftId ?? body?.gift_id ?? undefined;

    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    if (typeof buyerWallet !== "string" || !buyerWallet) {
      return NextResponse.json({ error: "Invalid buyer_wallet" }, { status: 400 });
    }

    const result = await grailClient.createBuyTransaction({
      amountUsd,
      buyerWallet,
      giftId,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Buy failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
