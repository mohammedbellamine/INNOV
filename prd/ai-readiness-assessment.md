# PRD: Bilingual AI Readiness Assessment for SMEs

**Status:** Draft
**Owner:** mohammed.bellamine@gmail.com
**Last updated:** 2026-06-13

---

## 1. Overview

A bilingual (French / English) web application that helps small and medium-sized
enterprise (SME) owners understand how prepared their business is to adopt AI.
A business owner answers 10–15 simple, non-technical questions about their current
operations. The app instantly generates a personalized **AI Readiness Score** and
**3 prioritized recommendations**. A paid tier unlocks a detailed, downloadable
**action plan PDF**.

## 2. Problem Statement

Most SME owners hear that "AI will transform their business" but have no idea where
they actually stand or what to do first. Existing resources are either too technical,
too generic, or aimed at large enterprises. Owners need a fast, plain-language,
trustworthy starting point — in their own language.

## 3. Goals & Non-Goals

### Goals
- Let a non-technical owner complete the assessment in **under 5 minutes**.
- Produce a clear, credible readiness score and 3 actionable recommendations for free.
- Convert engaged free users into paying customers via a detailed action plan PDF.
- Full feature parity in **French and English**.

### Non-Goals
- Not a full AI consulting service or human advisory product (v1).
- Not an implementation/automation tool — it advises, it does not build.
- No deep industry-specific benchmarking in v1 (potential future work).

## 4. Target Users

- SME owners and managers (roughly 5–250 employees).
- Limited technical background; time-poor; budget-conscious.
- Primary markets: French-speaking and English-speaking regions
  (e.g. France, Canada/Québec, Belgium, Switzerland, and English-speaking markets).

## 5. User Stories

- As an owner, I want to answer a few simple questions so I can get a readiness score
  without needing technical knowledge.
- As a French-speaking user, I want the entire experience in French.
- As an owner, I want 3 concrete next steps so I know where to start.
- As an engaged owner, I want to buy a detailed action plan so I have a roadmap I can
  share with my team.

## 6. Functional Requirements

### 6.1 Language
- Language toggle (FR / EN) available on every screen.
- Auto-detect browser language on first visit, with manual override.
- All questions, results, recommendations, and the PDF fully localized.

### 6.2 Assessment Flow
- 10–15 questions, presented one or a few at a time with a progress indicator.
- Question types: multiple choice, single select, simple scales (e.g. 1–5).
- Suggested assessment dimensions:
  1. **Data** — what data the business collects and how it's stored.
  2. **Tools & Systems** — current software/digital tooling maturity.
  3. **Processes** — repetitive/manual tasks that could be automated.
  4. **People & Skills** — team comfort with technology.
  5. **Strategy & Budget** — leadership intent and willingness to invest.
- Allow back navigation; preserve answers within a session.

### 6.3 Scoring
- Each answer maps to weighted points across the dimensions.
- Output an overall **AI Readiness Score** (e.g. 0–100) plus a readiness tier
  (e.g. *Beginner / Developing / Ready*).
- Optionally show per-dimension sub-scores in the free result.

### 6.4 Recommendations (Free)
- Generate **3 prioritized recommendations** based on lowest-scoring or
  highest-impact dimensions.
- Each recommendation: short title, 1–2 sentence rationale, and a suggested first step.

### 6.5 Paid Tier — Action Plan PDF
- Unlocks a detailed, branded, downloadable PDF including:
  - Full score breakdown by dimension.
  - Expanded recommendations with step-by-step actions and timelines.
  - Suggested tools/categories and rough effort estimates.
  - Quick-win vs. long-term roadmap.
- PDF generated in the user's selected language.
- Payment via a standard provider (e.g. Stripe) — one-time purchase for v1.

### 6.6 Lead Capture
- Email required to view the full free result (or to send a copy of results).
- Consent checkbox for follow-up communication (GDPR-compliant).

## 7. Non-Functional Requirements
- **Performance:** results generated instantly client-side or via fast API call.
- **Privacy/Compliance:** GDPR-compliant; minimal data collection; clear privacy notice.
- **Accessibility:** WCAG AA; mobile-first responsive design.
- **Reliability:** PDF generation and payment must be robust with clear error states.

## 8. Monetization
- **Free:** score + 3 recommendations.
- **Paid (one-time):** detailed action plan PDF — target price point TBD
  (e.g. CAD $29–$69).
- Future: subscription for re-assessment over time, team/consultant tiers.

## 9. Success Metrics
- Assessment completion rate (target: > 60% of starters).
- Free-to-paid conversion rate (target: 3–8%).
- Average time to complete (target: < 5 min).
- FR vs EN usage split and conversion parity.
- Repeat/return visits and PDF downloads.

## 10. Suggested Tech Stack (Proposal)
- **Frontend:** Next.js + React, i18n (e.g. next-intl / i18next), Tailwind CSS.
- **Backend:** serverless functions or lightweight API (scoring logic).
- **Payments:** Stripe Checkout.
- **PDF:** server-side generation (e.g. Puppeteer or a PDF library) with localized templates.
- **Data store:** managed DB for leads/results (e.g. Postgres / Supabase).
- **Analytics:** privacy-friendly analytics for funnel tracking.

## 11. Open Questions
- Final number of questions (10 vs 15) and exact weighting model.
- Price point and whether to offer a launch discount.
- Should the PDF be emailed, downloaded, or both?
- Do we need industry-specific question branches in v1?
- Which payment + tax handling is needed for multi-region (Canadian GST/HST/QST, EU VAT)?

## 12. Future Enhancements
- Industry-specific question sets and benchmarks.
- Re-assessment / progress tracking over time.
- Consultant / white-label tier.
- Integration with recommended tools or partner directory.
- Additional languages.
