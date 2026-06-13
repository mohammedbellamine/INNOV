# Roadmap — Bilingual AI Readiness Assessment

Derived from [prd/ai-readiness-assessment.md](../prd/ai-readiness-assessment.md), mapped onto
the actual foundation in [docs/architecture.md](architecture.md) (Cloudflare Worker + Hono API +
React Router SSR + D1 + Clerk), not the PRD's proposed Next.js/Stripe/Postgres stack.

Each phase is a **deployable vertical slice**: it ends with something live on
`https://ai-readiness.mohammed-bellamine.workers.dev` that a real user can exercise.

## Status

- **Phase 0 — Foundation: ✅ done.** D1 `ari` created + migrated (local & remote), secrets set,
  first deploy live. See git history.
- **Next up: Phase 1.**

---

## Key decisions (confirm or override)

These shape everything below. I've picked defaults justified by what's already in the repo;
tell me to change any.

| # | Decision | Default chosen | Why |
|---|----------|----------------|-----|
| D1 | **Auth model for the funnel** | The assessment is **anonymous/public** — no Clerk login to take it or see the free result. Lead identity = email. Clerk-authed area is deferred (only needed later for an owner/admin dashboard). | Matches PRD §6.2/§6.6; mirrors the `widget-embed` public `/api/public/*` pattern already in the architecture. |
| D2 | **Payment provider** | **Polar** one-time product, via the `billing-polar` skill already vendored. Not Stripe. | The skill is in-repo and wired to the receiver/plan model. One-time (not subscription) per PRD §6.5. |
| D3 | **PDF generation** | Server-side in the Worker; both **download** and **email** (via `email-resend` skill). | PRD §6.5 + open question §11. Workers-compatible PDF lib (not Puppeteer). |
| D4 | **i18n** | Lightweight in-repo dictionary + locale in URL/cookie, browser-detected. No next-intl (not a Next app). | Smallest dependency that meets §6.1 parity. |
| D5 | **Question count / weights** | Start with **12 questions**, 4 per dimension is uneven → ~2–3 across 5 dimensions; weights in config. | PRD §11 left open; pick a concrete seed, tune later. |

---

## Phase 1 — Bilingual shell (i18n foundation)

**Goal:** Every screen can render FR or EN; language is detected and toggleable.

- Locale resolution: browser `Accept-Language` on first visit → cookie override; `?lang=` escape hatch.
- Translation dictionary module (`app/lib/i18n/`) with `t(key, locale)`; FR + EN catalogs.
- Persistent language toggle in the layout; `<html lang>` set correctly for a11y/SEO.
- Localized landing page (hero, value prop, "Start assessment" CTA).

**Deployable check:** Visit site in a FR browser → FR landing; toggle to EN → everything switches; reload preserves choice.

## Phase 2 — Question bank + scoring model (data + config)

**Goal:** The assessment content and weighting exist and are served.

- New D1 tables (migration): `assessments` (a session/run), `responses` (answers per run). Keep questions in **config**, not DB (like `plans.ts`) so editing copy is a deploy, not a migration.
- Question bank module: 12 questions across the 5 PRD dimensions (Data, Tools & Systems, Processes, People & Skills, Strategy & Budget), each option carrying weighted points; fully bilingual.
- Public API: `GET /api/public/assessment/questions?lang=` (controller → service; no repo yet).
- Pure **scoring service** with unit tests: answers → per-dimension sub-scores + overall 0–100 + tier (Beginner/Developing/Ready).

**Deployable check:** `curl .../api/public/assessment/questions?lang=fr` returns localized questions; scoring unit tests pass.

## Phase 3 — Assessment flow (the core UX)

**Goal:** A user can walk through all questions and submit.

- Multi-step UI: one/few questions per screen, progress indicator, back navigation, answers preserved in-session (client state + optional `assessments` row for resume).
- `POST /api/public/assessment` to create a run; `PATCH` to save progress; `POST .../submit` to finalize → returns score payload.
- Mobile-first, WCAG AA (keyboard nav, focus, labels).

**Deployable check:** Complete a full 12-question run on mobile in < 5 min; refresh mid-way doesn't lose answers; submit returns a score.

## Phase 4 — Free results + recommendations + lead capture

**Goal:** The complete **free funnel** end to end.

- Results screen: overall score + tier, per-dimension breakdown (visual), localized.
- **Recommendation engine** (service, tested): pick 3 prioritized recos from lowest/highest-impact dimensions; each = title + 1–2 sentence rationale + suggested first step; bilingual copy keyed by dimension/tier.
- **Lead capture** gate: email required to reveal full result; GDPR consent checkbox + privacy notice; store lead (email, locale, score, consent, timestamp) scoped to the run.
- Optional: email a copy of results (wire `email-resend` skill).

**Deployable check:** Take assessment → enter email + consent → see score, 3 recos, per-dimension; lead row persisted.

## Phase 5 — Payment (unlock paid tier)

**Goal:** A user can pay once to unlock the action plan.

- Install/wire `billing-polar` skill: one-time Polar product, `GET /api/billing/checkout`, return-reconcile, `POST /api/integrations/polar` receiver.
- Associate purchase with the assessment run / lead email (entitlement record), since funnel is anonymous (no org).
- Localized checkout entry + post-purchase return handling with clear error states (PRD §7 reliability).

**Deployable check:** Click "Get action plan" → Polar checkout → return → run is marked entitled (reconcile self-heals a missed webhook).

## Phase 6 — Action plan PDF (the paid deliverable)

**Goal:** Entitled users download/receive a branded, localized PDF.

- Server-side PDF generation in the Worker (Workers-compatible lib): full score breakdown, expanded recommendations with steps + timelines, suggested tool categories + effort estimates, quick-win vs long-term roadmap.
- Generated in the run's selected language; gated on the Phase 5 entitlement.
- Deliver via signed download **and** email attachment/link (`email-resend`); optional R2 storage (`r2-uploads`) for re-download.

**Deployable check:** As an entitled user, download a correct FR PDF and an EN PDF; non-entitled request is refused (402).

## Phase 7 — Funnel analytics, compliance & launch polish

**Goal:** Measure the funnel and harden for real traffic.

- Privacy-friendly funnel events: start → complete → email → checkout → download; FR/EN split (success metrics §9).
- GDPR: privacy policy page, data-retention/delete path for leads, minimal-collection review.
- A11y/perf audit (WCAG AA, mobile), error-state review for PDF + payment, SEO/meta + social cards in both languages.

**Deployable check:** Funnel dashboard shows completion & free→paid conversion; a11y/perf checks pass; privacy policy live.

---

## Explicitly deferred (post-v1, from PRD §12)

Industry-specific question branches · re-assessment/progress over time · consultant/white-label tier ·
partner/tool directory integration · additional languages · subscription re-assessment tier ·
Clerk-authed owner dashboard (only if accounts become needed).

## Open questions still to resolve (PRD §11)

Final question count (12 vs 15) & exact weights · price point + launch discount · PDF email vs download (defaulting to both) · multi-region tax handling (Canada GST/HST/QST, EU VAT) for Polar.
