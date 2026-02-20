/**
 * Legacy boundary: all web3.js-style types and RPC are isolated here.
 * App code must not import from @solana/web3.js elsewhere.
 * When @solana/web3-compat resolves in this build (see dist/types/index.d.ts),
 * switch this file to re-export from "@solana/web3-compat" for Kit runtime.
 * See: solana-dev skill (kit-web3-interop).
 */
export {
  Connection,
  Transaction,
  VersionedTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
export { sendAndConfirmTransaction } from "@solana/web3.js";
