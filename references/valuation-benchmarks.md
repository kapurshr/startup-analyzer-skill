# Valuation Benchmarks & Exit Comparables

Reference for scoring Equity & Liquidity and for Agent 5's exit scenario modeling.

## Valuation Ranges by Stage (2024-2026 Market)

| Stage | Typical Pre-Money Valuation | Revenue Multiple (ARR) | Notes |
|-------|----------------------------|----------------------|-------|
| Seed | $5M–$20M | N/A (pre-revenue) | Valuation based on team + idea + market |
| Series A | $20M–$80M | 20-50x | High multiple, low absolute revenue |
| Series B | $80M–$300M | 15-30x | PMF established, scaling revenue |
| Series C | $300M–$1.5B | 10-25x | Growth rate matters enormously |
| Series D+ | $1B–$10B+ | 8-20x | Approaching public market multiples |
| Pre-IPO | $5B–$30B+ | 8-15x | Multiple compression as scale increases |

**Key trend (2024-2026):** AI/GenAI companies command premium multiples (15-40x ARR). Non-AI SaaS has compressed to 8-15x.

## Exit Multiples by Sector

Use these for the Base case exit scenario modeling.

| Sector | Median M&A Multiple (Revenue) | Median IPO Multiple (Revenue) | Recent Notable Exits |
|--------|-------------------------------|-------------------------------|---------------------|
| Enterprise AI / AI Agents | 15-25x | 20-35x | — (sector too new, few exits yet) |
| Developer Tools | 10-20x | 15-30x | GitHub ($7.5B/MSFT), Figma ($20B/Adobe, failed), HashiCorp ($6.4B/IBM) |
| FinTech | 5-15x | 8-20x | Plaid (~$13B), Marqeta IPO ($16B peak), Bill.com IPO |
| HealthTech | 5-12x | 8-15x | Veracyte ($1.8B), Signify Health ($8B/CVS), One Medical ($3.9B/AMZN) |
| Cybersecurity | 10-20x | 15-30x | Wiz ($32B/Google), SentinelOne IPO, CrowdStrike |
| B2B SaaS (general) | 8-15x | 10-20x | Qualtrics ($8B/Silver Lake), Zendesk ($10.2B PE) |
| Vertical SaaS | 8-15x | 10-18x | Procore IPO ($12B), Toast IPO ($20B peak) |
| Consumer AI | 5-15x | 10-25x | (limited data — emerging sector) |
| E-commerce / Marketplaces | 3-8x | 5-12x | Instacart IPO ($10B), Faire, Etsy |

## Exit Outcome Distribution

For all VC-backed startups, the distribution of outcomes is highly skewed:

| Outcome | Probability | What Happens to Common Stock |
|---------|-------------|------------------------------|
| Company fails / acqui-hire | ~50-60% | Common stock = $0 |
| Modest exit (1-3x invested) | ~20-25% | Common stock = $0 to small amount (preferences eat it) |
| Good exit (3-10x invested) | ~10-15% | Common stock = meaningful but not life-changing |
| Great exit (10x+ invested) | ~5-8% | Common stock = substantial, potentially life-changing |
| Massive exit (50x+ / IPO) | ~1-3% | Common stock = major wealth creation |

The later the stage you join, the higher the probability of at least a modest exit, but the lower your ownership percentage.

## IPO Readiness Signals

When assessing time-to-liquidity, look for:
- **CFO hired from public company background** — strongest signal (12-24 months to IPO)
- **Auditor upgraded to Big 4** — typically 18-24 months pre-IPO
- **SOX compliance work** — 12-18 months pre-IPO
- **Revenue > $200M ARR** — general threshold for SaaS IPO
- **Growth rate > 30% YoY** — minimum for a good IPO reception
- **Path to profitability visible** — post-2022, markets want this
- **Dual-class share structure implemented** — founder IPO prep

## Using These Benchmarks

For Agent 5's exit scenario modeling:
1. Identify the company's sector from the table above
2. Use the median M&A multiple for Bear/Base cases
3. Use the median IPO multiple for Bull case
4. Apply the company's estimated ARR × multiple = exit valuation
5. Then apply dilution and preference math from `dilution-guide.md`
