import type {
  GrailQuoteResponse,
  GrailBuyRequest,
  GrailBuyResponse,
  GrailTransferRequest,
  GrailTransferResponse,
} from "@/types/grail";

const GRAIL_API_URL = process.env.GRAIL_API_URL ?? "https://api.oro.finance";
const GRAIL_API_KEY = process.env.GRAIL_API_KEY ?? "";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (GRAIL_API_KEY) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${GRAIL_API_KEY}`;
    (headers as Record<string, string>)["X-API-Key"] = GRAIL_API_KEY;
  }
  return headers;
}

/**
 * GRAIL API client for USDC → GOLD conversion and transfers.
 * Adjust endpoints to match actual Oro GRAIL API documentation.
 */
export const grailClient = {
  async getQuote(amountUsd: number): Promise<GrailQuoteResponse> {
    const res = await fetch(`${GRAIL_API_URL}/quote`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amountUsd }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Quote failed: ${res.status}`);
    }
    return res.json();
  },

  async createBuyTransaction(params: GrailBuyRequest): Promise<GrailBuyResponse> {
    const res = await fetch(`${GRAIL_API_URL}/buy`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Buy failed: ${res.status}`);
    }
    return res.json();
  },

  async createTransferTransaction(params: GrailTransferRequest): Promise<GrailTransferResponse> {
    const res = await fetch(`${GRAIL_API_URL}/transfer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? `Transfer failed: ${res.status}`);
    }
    return res.json();
  },
};
