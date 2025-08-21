# Demo Runbook

Audience: SEI Phoenix Managing Director

## Five‑Minute Path
1. **One‑liner**: "This agent team scans a company's site and builds an AI‑ready market research blueprint in minutes."
2. Paste a real URL and click **Deploy Agent Team**.
3. Narrate the live feed as agents progress (crawl IDs, page counts).
4. Show the generated Blueprint sections.
5. Tie each section to Ops & Strategy decisions (prioritization, resourcing, risk mgmt).
6. Close with next steps: pilot scope, KPIs, timeline.

## Fallback Plan
- If network/API is slow, load a cached run from `example-output.json`.
- Screenshare the Blueprint JSON or PDF and walk through highlights.

## Talking Points
- Governance & security stance (see SECURITY.md).
- Human consultants validate agent findings and craft recommendations.
- Plugs into client data sources via Supabase or REST APIs.

## Q&A
- **ROI?** ~90% faster first-pass research; <$1 per 10-page site.
- **Accuracy?** Agents surface raw text; consultants verify and refine.
- **Hallucination defense?** Blueprint cites source URLs; no generation without data.
- **Scale?** Horizontal scaling of crawl workers; LLM cost scales linearly.
- **Change mgmt?** Outputs feed existing SEI playbooks and communication plans.

---
[← Back to README](README.md)
