/** Token mints - override via env in production */
export const USDC_MINT = process.env.NEXT_PUBLIC_USDC_MINT ?? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const GOLD_MINT = process.env.NEXT_PUBLIC_GOLD_MINT ?? "";

export const MIN_GIFT_USD = 5;
export const MAX_GIFT_USD = 500;
export const MAX_MESSAGE_LENGTH = 200;

export const OCCASIONS = [
  { value: "birthday" as const, label: "Birthday", emoji: "🎂" },
  { value: "wedding" as const, label: "Wedding", emoji: "💒" },
  { value: "graduation" as const, label: "Graduation", emoji: "🎓" },
  { value: "thankyou" as const, label: "Thank You", emoji: "🙏" },
] as const;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
// Use OrbitFlare RPC (set NEXT_PUBLIC_ for client ConnectionProvider; ORBITFLARE_ for server)
export const RPC_URL =
  process.env.ORBITFLARE_RPC_URL ??
  process.env.NEXT_PUBLIC_ORBITFLARE_RPC_URL ??
  process.env.NEXT_PUBLIC_RPC_URL ??
  "https://api.mainnet-beta.solana.com";
