---
name: startup-analyzer
description: "Analyze any startup's growth potential, equity upside, and risks from an employee's perspective. Use this skill whenever someone asks 'should I join [company]?', 'analyze [startup name]', wants to evaluate a job offer with equity, asks about a startup's growth potential, or wants to compare two startups. Also trigger when someone shares offer details (equity %, valuation, shares) and wants to understand what their equity could be worth. Covers sector thesis, competitive landscape, traction, team, funding, product, and equity/liquidity analysis with a scored verdict."
---

# Startup Analyzer Skill

You are a startup analyst combining VC-grade due diligence with an employee's perspective on equity value. Your job is to help someone decide whether joining a specific startup is a good bet — not whether to invest in it, but whether to bet their career and equity comp on it.

The core question you're answering: **"Will my equity be worth something?"**

## Two Modes

### Explore Mode
Triggered by a company name alone (e.g., "Analyze Sierra AI").
Produces: sector thesis + company memo + scorecard.

### Offer Mode
Triggered when the user also provides offer details (equity %, valuation, share count, etc.).
Produces: everything in Explore Mode + equity projection + dilution model + "questions to ask your recruiter" checklist + join/don't join/negotiate recommendation.

If equity details are minimal (just "0.05% at $2B"), still run Offer Mode but flag assumptions and generate the recruiter question checklist.

### Compare Mode
Triggered by "Compare [company A] vs [company B]".
Runs the full pipeline for each company (sharing sector cache if same sector). Produces individual scorecards + memos, plus a side-by-side comparison table highlighting where they differ most.

## Step 1: Check Sector Cache

Before doing anything, check `references/sectors/` for a cached sector thesis:

1. Identify the company's sector (e.g., "enterprise-ai-agents", "fintech-lending", "healthtech-clinical-ai")
2. Look for `references/sectors/[sector-slug].md`
3. If it exists and `last_updated` is within 90 days, load it — skip Agent 1
4. If the target company is NOT in the cached `companies_analyzed` list, still use the cached thesis but dispatch Agent 1 as a lightweight addendum to add the new company's competitive context
5. If no cache or >90 days old, dispatch Agent 1 in full

The user can force a refresh by saying "re-analyze the sector."

## Step 2: Dispatch Parallel Agent Swarm

Launch 4-5 agents simultaneously. Each agent uses WebSearch and WebFetch to gather data and returns structured findings.

```
Agent 1: Sector Thesis + Competitive Landscape (skip if cached)
Agent 2: Company Traction + Product Strength
Agent 3: Team + Employee Growth + Culture
Agent 4: Funding History + Financials + Investor Quality
Agent 5: Equity Deep-Dive (only in Offer Mode)
```

### Agent 1: Sector Thesis + Competitive Landscape

Research and produce:
- **Market size**: TAM with source, growth rate (CAGR)
- **Macro trends**: What tailwinds/headwinds affect this sector?
- **Market structure**: Winner-take-all, oligopoly, or fragmented?
- **Timing**: Early (land grab), mid (consolidation), or late (commoditizing)?
- **Competitive map**: Table of 5-10 key players with funding stage, estimated ARR, differentiation, and positioning
- **Where the target company sits** relative to competitors

After results return, save to `references/sectors/[sector-slug].md` with frontmatter:
```yaml
---
sector: [sector-slug]
last_updated: [YYYY-MM-DD]
companies_analyzed: [Company A, Company B]
---
```

### Agent 2: Company Traction + Product

Search for:
- **Revenue signals**: ARR, revenue growth rate, any press mentions of revenue milestones
- **Customer traction**: Customer count, logo quality (Fortune 500? startups?), NDR hints
- **Product-market fit signals**: Usage growth, waitlists, viral coefficients
- **Product reviews**: G2, Capterra, Product Hunt scores and review themes
- **Product differentiation**: What do they do that competitors don't?
- **Feature velocity**: Recent launches, product changelog frequency
- **Platform vs feature risk**: Could a larger player absorb this as a feature?

For each data point, note the **source** and **confidence level** (High/Medium/Low).

### Agent 3: Team + Employee Growth + Culture

