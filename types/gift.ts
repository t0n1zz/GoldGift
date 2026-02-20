export type Occasion = "birthday" | "wedding" | "graduation" | "thankyou";

export interface Gift {
  id: string;
  sender_wallet: string;
  recipient_wallet: string | null;
  amount_usd: number;
  amount_gold: number;
  occasion: Occasion;
  message: string | null;
  claimed: boolean;
  claimed_at: string | null;
  created_at: string;
  escrow_account: string | null;
  transaction_signature: string | null;
  claim_transaction_signature: string | null;
}

export interface CreateGiftInput {
  sender_wallet: string;
  amount_usd: number;
  occasion: Occasion;
  message?: string | null;
}

export interface ClaimGiftInput {
  gift_id: string;
  recipient_wallet: string;
  transaction_signature?: string;
}

export interface GiftStats {
  total_gifts: number;
  claimed_gifts: number;
  unclaimed_gifts: number;
  total_usd_value: number;
  total_gold_amount: number;
  claimed_usd_value: number;
}
