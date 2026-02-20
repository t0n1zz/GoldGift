import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { grailClient } from "@/lib/grail/client";
import { generateGiftId, getClaimUrl } from "@/lib/utils/gift-id";
import { MIN_GIFT_USD, MAX_GIFT_USD, MAX_MESSAGE_LENGTH } from "@/lib/utils/constants";
import { corsPreflight, withCors } from "@/lib/utils/actions-cors";
import type { Occasion } from "@/types/gift";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const BASE = `${APP_URL.replace(/\/$/, "")}/api/actions/create-gift`;
const OCCASIONS: Occasion[] = ["birthday", "wedding", "graduation", "thankyou"];

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const iconUrl = `${APP_URL}/og/create.png`;
  const actions = [
    { label: "Send $25 Gold Gift", href: `${BASE}?amount=25` },
    { label: "Send $50 Gold Gift", href: `${BASE}?amount=50` },
    { label: "Send $100 Gold Gift", href: `${BASE}?amount=100` },
    {
      label: "Send Custom Gold Gift",
      href: `${BASE}?amount={amount}&occasion={occasion}&message={message}`,
      parameters: [
        { name: "amount", label: "Amount (USD)", required: true, type: "number" as const, min: MIN_GIFT_USD, max: MAX_GIFT_USD },
        { name: "occasion", label: "Occasion", required: true, type: "text" as const },
        { name: "message", label: "Message (optional)", required: false, type: "textarea" as const, max: MAX_MESSAGE_LENGTH },
      ],
    },
  ];

  const body = {
    type: "action",
    icon: iconUrl,
    title: "GoldGift",
    description: "Send gold-backed gift cards. Value that appreciates.",
    label: "Create Gold Gift",
    links: { actions },
  };
  return NextResponse.json(body, { status: 200, headers: withCors() as HeadersInit });
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const amount_usd = Number(url.searchParams.get("amount") ?? 0);
    const occasion = (url.searchParams.get("occasion") ?? "birthday").trim() as Occasion;
    const message = url.searchParams.get("message")?.trim()?.slice(0, MAX_MESSAGE_LENGTH) ?? null;

    const body = await request.json().catch(() => ({}));
    const account = Array.isArray(body?.account) ? body.account[0] : body?.account;
    const sender_wallet = typeof account === "string" ? account : null;

    if (!sender_wallet) {
      return NextResponse.json(
        { message: "Missing account (wallet) in request body" },
        { status: 400, headers: withCors() as HeadersInit }
      );
    }
    if (!Number.isFinite(amount_usd) || amount_usd < MIN_GIFT_USD || amount_usd > MAX_GIFT_USD) {
      return NextResponse.json(
        { message: `Amount must be between $${MIN_GIFT_USD} and $${MAX_GIFT_USD}` },
        { status: 400, headers: withCors() as HeadersInit }
      );
    }
    const validOccasion = OCCASIONS.includes(occasion) ? occasion : "birthday";

    const quote = await grailClient.getQuote(amount_usd);
    const amount_gold = quote.amountGold;
    const id = generateGiftId();

    const buyRes = await grailClient.createBuyTransaction({
      amountUsd: amount_usd,
      buyerWallet: sender_wallet,
      giftId: id,
    });
    const transaction = buyRes.transaction;

    const supabase = createServerSupabaseClient();
    await supabase.from("gifts").insert({
      id,
      sender_wallet,
      recipient_wallet: null,
      amount_usd,
      amount_gold,
      occasion: validOccasion,
      message,
      claimed: false,
      escrow_account: buyRes.escrowAccount ?? null,
    });

    const claimUrl = getClaimUrl(id, APP_URL);
    return NextResponse.json(
      {
        transaction,
        message: `Gold gift created! Share this link for the recipient to claim: ${claimUrl}`,
      },
      { status: 200, headers: withCors() as HeadersInit }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create gift failed";
    return NextResponse.json(
      { message },
      { status: 500, headers: withCors() as HeadersInit }
    );
  }
}
