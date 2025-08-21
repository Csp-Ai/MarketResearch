# AI Agent Market Research Blueprint

> Turn any company website into a market research blueprint in minutes — powered by AI agents.  
> Deploy an agent team that crawls your site, mines content, and produces an AI-ready go-to-market blueprint.

> 📚 **Docs**: [Demo](DEMO.md) · [Agents](AGENTS.md) · [Architecture](ARCHITECTURE.md) · [Security](SECURITY.md)

---

## Why This Matters (SEI lens)
- **Decision velocity**: quickly surface market positioning and operational gaps.
- **Portfolio prioritization**: compare offerings and focus investment where data proves demand.
- **Lower research cost**: automate first-pass discovery and keep consultants on higher-value analysis.
- **Ops readiness**: blueprint outputs feed change-management checklists and risk registers.
- **Client impact**: provides SEI consultants with a ready-made first-pass view, accelerating due diligence, strategy assessments, and transformation roadmaps.

---

## Live Demo Flow
1. Enter a company URL and click **Deploy Agent Team**
2. **URL Scout** maps the site
3. **Page Selector** focuses high-value pages
4. **Content Miner** extracts copy
5. **Strategy Builder** assembles the AI Market Research Blueprint
6. Live agent feed logs progress and results
7. Download or share the Blueprint

> This mirrors how SEI teams accelerate discovery, reduce prep time, and focus consultants on high-value advisory work.  
See [DEMO.md](DEMO.md) for a step-by-step runbook and interview script.

---

## Features
- Agent pipeline: discovery → selection → extraction → synthesis
- Live feed with progress and crawl IDs
- Structured Blueprint: Company Overview, Offerings, Segments, Trends, Competition, Opportunities for AI, Tech Stack, Risks, Action Plan, Readiness
- Modular agents; easy to add vertical-specific agents later

---

## Architecture
- **Frontend**: Vite + React + TypeScript + Tailwind
- **Backend/services**: Supabase for storage and auth; scraping/analysis API (Node/TS or Python) for agents
- **Data layer**: Postgres via Supabase, object storage for assets
- **Job orchestration & logs**: agent statuses streamed to the live feed
- **Third-party APIs**: OpenAI (optional), Supabase, custom scraping API

See [ARCHITECTURE.md](ARCHITECTURE.md) for diagrams, sequence flow, and data contracts.

---

## Agents
- **URL Scout** – discovers site map
- **Page Selector** – ranks URLs for value
- **Content Miner** – pulls text from pages
- **Strategy Builder** – synthesizes the Blueprint

See [AGENTS.md](AGENTS.md) for inputs, outputs, heuristics, and SOPs.

---

## Setup & Local Dev
### Prerequisites
- Node.js LTS
- npm
- VS Code (recommended)

### Install & Run
```bash
npm install
npm run dev
