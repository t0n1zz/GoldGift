import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isValidGiftId } from "@/lib/utils/gift-id";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) {
    return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });
  }
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("gifts").select("*").eq("id", giftId).single();
  if (error || !data) {
    return NextResponse.json({ error: "Gift not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  const { giftId } = await params;
  if (!isValidGiftId(giftId)) {
    return NextResponse.json({ error: "Invalid gift ID" }, { status: 400 });
  }
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.transaction_signature != null) updates.transaction_signature = body.transaction_signature;
  if (body.escrow_account != null) updates.escrow_account = body.escrow_account;
  if (body.image_url != null) updates.image_url = body.image_url;
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("gifts").update(updates).eq("id", giftId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
