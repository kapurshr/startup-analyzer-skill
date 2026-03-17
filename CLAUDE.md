# CLAUDE.md

## What This Repository Is

This is a **Claude Code skill definition** — a prompt-engineering repository that teaches Claude how to act as a startup analyzer from an employee's equity perspective. It is not a deployable application.

The skill produces VC-quality analysis memos and scorecards to help someone decide whether to join a startup, with a focus on equity upside, dilution modeling, and growth potential assessment.

## Repository Structure

```
startup-analyzer-skill/
├── SKILL.md                          # PRIMARY: Core skill definition
├── README.md                         # User-facing docs
├── CLAUDE.md                         # This file — dev instructions
├── references/
│   ├── sectors/                      # Cached sector theses (grows over time)
│   │   └── [sector-slug].md          # e.g., enterprise-ai-agents.md
│   ├── valuation-benchmarks.md       # Exit multiples, valuation ranges by stage
│   ├── dilution-guide.md             # Dilution math, option pool, preferences
│   └── investor-tier-list.md         # VC firm quality tiers for scoring
├── assets/
│   └── memo-template.md              # Full memo + offer addendum templates
└── scripts/
    └── equity-calculator.ts          # Standalone dilution/scenario calculator (Bun)
```

**SKILL.md** is the canonical source of truth for skill behavior. All changes to how the skill operates start here.

**references/** files are supporting context loaded by agents during analysis. Changes to valuation data, dilution math, or investor tiers should be made in these files, not inlined in SKILL.md.

**references/sectors/** is a growing cache — new sector theses are saved here automatically after each analysis. These files have a 90-day TTL.

**assets/memo-template.md** contains the full memo structure with section templates. This is separate from SKILL.md so the template can evolve independently.

## Key Constraints to Preserve

- **7 dimensions, weights sum to 100%**: Market (20%) + Competitive (15%) + Traction (20%) + Team (15%) + Financials (15%) + Product (10%) + Equity (5%)
- **Data confidence is mandatory**: Every dimension must have a High/Medium/Low/Unavailable confidence indicator
- **Agent failure = 2.5 default**: Never silently drop a dimension
- **Sector caching**: Always check `references/sectors/` before dispatching Agent 1. Always save new sector research. 90-day TTL.
- **Two output files always**: Scorecard + Memo, saved to `~/Downloads/startup-analyzer/`
- **Offer Mode is additive**: It adds sections 11-17 to the memo, never replaces the base analysis
- **Recruiter question checklist**: Always generated in Offer Mode, even with complete offer data

## Execution Flow

1. Identify sector → check cache
2. Dispatch 4-5 parallel agents (Agent 1 skipped if cache hit)
3. Compile agent results → score 7 dimensions with confidence
4. Generate scorecard (ASCII art) + full memo
5. If Offer Mode: append equity analysis sections
6. Save both files to `~/Downloads/startup-analyzer/`
7. If Agent 1 ran: save sector thesis to `references/sectors/`