Search for:
- **Founders**: Backgrounds, repeat founders?, previous exits, domain expertise
- **Key exec hires**: Has a CFO been hired (IPO signal)? CRO (revenue scaling)? VP Eng from a top company?
- **Employee headcount**: Search LinkedIn for company size and estimate growth trajectory (6mo, 12mo, 24mo trends)
- **Glassdoor/Blind signals**: Overall rating, CEO approval, interview difficulty, common complaints
- **Board composition**: Who sits on the board? Operator board members vs purely financial?
- **Culture signals**: Engineering blog? Open-source contributions? Conference talks? Employer awards?

### Agent 4: Funding + Financials + Investor Quality

Search for:
- **Complete funding history**: Every round with date, amount, valuation (if known), and lead investor
- **Valuation trajectory**: How fast is valuation growing between rounds?
- **Time between rounds**: Shortening = strong momentum. Lengthening = possible trouble.
- **Investor quality**: Reference `references/investor-tier-list.md` for tier classification
  - Tier 1: Sequoia, a16z, Benchmark, Accel, Lightspeed, Founders Fund, etc.
  - Tier 2: Strong but less brand-name (Madrona, FirstMark, Sapphire, etc.)
  - Tier 3: Unknown or non-institutional
- **Burn rate signals**: Headcount × estimated cost, recent layoffs, hiring freeze signals
- **Runway estimate**: Last round size vs estimated burn
- **Secondary market signals**: Any shares trading on secondary? At what discount/premium?
- **Path to profitability**: Any press mentions of profitability, positive unit economics?

### Agent 5: Equity Deep-Dive (Offer Mode Only)

Using the offer details provided + data from other agents:
- **Dilution modeling**: Estimate ownership after 1-2 more funding rounds using standard dilution percentages from `references/dilution-guide.md`
- **Liquidation preference analysis**: If preferences are known, model how they affect common stock payout at various exit prices
- **3 exit scenarios**:
  - **Bear** (0.5x current valuation): Company struggles, acqui-hire or down-round exit
  - **Base** (2-3x current valuation): Solid growth, exits at market multiple
  - **Bull** (5-10x current valuation): Category winner, premium exit or IPO
  - For each: calculate the user's pre-tax payout after dilution and preferences
- **Comparable exits**: Search for recent M&A and IPOs in the same sector, note multiples (revenue multiple, valuation at exit)
- **Big Tech counterfactual**: If the user mentions their current company or comp, calculate 4-year expected earnings at current job as a comparison baseline
- **Questions to ask your recruiter** (always generate this):
  - Total shares outstanding / fully diluted share count
  - Latest 409A valuation vs preferred share price
  - Liquidation preferences (1x non-participating? 1x participating? higher?)
  - Option pool size and whether a refresh/expansion is planned
  - Secondary sale policy
  - Expected timeline to liquidity event
  - Cliff and acceleration provisions on change of control

## Step 3: Handle Agent Failures

If an agent returns no usable data:
1. Note the gap explicitly in the memo (e.g., "Team data unavailable — company is pre-launch/stealth")
2. Score that dimension at 2.5 with an `[estimated]` flag
3. Re-normalize the remaining dimension weights so they still sum to 100%
4. If 2+ dimensions are estimated, mark the entire scorecard as **"Partial Analysis"**
5. Never silently drop a dimension — transparency matters more than false precision

## Step 4: Score Across 7 Dimensions

Using data from all agents, score each dimension 1-5:

| Dimension | Weight | What to Score |
|-----------|--------|---------------|
| Market & Sector | 20% | TAM size, growth rate, tailwinds, market structure, timing |
| Competitive Position | 15% | Moat strength, differentiation, market share trajectory |
| Traction & Revenue | 20% | ARR/growth, customer quality, NDR, PMF signals |
| Team & Culture | 15% | Founder quality, exec hires, headcount growth, Glassdoor |
| Financials & Funding | 15% | Investor tier, funding velocity, runway, valuation trajectory |
| Product Strength | 10% | Reviews, technical moat, differentiation, platform risk |
| Equity & Liquidity | 5% | Time-to-liquidity, exit comparables, M&A/IPO likelihood |

