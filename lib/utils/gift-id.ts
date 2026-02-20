import { customAlphabet } from "nanoid";

const GIFT_ID_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const nanoid = customAlphabet(GIFT_ID_ALPHABET, 12);

/** Generate a unique 12-character URL-safe gift ID */
export function generateGiftId(): string {
  return nanoid();
}

/** Validate gift ID format (12 chars, alphanumeric) */
export function isValidGiftId(id: string): boolean {
  return /^[0-9A-Za-z]{12}$/.test(id);
}

/** Build claim page URL for a gift */
export function getClaimUrl(giftId: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/claim/${giftId}`;
}

/** Build Blink URL for claiming (Actions endpoint) */
export function getClaimBlinkUrl(giftId: string, baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `https://solana.com/action/${encodeURIComponent(`${base.replace(/\/$/, "")}/api/actions/claim-gift/${giftId}`)}`;
}

/** Build Blink URL for creating a gift */
export function getCreateBlinkUrl(baseUrl?: string): string {
  const base = baseUrl ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `https://solana.com/action/${encodeURIComponent(`${base.replace(/\/$/, "")}/api/actions/create-gift`)}`;
}
