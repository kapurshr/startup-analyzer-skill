# 🔍 Startup Analyzer Skill

> **Built because "should I join this startup?" shouldn't require a finance degree and six hours on Crunchbase.**
>
> A friend had a startup offer with "0.1% equity at $1.5B valuation" and asked: "Is this good?" That question has no simple answer — it depends on the sector, the competition, the team, the funding stack, the liquidation preferences, the dilution from future rounds, and about twenty other things. So I built a skill that researches all of it in 5 minutes and gives you an actual answer.

A Claude Code skill that analyzes any startup's growth potential from an **employee's perspective** — not "should I invest?" but "should I bet my career on this?" It deploys a parallel agent swarm, scores the company across 7 dimensions, and produces a VC-quality memo with a clear verdict.

## What It Does

1. **Identifies the sector** and either loads a cached thesis or researches one fresh
2. **Launches 4-5 parallel agents** — each one investigates a different dimension (sector, traction, team, funding, equity)
3. **Scores the company 1-5** across 7 weighted dimensions with confidence indicators
4. **Generates a scorecard** (visual quick-reference) and a **full analysis memo** (1,500-2,500 words)
5. **If you have an offer:** models dilution, runs 3 exit scenarios with your payout, compares to Big Tech counterfactual, and generates a "questions to ask your recruiter" checklist

## Quick Start

```bash
# Symlink into Claude Code skills
ln -s /path/to/startup-analyzer-skill ~/.claude/skills/startup-analyzer
```

Then in Claude Code:
```
"Analyze Sierra AI"
"Should I join Ramp? Here's my offer: 0.05% equity, $200K base, $2B valuation"
"Compare Harvey AI vs Glean"
```

## The 7 Dimensions

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| Market & Sector | 20% | TAM, growth, tailwinds, market structure |
| Competitive Position | 15% | Moat, differentiation, positioning |
| Traction & Revenue | 20% | ARR, customers, growth rate, PMF |
| Team & Culture | 15% | Founders, exec hires, headcount growth, Glassdoor |
| Financials & Funding | 15% | Investor quality, funding velocity, runway |
| Product Strength | 10% | Reviews, technical moat, platform risk |
| Equity & Liquidity | 5% | Time-to-exit, comparable exits, IPO signals |

## Verdicts

| Score | Verdict | What It Means |
|-------|---------|--------------|
| 4.5–5.0 | **Strong join** | Negotiate hard on equity — this is likely worth it |
| 3.5–4.4 | **Solid bet** | Upside is real but not guaranteed |
| 2.5–3.4 | **Proceed with caution** | Significant risks, equity may not materialize |
| 1.0–2.4 | **Red flags** | Equity likely worth $0, evaluate on cash only |

## Two Modes

### Explore Mode
Just give it a company name. You get:
- Sector thesis with competitive landscape
- Full company analysis memo (10 sections)
- Visual scorecard with verdicts

### Offer Mode
Give it a company name + your offer details. You get everything above plus:
- Dilution model (ownership after future rounds)
- 3 exit scenarios (Bear/Base/Bull) with your pre-tax payout
- Big Tech counterfactual ("staying at [company] for 4 years = $X")
- Liquidation preference impact analysis
- "Questions to Ask Your Recruiter" checklist

## Sector Caching — It Remembers

The skill builds a library over time. First time you analyze an enterprise AI company? It researches the full sector. Second time? It loads the cached thesis and skips straight to the company analysis. Saves ~2 minutes per run.

**Dual-layer caching:**
- **File cache** (`references/sectors/`) — saved in the repo, committed with git
- **Claude memory** — persists across conversations. Start a fresh session tomorrow and it still knows the enterprise AI landscape from yesterday's research

Resolution: memory first → file cache → fresh research. Both updated after every analysis.

Force refresh anytime with "re-analyze the sector."

## Agent Architecture

```
"Analyze [Company]"
  │
  ├─→ Check Claude memory for sector thesis
  ├─→ Check references/sectors/ file cache
  │
  ├─→ Agent 1: Sector Thesis (skip if cached in memory or file)
  │   Sources: Gartner, Forrester, CB Insights, market reports
  │
  ├─→ Agent 2: Traction + Product
  │   Sources: G2, Capterra, Product Hunt, TechCrunch, company blog
  │
  ├─→ Agent 3: Team + Culture
  │   Sources: LinkedIn headcount, Glassdoor, Blind, company team page
  │
  ├─→ Agent 4: Funding + Financials
  │   Sources: Crunchbase, PitchBook, press, investor-tier-list.md
  │
  └─→ Agent 5: Equity Deep-Dive (offer mode only)
  │   Sources: dilution-guide.md, valuation-benchmarks.md, exit comps
  │
  ▼
  Score → Scorecard → Memo → Save
  → Cache sector to memory + file
```

## What You Get

```
~/Downloads/startup-analyzer/
├── sierra_ai_scorecard.md
└── sierra_ai_analysis_memo.md
```

The scorecard:
```
═══════════════════════════════════════════════
  STARTUP SCORECARD: Sierra AI
  Sector: Enterprise AI Agents
  Stage: Late-stage | Valuation: $10B+
  Composite Score: 4.3 / 5.0 — Solid Bet
═══════════════════════════════════════════════

  Market & Sector      ████████░░  4.0  High    Strong tailwinds, large TAM
  Competitive Position ████████░░  4.0  High    Bret Taylor moat, crowded
  Traction & Revenue   █████████░  4.5  Medium  Enterprise logos, rapid growth
  Team & Culture       █████████░  4.5  High    Elite founders, strong board
  Financials & Funding ████████░░  4.0  High    Top-tier investors
  Product Strength     ████████░░  4.0  Medium  Multi-vertical deployment
  Equity & Liquidity   ████████░░  4.0  Medium  IPO likely 2-3 years

  VERDICT: Solid bet — negotiate hard on equity
═══════════════════════════════════════════════
```

## Skill Structure

```
startup-analyzer-skill/
├── SKILL.md                      # The brain
├── README.md                     # You are here
├── CLAUDE.md                     # Dev instructions
├── references/
│   ├── sectors/                  # Cached sector theses
│   ├── valuation-benchmarks.md   # Exit multiples & comps
│   ├── dilution-guide.md         # Equity math
│   └── investor-tier-list.md     # VC quality tiers
├── assets/
│   └── memo-template.md          # Memo structure
└── scripts/
    └── equity-calculator.ts      # Standalone calculator
```

## Limitations

- Relies on publicly available data — stealth startups get a "Partial Analysis" flag
- Equity projections are estimates, not guarantees
- Not legal or financial advice — always consult professionals for offer negotiation
- Best with Claude Code (needs WebSearch, WebFetch, parallel agents)

---

**Created:** March 2026
**Version:** 1.0
**Built by:** Someone who's been on both sides of the "should I join?" question 🔍