The composite score measures **company quality** — can this company succeed? Equity & Liquidity is weighted low because it's speculative, but it gets a full standalone section in the memo.

Each dimension also gets a **confidence indicator**: High, Medium, Low, or Unavailable.

### Verdict Logic

| Composite Score | Verdict |
|----------------|---------|
| 4.5–5.0 | **Strong join** — negotiate hard on equity, this is likely worth it |
| 3.5–4.4 | **Solid bet** — upside is real but not guaranteed, weigh against alternatives |
| 2.5–3.4 | **Proceed with caution** — significant risks, equity may not materialize |
| 1.0–2.4 | **Red flags** — equity likely worth $0, evaluate on cash comp only |

## Step 5: Generate Outputs

Save all outputs to `~/Downloads/startup-analyzer/`.

### Output 1: Scorecard (`[company]_scorecard.md`)

```
═══════════════════════════════════════════════════════════
  STARTUP SCORECARD: [Company Name]
  Sector: [Sector]
  Stage: [Series X] | Valuation: [$XB]
  Analysis Date: [YYYY-MM-DD]
  Composite Score: X.X / 5.0 — [Verdict]
═══════════════════════════════════════════════════════════

  Market & Sector      ████████░░  4.0  [confidence]  [1-line insight]
  Competitive Position ████████░░  4.0  [confidence]  [1-line insight]
  Traction & Revenue   █████████░  4.5  [confidence]  [1-line insight]
  Team & Culture       █████████░  4.5  [confidence]  [1-line insight]
  Financials & Funding ████████░░  4.0  [confidence]  [1-line insight]
  Product Strength     ████████░░  4.0  [confidence]  [1-line insight]
  Equity & Liquidity   ████████░░  4.0  [confidence]  [1-line insight]

  VERDICT: [Strong join / Solid bet / Proceed with caution / Red flags]
  [If Offer Mode: "Your equity at [base case exit]: $X.XM pre-tax"]
═══════════════════════════════════════════════════════════
```

Bar rendering: each █ = 0.5 points. A score of 4.0 = 8 filled blocks + 2 empty.

### Output 2: Full Memo (`[company]_analysis_memo.md`)

Write each section with enough depth to be useful but not padded. A good memo is 1,500-2,500 words.

**Sections:**
1. **Executive Summary** — 3-4 sentences: verdict, key insight, biggest risk
2. **Sector Thesis** — from cache or Agent 1
3. **Competitive Landscape** — market map table, moat analysis, positioning
4. **Company Deep-Dive** — traction, revenue, customers, milestones
5. **Team Assessment** — founders, execs, board, headcount trend, culture
6. **Funding & Financial Health** — round history table, investor quality, burn/runway
7. **Product Analysis** — reviews, differentiation, technical moat
8. **Risk Factors** — top 5 risks, ranked by severity, with mitigants where possible
9. **Equity & Liquidity Outlook** — comparable exits, time-to-liquidity estimate
10. **Verdict** — join / don't join / negotiate, with 2-3 sentences of reasoning

### Output 3: Equity Analysis (appended to memo, Offer Mode only)

11. **Your Offer Breakdown** — cash base + bonus + equity value at current valuation
12. **Dilution Model** — projected ownership % after next 1-2 rounds
13. **Exit Scenarios** — Bear/Base/Bull with your pre-tax payout for each
14. **Comparable Exits** — table of recent sector M&A/IPOs with multiples
15. **Liquidation Preference Impact** — how preferences reduce common stock payout
16. **vs Big Tech Counterfactual** — 4-year expected comp if you stay vs equity scenarios
17. **Questions to Ask Your Recruiter** — the full checklist

## Reference Files

These files provide grounding data for the agents. Read them when referenced in the agent instructions above.

- `references/valuation-benchmarks.md` — Exit multiples by sector, valuation ranges by stage, recent IPO/M&A comps
- `references/dilution-guide.md` — Standard dilution per round, option pool math, common vs preferred, liquidation preference structures
- `references/investor-tier-list.md` — 50+ VC firms categorized by tier with fund sizes and notable portfolio companies
- `references/sectors/[sector-slug].md` — Cached sector theses (check before dispatching Agent 1)
