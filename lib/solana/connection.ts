import { Connection } from "@/lib/solana/legacy-boundary";
import { RPC_URL } from "@/lib/utils/constants";

const connectionConfig = {
  commitment: "confirmed" as const,
  confirmTransactionInitialTimeout: 60_000,
};

let connection: Connection | null = null;

/**
 * Get Solana connection (via web3-compat → Kit runtime).
 * Uses OrbitFlare RPC when ORBITFLARE_RPC_URL is set (required for hackathon).
 */
export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_URL, connectionConfig);
  }
  return connection;
}

/**
 * Send and confirm transaction with retries (for better landing on OrbitFlare).
 */
export async function confirmTransaction(
  conn: Connection,
  signature: string,
  maxRetries = 3
): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await conn.confirmTransaction(signature, "confirmed");
      if (result.value.err) return false;
      return true;
    } catch {
      if (i === maxRetries - 1) throw new Error("Transaction confirmation failed");
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  return false;
}
