# Mungo Shift — Borderlands 4 SHiFT monitor

A tiny Next.js 15 service that fetches the community SHiFT code feed, filters it for Borderlands 4, and exposes:

- An `/api/bl4` JSON endpoint optimised for the Edge runtime
- A friendly web UI with copy-to-clipboard controls, expiry badges, and export links
- Plain-text (`/bl4.txt`) and RSS (`/bl4.rss`) exports
- Optional Discord notifications for newly discovered codes via a cron trigger

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) with the Edge runtime for public APIs
- TypeScript (strict) with ESLint for linting
- Tailwind CSS 4 + [shadcn/ui](https://ui.shadcn.com/) for styling and components
- Lightweight JSON persistence for “seen” codes (ready to swap for SQLite/Postgres later)

## Getting started

```bash
pnpm install
pnpm dev
```

The app boots on [http://localhost:3000](http://localhost:3000). The landing page is a server component that renders the current Borderlands 4 codes. Copy buttons work with keyboard and pointer input.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `UPSTREAM_URL` | No | Override the upstream JSON feed. Defaults to the GitHub raw URL from the brief. |
| `UPSTREAM_CACHE_TTL_MS` | No | Cache duration (in ms) for the upstream feed. Clamped between 5 and 15 minutes. |
| `DISCORD_WEBHOOK_URL` | No | Discord webhook endpoint used for notifications. If omitted, notifications are skipped. |
| `DATABASE_URL` | No | Path or `file:` URL pointing to where seen codes should be persisted. Defaults to `.data/seen.json`. |
| `CRON_SECRET` | No | Bearer token required to call the cron endpoint. |
| `SITE_URL` | No | Absolute site URL used for RSS metadata and Open Graph tags. |

Create a `.env.local` if you need to set these while developing.

### Running checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```

The Vitest suite covers the BL4 filtering regex, code extraction, and expiry logic.

## API overview

- `GET /api/bl4` — Fetches the upstream feed (cached for five minutes), filters for Borderlands 4, and returns `{ updatedAt, count, items[] }`. On upstream failure it responds with `502` and `{ "error": "Upstream unavailable" }`.
- `GET /bl4.txt` — Plain-text export with one code per line.
- `GET /bl4.rss` — Minimal RSS 2.0 feed for subscribers.

All outputs only expose the whitelisted fields: `code`, `expires`, `reward`, and `source`.

## Cron + notifications

The cron endpoint refreshes the feed, diffs it against the persisted "seen" set, and sends a single Discord message when new codes appear.

```
GET /api/cron
Authorization: Bearer <CRON_SECRET>
```

On success the route stores the refreshed seen set and responds with the number of new codes. If `DISCORD_WEBHOOK_URL` is unset the cron still dedupes but skips the webhook call.

## Persistence layer

By default the app stores seen codes inside `.data/seen.json`. You can override `DATABASE_URL` with a file path or `file:` URL to choose another location. The helper is intentionally isolated in `lib/store.ts` so it can be swapped for SQLite/Postgres later.

## Deployment notes

- The Edge APIs (`/api/bl4`, `/bl4.txt`, `/bl4.rss`) are cache-friendly and can be deployed on Vercel Edge Functions.
- `/api/cron` runs on the Node.js runtime because it writes to disk and calls Discord.
- Configure a Vercel Cron job (e.g. every 15 minutes) that calls `/api/cron` with the `CRON_SECRET` bearer token.

## Project structure

```
app/
  api/bl4/route.ts      # Edge API handler
  api/cron/route.ts     # Cron trigger for dedupe + notifications
  bl4.txt/route.ts      # Plain-text export
  bl4.rss/route.ts      # RSS export
  page.tsx              # Main UI
components/
  copy-button.tsx       # Accessible copy control
  ui/button.tsx         # shadcn/ui button primitive
lib/
  bl4.ts                # Fetch + filter orchestration
  fetchUpstream.ts      # Cached upstream fetcher
  filter.ts             # BL4 matching helpers + sanitiser
  notify.ts             # Discord webhook utility
  store.ts              # Seen-code persistence
  utils.ts              # Tailwind classname helper
```

## Testing the error state

Disconnect your network or temporarily change `UPSTREAM_URL` to an invalid value, then refresh `/`. The UI will surface a friendly error and `/api/bl4` will respond with a `502` JSON payload.

## License

[MIT](./LICENSE)
