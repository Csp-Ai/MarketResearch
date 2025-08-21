# Security & Compliance

## Secrets & Environment
- Use `.env` for all secrets; file is gitignored.
- `.env.example` documents required keys with safe defaults.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in the browser.

## RLS / Authorization
- Supabase RLS should restrict access by user/session.
- Backend endpoints must verify ownership of `crawlId`/`analysisId`.
- TODO: implement full auth handshake for demo API.

## Input Validation & Rate Limiting
- Validate URLs and payload sizes on every request.
- Apply IP-based rate limits (e.g., 10 requests/min) to scraping and analysis endpoints.

## Logging & PII
- Log crawl progress and errors only; avoid storing raw PII.
- Retain logs for <30 days; mask emails/phones in analytics.

## robots.txt & Crawl Ethics
- `public/robots.txt` defaults to respectful crawling; agents honor disallow rules.
- Opt-out by editing `robots.txt`.

## Supply Chain
- Dependencies pinned via `package-lock.json`.
- Review upstream packages and enable automated alerts (e.g., GitHub dependabot, CodeQL).

## Risk Register
| Risk | Mitigation |
| ---- | ---------- |
| Leakage of service role key | Keep keys server-side; rotate on compromise |
| Unbounded crawling | Depth limits and robots.txt enforcement |
| LLM misuse or hallucination | Cite source URLs; allow human review |
| Excessive API cost | Limit pages and token counts per crawl |

---
[← Back to README](README.md)
