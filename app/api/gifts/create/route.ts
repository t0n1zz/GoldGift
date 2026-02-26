import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { grailClient } from "@/lib/grail/client";
import { generateGiftId, getClaimUrl, getCreateBlinkUrl } from "@/lib/utils/gift-id";
import { MIN_GIFT_USD, MAX_GIFT_USD, MAX_MESSAGE_LENGTH } from "@/lib/utils/constants";
import type { Occasion } from "@/types/gift";

const OCCASIONS: Occasion[] = ["birthday", "wedding", "graduation", "thankyou"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sender_wallet = body?.sender_wallet?.trim();
    const amount_usd = Number(body?.amount_usd);
    const occasion = body?.occasion?.trim();
    const message = body?.message?.trim()?.slice(0, MAX_MESSAGE_LENGTH) ?? null;
    const image_url = typeof body?.image_url === "string" ? body.image_url.trim() || null : null;
    const card_variant = typeof body?.card_variant === "string" ? body.card_variant.trim() || null : null;

    if (typeof sender_wallet !== "string" || sender_wallet.length < 32) {
      return NextResponse.json({ error: "Invalid sender_wallet" }, { status: 400 });
    }
    if (!Number.isFinite(amount_usd) || amount_usd < MIN_GIFT_USD || amount_usd > MAX_GIFT_USD) {
      return NextResponse.json(
        { error: `Amount must be between $${MIN_GIFT_USD} and $${MAX_GIFT_USD}` },
        { status: 400 }
      );
    }
    if (!occasion || !OCCASIONS.includes(occasion)) {
      return NextResponse.json({ error: "Invalid occasion" }, { status: 400 });
    }

    const quote = await grailClient.getQuote(amount_usd);
    const amount_gold = quote.amountGold;
    const id = generateGiftId();

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("gifts").insert({
      id,
      sender_wallet,
      recipient_wallet: null,
      amount_usd,
      amount_gold,
      occasion,
      message,
      image_url,
      card_variant,
      claimed: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    return NextResponse.json({
      id,
      amount_usd,
      amount_gold,
      occasion,
      message,
      claim_url: getClaimUrl(id, baseUrl),
      blink_url: getCreateBlinkUrl(baseUrl),
      quote: { amountUsd: quote.amountUsd, amountGold: quote.amountGold, rate: quote.rate },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Create gift failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
