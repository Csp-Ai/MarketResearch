# AI Agent Market Research Blueprint

> Deploy an agent team that crawls your site, mines content, and produces an AI-ready go-to-market blueprint in minutes.

> 📚 **Docs**: [Demo](DEMO.md) · [Agents](AGENTS.md) · [Architecture](ARCHITECTURE.md) · [Security](SECURITY.md)

## Why This Matters (SEI lens)
- **Decision velocity**: quickly surface market positioning and operational gaps.
- **Portfolio prioritization**: compare offerings and focus investment where data proves demand.
- **Lower research cost**: automate first-pass discovery and keep consultants on higher-value analysis.
- **Ops readiness**: blueprint outputs feed change-management checklists and risk registers.

## Live Demo Flow
1. Enter a company URL and click **Deploy Agent Team**
2. **URL Scout** maps the site
3. **Page Selector** focuses high-value pages
4. **Content Miner** extracts copy
5. **Strategy Builder** assembles the AI Market Research Blueprint
6. Live agent feed logs progress and results
7. Download or share the Blueprint

See [DEMO.md](DEMO.md) for a step-by-step runbook and interview script.

## Features
- Agent pipeline: discovery → selection → extraction → synthesis
- Live feed with progress and crawl IDs
- Structured Blueprint: Company Overview, Offerings, Segments, Trends, Competition, Opportunities for AI, Tech Stack, Risks, Action Plan, Readiness
- Modular agents; easy to add vertical-specific agents later

## Architecture
- **Frontend**: Vite + React + TypeScript + Tailwind
- **Backend/services**: Supabase for storage and auth; scraping/analysis API (Node/TS or Python) for agents
- **Data layer**: Postgres via Supabase, object storage for assets
- **Job orchestration & logs**: agent statuses streamed to the live feed
- **Third-party APIs**: OpenAI (optional), Supabase, custom scraping API

See [ARCHITECTURE.md](ARCHITECTURE.md) for diagrams, sequence flow, and data contracts.

## Agents
- **URL Scout** – discovers site map
- **Page Selector** – ranks URLs for value
- **Content Miner** – pulls text from pages
- **Strategy Builder** – synthesizes the Blueprint

See [AGENTS.md](AGENTS.md) for inputs, outputs, heuristics, and SOPs.

## Setup & Local Dev
### Prerequisites
- Node.js LTS
- npm
- VS Code (recommended)

### Install & Run
```bash
npm install
npm run dev
```

### Environment
Copy `.env.example` to `.env` and fill in keys.
```bash
cp .env.example .env
```

Key variables:
- `PUBLIC_SITE_URL` – base URL for redirects/OG tags
- `VITE_SCRAPER_API_BASE_URL` – backend for URL crawling and analysis
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` – Supabase project
- `OPENAI_API_KEY` – optional, enables embedding/LLM features

### Build/Test
```bash
npm run build
npm run lint --if-present
npm test --if-present
```

### Deployment
Optimized for Vercel: `vercel --prod` (requires configured project).

## Security & Compliance
- Secrets provided via environment variables; `.env` excluded from git
- Supabase Row Level Security recommended for all tables
- Add rate limiting and input validation to backend endpoints
- `public/robots.txt` respects crawl ethics

See [SECURITY.md](SECURITY.md) for the full policy.

## Engineering Audit
### Strengths
- TypeScript with `strict` mode enabled
- Vite + React + Tailwind for rapid iteration
- Supabase integration with environment-based config
- Lockfile and npm scripts for dev/build/lint

### Gaps
- No automated tests or CI pipeline
- Backend lacks documented rate limits and input validation
- No pre-commit hooks to enforce linting/formatting

### Prioritized Fixes
- **P0**: add server-side validation, rate limiting, and basic pre-commit checks
- **P1**: introduce CI with lint/build/test and start unit test coverage
- **P2**: implement CSP headers and expand telemetry/monitoring

## Roadmap
- **Short-term**: polish demo flows and stabilize agent APIs
- **Near-term**: add vertical-specific agents and richer analytics
- **Later**: enterprise features (SSO, audit logs, SLA dashboards)

## License & Attribution
MIT License. Based on Vite React TypeScript starter.

