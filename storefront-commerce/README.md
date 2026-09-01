# Acme Store — AI Shopping Assistant

A real storefront with an AI shopping assistant embedded in it. Open the
assistant, ask for a hoodie or your recent orders, and watch it search the
catalog, look up your account, and issue refunds.

Built on the [Next.js Commerce](https://github.com/vercel/commerce) template
(MIT © Vercel, Inc. — see `license.md`), keeping its storefront UI intact.

## Architecture

- **Storefront** — the Next.js Commerce template on Next 16 (App Router, PPR,
  `use cache`). Its Shopify data layer is replaced by `lib/commerce`, which
  exposes the exact same functions and types, so every template component
  works unchanged.
- **Fake database** — `lib/db` is an in-memory catalog (12 products, six
  customers, their orders). Every accessor is async with jittered 20–120 ms
  latency, so it behaves like a real database is behind the store.
- **Assistant** — a slide-over chat panel (AI Elements + `useChat`) streaming
  from `app/api/chat`, which runs the AI SDK's `streamText` with the
  OpenRouter provider and four tools: `searchProducts`, `getProduct`,
  `getAccountInfo`, and `refundOrder`. Tool results render as
  **generative UI** — real product cards linking into the storefront, and an
  account card with orders and loyalty status. `refundOrder` carries the
  demo's planted bug: orders that predate the June 2026 payments launch have
  no payment record, so refunding one throws mid-conversation while newer
  orders refund fine.
- **Shopper** — the store has no sign-in, so `lib/demo-user` holds the one
  fictional customer the browser is signed in as.

## Setup

Requires Node.js >= 22.

```bash
npm install
cp .env.example .env.local   # then fill in:
#   OPENROUTER_API_KEY       — required for the assistant
```

Everything else in `.env.example` is optional (model override, branding).

## Run

```bash
npm run dev
```

Browse the store, click the sparkles button (bottom right), and try:

- “Find me a hoodie” → `searchProducts` → product cards
- “Gift ideas for a desk setup” → the agent searches, then narrates
- “Where is my order?” → `getAccountInfo` → account card with live order status
- “Refund my last order” → `refundOrder` → confirmation, then a refund through
  the fake AcmePay gateway
- “Refund order 1029” → `refundOrder` throws on the pre-payments-launch
  order — the agent apologizes

## Choosing a model

`OPENROUTER_MODEL` picks the model, defaulting to
`anthropic/claude-sonnet-5`. It is parsed against the allow-list in
`lib/ai/models.ts`, which holds current OpenRouter ids only.
