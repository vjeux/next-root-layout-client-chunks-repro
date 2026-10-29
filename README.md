# Client components of other pages land in every page's first load (Turbopack, 16.5 canary)

Minimal reproduction for a `next build` (Turbopack) regression that starts in `16.5.0-canary.27`.

## Setup

- `app/layout.tsx` calls `loadData()` from `lib/data.ts`, which loads `lib/on-error.ts` with a server-side `import()`. `lib/on-error.ts` imports `track` from `lib/analytics.ts`, a `"use client"` module that exports a function (no component). So the root layout reaches `lib/analytics.ts` only through that `import()`.
- `app/page.tsx` (`/`) renders a small client component, `app/counter.tsx`.
- `app/dashboard/[id]/page.tsx` imports `track` from `lib/analytics.ts` and renders a client component, `app/dashboard/[id]/chart.tsx`. The chart uses `chart-library.ts`, 30 KB of incompressible data that stands in for a large client-only dependency and starts with the string `HEAVY_MARKER`. No other page renders the chart.

## Steps

```bash
npm install
npm run build
npm run check
```

`check.mjs` reads `.next/server/app/page_client-reference-manifest.js` and `.next/build-manifest.json`. It prints the size of `/`'s first-load JS, lists the chunks of the root layout segment (`entryJSFiles["[project]/app/layout"]`), and flags the ones that contain `HEAVY_MARKER`.

## Expected

`/`'s root layout chunks hold the root layout's own client code, not the dashboard page's component:

```
/ first-load JS: 6 files, 456,596 B, gzip 133,276 B
OK: / does not load the dashboard page's component.
```

## Actual

On `next@16.5.0-canary.27` and later:

```
/ first-load JS: 6 files, 486,842 B, gzip 157,810 B
[project]/app/layout: static/chunks/<hash>.js (44,143 B, gzip 26,998 B) contains HEAVY_MARKER
BUG: / loads the dashboard page's component in its root layout chunks (44,143 B, gzip 26,998 B).
```

The root layout segment is part of every page, so every page downloads the dashboard page's chart and its 30 KB dependency.

| `next` | `npm run check` | `/` first-load JS, gzip |
| --- | --- | --- |
| 16.4.3 | OK | 132,999 B |
| 16.5.0-canary.26 | OK | 133,276 B |
| 16.5.0-canary.27 | BUG | 157,810 B |
| 16.5.0-canary.28 | BUG | 157,810 B |
| 16.5.0-canary.30 | BUG | 157,816 B |

To try a specific version: `npm install next@16.5.0-canary.26 && npm run build && npm run check`.
