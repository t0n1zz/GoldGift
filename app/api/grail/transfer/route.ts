import { NextRequest, NextResponse } from "next/server";
import { grailClient } from "@/lib/grail/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fromEscrow = body?.fromEscrow ?? body?.from_escrow;
    const toWallet = body?.toWallet ?? body?.to_wallet;
    const amountGold = Number(body?.amountGold ?? body?.amount_gold);
    const giftId = body?.giftId ?? body?.gift_id ?? undefined;

    if (typeof fromEscrow !== "string" || !fromEscrow) {
      return NextResponse.json({ error: "Invalid from_escrow" }, { status: 400 });
    }
    if (typeof toWallet !== "string" || !toWallet) {
      return NextResponse.json({ error: "Invalid to_wallet" }, { status: 400 });
    }
    if (!Number.isFinite(amountGold) || amountGold <= 0) {
      return NextResponse.json({ error: "Invalid amount_gold" }, { status: 400 });
    }

    const result = await grailClient.createTransferTransaction({
      fromEscrow,
      toWallet,
      amountGold,
      giftId,
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Transfer failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
