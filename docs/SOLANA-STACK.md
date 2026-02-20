# Solana stack (solana-dev skill)

## Current setup

- **Legacy boundary:** All `Connection` / `Transaction` / `PublicKey` usage goes through `lib/solana/legacy-boundary.ts`. The rest of the app must not import from `@solana/web3.js` directly.
- **Boundary implementation:** The boundary currently re-exports from `@solana/web3.js`. When `@solana/web3-compat` type declarations resolve in this build, switch the boundary to re-export from `@solana/web3-compat` so the Kit runtime is used under the hood.
- **Wallet UI:** We use `@solana/wallet-adapter-react` for connection and for **signing API-provided serialized transactions** (GRAIL buy/transfer). Framework-kit (`@solana/client` + `@solana/react-hooks`) is installed but not yet the single source of truth for wallet state because framework-kit’s transaction helpers expect **instructions**, not a pre-serialized transaction from an API. Once framework-kit (or Wallet Standard) supports “sign and send this serialized transaction,” we can move to a single SolanaProvider and remove the adapter for this flow.
- **RPC:** `lib/solana/connection.ts` uses the boundary’s `Connection`; RPC URL is from env (OrbitFlare when set).

## Risk notes (signing / fees / tokens)

- **Signing:** Create and claim flows ask the user to sign a transaction built by the GRAIL API. The transaction is deserialized from base64 and sent via the wallet adapter’s `sendTransaction`. Only the user’s wallet signs; the app never holds private keys.
- **Fees:** Fee payer is the signer (sender for buy, recipient for claim). No prioritization fees are added in-app; the GRAIL API or RPC may set them.
- **Tokens:** GRAIL buy/transfer involve USDC and GOLD (or equivalent). Mint addresses and token program (SPL vs Token-2022) are determined by the GRAIL API.
- **CPIs:** Not used in app code; any CPI is inside the GRAIL-provided transaction.

## Commands

```bash
npm install
npm run build
npm run dev
```

## Next steps (skill alignment)

1. Switch `legacy-boundary.ts` to `@solana/web3-compat` when its types resolve (e.g. when the package ships a root `dist/types/index.d.ts` or the project’s module resolution picks it up).
2. When framework-kit (or Wallet Standard) supports signing a serialized transaction, use a single `SolanaProvider` and remove wallet-adapter for the connect + sign flow.
3. Optionally use `@solana/kit` (e.g. `createSolanaRpc`) for new server-side or script RPC usage.
