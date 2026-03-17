# Dilution & Equity Guide

Reference for Agent 5 (Equity Deep-Dive) and the main thread when scoring Equity & Liquidity.

## Standard Dilution Per Round

These are typical dilution percentages for existing shareholders at each round. Use these as defaults when modeling future dilution.

| Round | Typical Dilution | New Shares Issued (% of post-money) |
|-------|-----------------|-------------------------------------|
| Seed | 15–25% | 20% typical |
| Series A | 20–30% | 25% typical |
| Series B | 15–25% | 20% typical |
| Series C | 10–20% | 15% typical |
| Series D+ | 10–15% | 12% typical |
| Pre-IPO | 5–10% | 8% typical |

**Employee option pool** typically gets expanded at each round, adding another 5-10% dilution that existing shareholders absorb.

## Common vs Preferred Stock

Employees receive **common stock** (options or RSUs). Investors receive **preferred stock** with additional rights.

Key differences:
- **Liquidation preferences**: Preferred gets paid first in an exit
- **Anti-dilution protection**: Preferred may get extra shares in a down-round
- **Participation rights**: Some preferred can "double dip" — get their preference AND participate pro-rata
- **Conversion**: Preferred converts to common at IPO (typically 1:1)

**What this means for employees:**
- In a modest exit (1-2x invested capital), preferred shareholders may take most/all the proceeds
- In a strong exit (5x+), liquidation preferences become less relevant as everyone converts to common
- The more funding rounds with participation rights, the worse it is for common stockholders

## Liquidation Preference Structures

| Type | How It Works | Employee Impact |
|------|-------------|-----------------|
| 1x Non-participating | Investors get their money back OR convert to common (whichever is higher) | Best case for employees — standard and fair |
| 1x Participating | Investors get their money back AND share in remaining proceeds pro-rata | Worse for employees — investors "double dip" |
| 2x+ Non-participating | Investors get 2x+ their money back OR convert | Bad — investors need 2x+ before common sees anything |
| 2x+ Participating | Investors get 2x+ AND participate | Worst case — heavy preference stack |

## Option Pool Math

When a user says "I have 0.05% equity":
- This is typically on a **fully diluted basis** (all shares + all options + all warrants)
- Confirm whether it's: (a) % of current fully diluted, (b) % of post-money after their round, or (c) number of shares / total shares
- If they give a share count, they need total shares outstanding to calculate %

**409A Valuation vs Preferred Price:**
- 409A (common stock fair market value) is typically 25-40% of preferred price at early stage
- At later stages (Series C+), the gap narrows to 10-25%
- This means the "strike price" on options is much lower than the price investors paid
- Spread = built-in upside if the company does well

## Dilution Modeling Formula

To estimate ownership after future rounds:

```
Future Ownership = Current Ownership × (1 - dilution_round_1) × (1 - dilution_round_2) × ...
```

**Example:**
- Current: 0.05% ownership
- Series D (15% dilution): 0.05% × 0.85 = 0.0425%
- Pre-IPO (8% dilution): 0.0425% × 0.92 = 0.0391%
- Final estimated ownership at IPO: ~0.039%

## Exit Payout Calculation

```
Your Payout = (Exit Valuation × Your Ownership %) - (Liquidation Preferences Impact)
```

For a simple 1x non-participating preference:
- If exit > total invested capital: preferences convert, everyone shares pro-rata → Your Payout = Exit Valuation × Your Ownership %
- If exit < total invested capital: preferred takes everything → Your Payout = $0

For participating preferred, the math is more complex — preferred takes their preference PLUS their pro-rata share of the remainder.

## Time-to-Liquidity Benchmarks

| Company Stage | Typical Time to IPO/Exit |
|---------------|--------------------------|
| Series A | 5-8 years |
| Series B | 4-6 years |
| Series C | 3-5 years |
| Series D+ | 1-3 years |
| Pre-IPO | 6-18 months |

These are rough medians. Many companies never reach liquidity. The probability of a successful exit decreases significantly for companies that remain private beyond 10 years from founding.
