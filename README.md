# SGAI — SafeguardAI  
_The seatbelt for enterprise AI adoption._

SafeguardAI (SGAI) is a **Grammarly-style compliance layer** that prevents sensitive data leaks into AI tools.  
It detects and redacts **PII, PHI, and PCI data** in real time — before prompts leave the organization — enabling safe AI adoption under **HIPAA, PCI, GDPR, and CCPA**.

---

## 🚀 Features

- **Browser Extension (MV3)**  
  Works across ChatGPT, Claude, Copilot, Gmail, Slack, Salesforce, etc.  
  Inline highlights + suggestions, not just silent blocking.

- **Interactive Demo**  
  Redacts SSNs, credit cards, emails, DOBs, and more in real time.  
  Hover highlights explain _why_ something was flagged.

- **Compliance Dashboard**  
  - 📊 KPIs (Incidents, Blocked %, Masked %, Top Entities)  
  - 🔎 Incident drill-down with raw vs. sanitized payloads  
  - ⚖️ Policy builder: visual IF/THEN rules (block, mask, approve, audit)  
  - ✅ Approval workflows + audit logs

- **Sector-Specific Landing Pages**  
  Tailored messaging for **Healthcare (HIPAA/PHI)**, **Finance (PCI/GLBA/PII)**, and **General Enterprise (GDPR/CCPA)**.

- **Pricing & ROI Calculator**  
  Shows per-seat SaaS ($15–30/user), enterprise flat fee ($50k–250k/yr), and API usage ($0.01–0.05/doc).  
  ROI demo estimates breach costs avoided.

---

## 🏗 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)  
- [Zustand](https://zustand-demo.pmnd.rs/) for state, [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms/validation  
- [Lucide Icons](https://lucide.dev/) for UI  
- [Vitest](https://vitest.dev/) for unit tests, [Playwright](https://playwright.dev/) for E2E smoke tests  
- [Chrome Extension MV3](https://developer.chrome.com/docs/extensions/) with shared React components

---

## 📂 Project Structure (high level)

/app
/(marketing)/[icp] -> Healthcare, Finance, Enterprise
/(marketing)/install
/(marketing)/pricing
/(marketing)/roi
/(demo)/demo
/(console)/{dashboard,policies,approvals,settings}
/components -> UI + feature components
/data -> mock JSON for incidents, policies, pricing
/lib -> detectors, policies, mock API
/store -> Zustand stores
/extension -> Chrome MV3 (popup, options, content script)
/tests -> Playwright + Vitest

yaml
Copy code

---

## 🧪 Local Development

```bash
# Install deps
npm install

# Start dev server
npm run dev

# Run unit tests (Vitest)
npm run test

# Run E2E tests (Playwright)
npx playwright test

# Build Chrome extension (outputs to /extension/dist)
npm run build:ext
Then load the extension in Chrome:

Go to chrome://extensions/

Enable Developer Mode

Click Load unpacked → select /extension/dist

🎯 Mock Data & APIs
All data is seeded locally in /data/*.json and surfaced via mock API routes (/api/mock/*).
This enables full demo functionality without backend dependencies.

incidents.json → populates dashboard

policies.json → powers policy builder

pricing.json → drives pricing calculator

roiAssumptions.json → breach costs for ROI tool

🛡 Privacy & Security (Demo Mode)
All demo redaction runs locally in-browser (regex + simple NER stubs).

No data is stored or transmitted externally.

Enterprise mode will support on-prem and API proxy deployment for compliance.

📊 Market Positioning
SGAI addresses the urgent “Shadow AI” problem:

63% of ChatGPT inputs contain PII

Samsung, Amazon, Apple banned AI tools due to leaks

Regulators (HIPAA, PCI, GDPR) impose multi-million-dollar fines

Differentiation
Employee-friendly UX (Grammarly-like assistive highlights)

Bottom-up freemium adoption → viral growth inside orgs

Enterprise compliance depth (audit logs, SSO/SCIM, on-prem options)

Target ICPs
🏥 Healthcare (HIPAA/PHI redaction)

💳 Finance (PCI/GLBA, credit cards, account numbers)

🏢 Enterprise (GDPR/CCPA, DSAR redaction, general privacy)

📈 Roadmap (Draft)
Q4 2025: Chrome Extension Beta, 1k free installs

Q2 2026: Paid Teams launch, 5 enterprise pilots

2027: 100 enterprise clients, $5M ARR

👥 Team
Zach — CTO (AI/ML, full-stack engineering)

Mark — CPO (UX/product design)

Chris — COO (Ops, compliance, enterprise process)

Bobby — CRO/BD (Networking, partnerships, GTM)

📜 License
MIT (for now, subject to change as we productize enterprise features)

🤝 Contributing
We welcome PRs for:

New detectors (regex/ML models for PII/PHI/PCI)

UI/UX polish

Tests (Vitest/Playwright coverage)

📬 Contact
Website: safeguardai.dev (placeholder)

Email: founders@safeguardai.dev
