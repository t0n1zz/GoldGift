export interface GrailQuoteResponse {
  amountUsd: number;
  amountGold: number;
  rate: number;
  expiresAt?: string;
}

export interface GrailBuyRequest {
  amountUsd: number;
  buyerWallet: string;
  giftId?: string;
}

export interface GrailBuyResponse {
  transaction: string; // base64 serialized transaction
  amountGold: number;
  escrowAccount?: string;
}

export interface GrailTransferRequest {
  fromEscrow: string;
  toWallet: string;
  amountGold: number;
  giftId?: string;
}

export interface GrailTransferResponse {
  transaction: string; // base64 serialized transaction
}

export interface GrailError {
  code: string;
  message: string;
}
