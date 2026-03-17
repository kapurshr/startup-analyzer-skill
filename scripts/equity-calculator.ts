/**
 * Startup Equity Calculator
 * Standalone dilution and exit scenario modeling tool.
 * Run with: bun run scripts/equity-calculator.ts
 */

interface OfferDetails {
  ownershipPercent: number;
  currentValuation: number; // in dollars
  baseSalary: number;
  bonus?: number;
  vestingYears: number;
}

interface FundingRound {
  name: string;
  dilutionPercent: number;
}

interface ExitScenario {
  name: string;
  valuationMultiple: number;
  exitValuation: number;
  ownershipAtExit: number;
  preTaxPayout: number;
}

interface LiquidationPreference {
  totalInvested: number;
  multiple: number; // e.g., 1.0 for 1x
  participating: boolean;
}

// Default future dilution assumptions
const DEFAULT_FUTURE_ROUNDS: FundingRound[] = [
  { name: "Next Round", dilutionPercent: 0.15 },
  { name: "Pre-IPO / Exit", dilutionPercent: 0.08 },
];

function calculateDilution(
  initialOwnership: number,
  rounds: FundingRound[]
): { finalOwnership: number; totalDilution: number; breakdown: { round: string; ownership: number }[] } {
  let ownership = initialOwnership;
  const breakdown: { round: string; ownership: number }[] = [
    { round: "Starting", ownership },
  ];

  for (const round of rounds) {
    ownership = ownership * (1 - round.dilutionPercent);
    breakdown.push({ round: round.name, ownership });
  }

  return {
    finalOwnership: ownership,
    totalDilution: 1 - ownership / initialOwnership,
    breakdown,
  };
}

function calculateExitScenarios(
  ownershipAtExit: number,
  currentValuation: number,
  preference?: LiquidationPreference
): ExitScenario[] {
  const multipliers = [
    { name: "Bear (0.5x)", multiple: 0.5 },
    { name: "Base (3x)", multiple: 3 },
    { name: "Bull (7x)", multiple: 7 },
  ];

  return multipliers.map(({ name, multiple }) => {
    const exitValuation = currentValuation * multiple;
    let payout = exitValuation * (ownershipAtExit / 100);

    // Apply liquidation preferences if provided
    if (preference) {
      const preferenceAmount = preference.totalInvested * preference.multiple;

      if (preference.participating) {
        // Participating: investors get preference + pro-rata of remainder
        const remainder = exitValuation - preferenceAmount;
        if (remainder > 0) {
          // Common holders share the remainder (simplified)
          payout = remainder * (ownershipAtExit / 100);
        } else {
          payout = 0;
        }
      } else {
        // Non-participating: investors choose preference OR conversion
        if (exitValuation <= preferenceAmount) {
          // Investors take everything
          payout = 0;
        }
        // Otherwise investors convert, everyone shares pro-rata (default calc)
      }
    }

    return {
      name,
      valuationMultiple: multiple,
      exitValuation,
      ownershipAtExit,
      preTaxPayout: Math.max(0, payout),
    };
  });
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

function runAnalysis(offer: OfferDetails, preference?: LiquidationPreference) {
  console.log("═══════════════════════════════════════════════");
  console.log("  EQUITY ANALYSIS");
  console.log("═══════════════════════════════════════════════\n");

  // Offer breakdown
  const equityValueAtCurrent = (offer.ownershipPercent / 100) * offer.currentValuation;
  const annualComp = offer.baseSalary + (offer.bonus ?? 0) + equityValueAtCurrent / offer.vestingYears;
  const fourYearComp = offer.baseSalary * 4 + (offer.bonus ?? 0) * 4 + equityValueAtCurrent;

  console.log("📋 Offer Breakdown:");
  console.log(`  Ownership:        ${offer.ownershipPercent}%`);
  console.log(`  Current Valuation: ${formatCurrency(offer.currentValuation)}`);
  console.log(`  Equity Value:      ${formatCurrency(equityValueAtCurrent)} (at current valuation)`);
  console.log(`  Annual Total Comp: ~${formatCurrency(annualComp)}`);
  console.log(`  4-Year Total Comp: ~${formatCurrency(fourYearComp)}\n`);

  // Dilution model
  const dilution = calculateDilution(offer.ownershipPercent, DEFAULT_FUTURE_ROUNDS);

  console.log("📉 Dilution Model:");
  for (const step of dilution.breakdown) {
    console.log(`  ${step.round.padEnd(20)} ${step.ownership.toFixed(4)}%`);
  }
  console.log(`  Total Dilution:    ${(dilution.totalDilution * 100).toFixed(1)}%\n`);

  // Exit scenarios
  const scenarios = calculateExitScenarios(
    dilution.finalOwnership,
    offer.currentValuation,
    preference
  );

  console.log("🎯 Exit Scenarios (post-dilution):");
  console.log("  Scenario          Exit Val        Your Payout");
  console.log("  ─────────────────────────────────────────────");
  for (const s of scenarios) {
    console.log(
      `  ${s.name.padEnd(20)} ${formatCurrency(s.exitValuation).padEnd(16)} ${formatCurrency(s.preTaxPayout)}`
    );
  }

  console.log("\n═══════════════════════════════════════════════\n");
}

// Example usage — replace with your actual offer details
const sampleOffer: OfferDetails = {
  ownershipPercent: 0.05,
  currentValuation: 2_000_000_000, // $2B
  baseSalary: 200_000,
  bonus: 20_000,
  vestingYears: 4,
};

const samplePreference: LiquidationPreference = {
  totalInvested: 500_000_000, // $500M total raised
  multiple: 1.0,
  participating: false,
};

runAnalysis(sampleOffer, samplePreference);
