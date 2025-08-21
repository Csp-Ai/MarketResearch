# Architecture

## Component Diagram
```
[Browser]
   |
   v
[Vite/React/TS UI] --> [/api/* via Vercel Edge]
       |                         \
       |                          --> [Scraper & Analysis API]
       |                                   |
       v                                   v
[Supabase Auth & DB] <------ logs ------ [OpenAI API]
```

## Sequence Flow
```
User -> UI: enter URL
UI -> Scraper API: /discover {url}
Scraper API -> Supabase: store crawl record
Scraper API -> UI: crawlId
UI -> Scraper API: /select {crawlId}
Scraper API -> UI: candidate URLs
User -> UI: confirm URLs
UI -> Scraper API: /scrape {urls}
Scraper API -> Supabase: persist pages
Scraper API -> OpenAI: synthesize blueprint
Scraper API -> UI: analysisId + status
UI -> Supabase: fetch blueprint
UI -> User: render Blueprint
```

## Data Model
- **tables**
  - `crawls` (id, base_url, created_at)
  - `pages` (id, crawl_id, url, content)
  - `analyses` (id, crawl_id, report_json)
- **indexes**: `pages.crawl_id`, `analyses.crawl_id`
- **RLS**: enforce by user/session (TODO)

## Env / Config Map
| Key | Used By |
| --- | --- |
| `VITE_SCRAPER_API_BASE_URL` | frontend hooks `useAnalysis` |
| `VITE_SUPABASE_URL` | `src/lib/supabase.ts` |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.ts` |
| `OPENAI_API_KEY` | server-side analysis service |
| `PUBLIC_SITE_URL` | deployment config |

## Build & Deploy Topology
- **Local**: `npm run dev` launches Vite server at `localhost:5173`.
- **Prod**: Vercel builds static assets; functions or separate service host the Scraper API.
- **Logs**: Supabase table `logs` (optional) or Vercel console.

## Scalability & Cost Notes
- Crawl ~1MB per 100 pages; LLM cost ~USD $0.05 per 1k tokens.
- Estimate <$1 per 10-page site for blueprint generation.

## Replaceables
- Supabase ↔ Firebase/PlanetScale
- OpenAI ↔ Anthropic / local LLM
- Vercel ↔ Netlify / Render

---
[← Back to README](README.md)
