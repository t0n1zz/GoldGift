# GoldGift

Gold-backed gift cards with Solana Blinks. Send appreciating value for birthdays, weddings, graduations, and more.

**Hackathon:** Solana Graveyard Hack (Blinks Track) + Oro GRAIL Grant Program

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Blockchain:** Solana Web3.js, @solana/actions (Blinks), @solana/wallet-adapter-react
- **RPC:** OrbitFlare (required for hackathon)
- **Gold:** Oro GRAIL API (USDC → GOLD)

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - OrbitFlare: `ORBITFLARE_RPC_URL`, `NEXT_PUBLIC_ORBITFLARE_RPC_URL` (for wallet connection)
   - GRAIL: `GRAIL_API_URL`, `GRAIL_API_KEY`
   - App: `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)

3. Create Supabase tables: run `lib/supabase/schema.sql` in the Supabase SQL Editor.

4. Run dev server:
   ```bash
   npm run dev
   ```

## Project structure

- `app/` — Pages (landing, create, claim) and API routes
- `app/api/actions/` — Solana Actions (Blinks): create-gift, claim-gift
- `app/api/gifts/` — Gift CRUD and claim
- `app/api/grail/` — GRAIL quote, buy, transfer
- `components/` — Wallet, gift cards, forms
- `lib/` — Supabase, Solana connection, GRAIL client, utils
- `types/` — Gift, GRAIL, Actions, OrbitFlare types

## Blinks

- **Create gift:** `GET/POST` `/api/actions/create-gift` (preset amounts + custom)
- **Claim gift:** `GET/POST` `/api/actions/claim-gift/[giftId]`

Validate at [actions-validator.com](https://actions-validator.com). Test in [Dialect Blinks Inspector](https://www.blinks.xyz/inspector).

## Solana stack

GoldGift follows the **solana-dev skill** (framework-kit–first, legacy behind a boundary). See [docs/SOLANA-STACK.md](docs/SOLANA-STACK.md) for boundary, wallet, and risk notes.

## License

MIT
