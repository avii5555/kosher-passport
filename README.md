# Kosher Passport

An AI-assisted trip planner for people who want to travel abroad and keep it
kosher. Pick a destination and a kashrut standard, browse a directory of
restaurants, hotels, synagogues, and stores, and build (or auto-generate) a
day-by-day itinerary.

**Status:** website prototype with sample data. Not production-ready — see
"Known limitations" below before relying on this for a real trip.

## Project structure

```
kosher-passport/
├── .claude/agents/kosher-passport-builder.md   # context for Claude Code work on this repo
├── public/
│   ├── index.html                              # markup only
│   ├── css/styles.css                          # all styling (passport/boarding-pass design system)
│   └── js/
│       ├── data.js                             # sample kosher directory data
│       └── app.js                              # state, rendering, AI call, save/load
├── server.js                                   # static file server + /api/generate-itinerary proxy
├── package.json
├── .env.example
└── .gitignore
```

## Running it locally

```bash
npm install
cp .env.example .env
# edit .env and add your real ANTHROPIC_API_KEY
npm start
```

Then open http://localhost:3000.

Without an API key in `.env`, everything works except the "Generate
itinerary with AI" button, which will show a clear error instead of failing
silently.

## Why there's a server at all

The AI itinerary feature calls the Anthropic API. That call **must** happen
server-side (`server.js` → `/api/generate-itinerary`) rather than directly
from the browser, for two reasons:
1. **The API key must never be shipped to the browser.** Anyone viewing page
   source or the network tab would be able to steal and use it.
2. The Anthropic API does not allow direct browser-based requests (CORS).

`public/js/app.js` calls our own `/api/generate-itinerary` endpoint, which
holds the real key and forwards the request.

## Known limitations (read before going further)

1. **The kosher directory is sample data.** Names, hechsherim, and
   descriptions in `public/js/data.js` are illustrative, not independently
   verified. Do not treat them as real kashrut guidance. Replacing this with
   a real, sourced dataset is the top priority before this becomes a real
   product — see the agent file for the plan.
2. **"Accounts" are just save codes.** `saveCurrentTrip()` / `loadTripByCode()`
   use `localStorage` with a 6-character code — there's no real login, and a
   trip is only accessible from the same browser it was saved in. A real
   product needs actual auth + a database.
3. **No native mobile app.** The site is responsive and installable to a
   phone's home screen, but an iOS/Android app is a separate build (React
   Native, Swift, or Kotlin).

## Design language

The visual identity is a travel-document motif: passport-page hero, ink-stamp
badge ("Mehadrin Verified"), boarding-pass-style itinerary cards. Keep this
consistent when adding UI — see the agent file for the full token system
(colors, type, layout conventions).
