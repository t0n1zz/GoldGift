import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidGiftId } from "@/lib/utils/gift-id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gift_id = body?.gift_id?.trim();
    const recipient_wallet = body?.recipient_wallet?.trim();
    const transaction_signature = body?.transaction_signature?.trim();

    if (!gift_id || !isValidGiftId(gift_id)) {
      return NextResponse.json({ error: "Invalid gift_id" }, { status: 400 });
    }
    if (typeof recipient_wallet !== "string" || recipient_wallet.length < 32) {
      return NextResponse.json({ error: "Invalid recipient_wallet" }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: gift, error: fetchError } = await supabase
      .from("gifts")
      .select("*")
      .eq("id", gift_id)
      .single();

    if (fetchError || !gift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }
    if (gift.claimed) {
      return NextResponse.json({ error: "Gift already claimed" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      claimed: true,
      claimed_at: new Date().toISOString(),
      recipient_wallet,
    };
    if (transaction_signature) updates.claim_transaction_signature = transaction_signature;

    const { data: updated, error } = await supabase
      .from("gifts")
      .update(updates)
      .eq("id", gift_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(updated);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Claim failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
