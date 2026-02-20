import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { grailClient } from "@/lib/grail/client";
import { isValidGiftId } from "@/lib/utils/gift-id";
import { getOccasionEmoji } from "@/lib/utils/formatting";
import { corsPreflight, withCors } from "@/lib/utils/actions-cors";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) {
    return NextResponse.json(
      { message: "Invalid gift ID" },
      { status: 400, headers: withCors() as HeadersInit }
    );
  }
  const supabase = createServerSupabaseClient();
  const { data: gift, error } = await supabase.from("gifts").select("*").eq("id", giftId).single();
  if (error || !gift) {
    return NextResponse.json(
      { message: "Gift not found" },
      { status: 404, headers: withCors() as HeadersInit }
    );
  }
  if (gift.claimed) {
    const iconUrl = `${APP_URL}/og/${gift.occasion}.png`;
    return NextResponse.json(
      {
        type: "action",
        icon: iconUrl,
        title: "GoldGift",
        description: "This gift has already been claimed.",
        label: "Already Claimed",
        disabled: true,
      },
      { status: 200, headers: withCors() as HeadersInit }
    );
  }

  const emoji = getOccasionEmoji(gift.occasion);
  const iconUrl = `${APP_URL}/og/${gift.occasion}.png`;
  const body = {
    type: "action",
    icon: iconUrl,
    title: "GoldGift",
    description: `${emoji} You received a gold gift! $${Number(gift.amount_usd).toFixed(2)} in GOLD. ${gift.message ? `"${gift.message}"` : ""}`,
    label: "Claim Gold Gift",
    links: {
      actions: [{ label: "Claim Gift", href: `${APP_URL}/api/actions/claim-gift/${giftId}` }],
    },
  };
  return NextResponse.json(body, { status: 200, headers: withCors() as HeadersInit });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) {
    return NextResponse.json(
      { message: "Invalid gift ID" },
      { status: 400, headers: withCors() as HeadersInit }
    );
  }
  const supabase = createServerSupabaseClient();
  const { data: gift, error } = await supabase.from("gifts").select("*").eq("id", giftId).single();
  if (error || !gift) {
    return NextResponse.json(
      { message: "Gift not found" },
      { status: 404, headers: withCors() as HeadersInit }
    );
  }
  if (gift.claimed) {
    return NextResponse.json(
      { message: "This gift has already been claimed." },
      { status: 400, headers: withCors() as HeadersInit }
    );
  }

  const body = await request.json().catch(() => ({}));
  const account = body?.account?.[0] ?? body?.account;
  const recipient_wallet = typeof account === "string" ? account : null;
  if (!recipient_wallet) {
    return NextResponse.json(
      { message: "Missing account (wallet) in request body" },
      { status: 400, headers: withCors() as HeadersInit }
    );
  }

  const escrow = gift.escrow_account;
  if (!escrow) {
    return NextResponse.json(
      { message: "Gift escrow not set; sender must complete the buy transaction first." },
      { status: 400, headers: withCors() as HeadersInit }
    );
  }

  const { transaction } = await grailClient.createTransferTransaction({
    fromEscrow: escrow,
    toWallet: recipient_wallet,
    amountGold: Number(gift.amount_gold),
    giftId,
  });

  return NextResponse.json(
    {
      transaction,
      message: "Claim your gold! Sign the transaction to receive your gift.",
    },
    { status: 200, headers: withCors() as HeadersInit }
  );
}
