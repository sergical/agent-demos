# Agent Demos

Three runnable apps, each built on a different agent framework and running in
a different place.

| Directory | Framework | Runs in | Shows |
| --- | --- | --- | --- |
| [`slack-agent-eve/`](slack-agent-eve/) | [Eve](https://eve.dev) 0.34 | Slack, plus the local `eve dev` TUI | A DoorDash ordering agent driving `dd-cli` (in a Vercel Sandbox when deployed). The `estimate_nutrition` tool makes its own nested model call. |
| [`storefront-commerce/`](storefront-commerce/) | AI SDK 7 on Next.js 16 | Browser chat panel in a storefront | A shopping assistant beside an ordinary commerce app: tool results render as generative UI, and `refundOrder` has a planted bug. |
| [`github-harness-flue/`](github-harness-flue/) | [Flue](https://flueframework.com) 2.0 | GitHub Action (`flue run`) | A headless PR reviewer: the `review-lead` agent delegates to two parallel subagents (`correctness-reviewer`, `style-reviewer`). |

Every model call goes through OpenRouter. Each demo is a self-contained npm
project — there is no workspace root.

## Setup

```bash
cd <demo>
npm install
cp .env.example .env        # storefront-commerce: .env.local
```

One value every demo needs:

- `OPENROUTER_API_KEY` — from [openrouter.ai/keys](https://openrouter.ai/keys)

Everything else in each `.env.example` is optional or channel-specific: Slack
tokens, a GitHub token, `dd-cli` credentials, and model overrides. Missing
optional variables degrade gracefully.

## Working in the repo

Each demo has `npm run lint` (oxlint) and `npm run typecheck`. Run both from
the demo directory.

## Where to look next

Each demo's own `README.md` — how to run it and what one agent turn does.
