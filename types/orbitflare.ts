/** Optional: Jupiter swap via OrbitFlare */
export interface JupiterQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
}

export interface JupiterSwapRequest {
  quoteResponse: unknown;
  userPublicKey: string;
}

/** Optional: Jito bundle for MEV protection */
export interface JitoBundleRequest {
  transactions: string[]; // base64
  tipAmountLamports?: number;
}
