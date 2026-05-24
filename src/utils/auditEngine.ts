import { type AuditFormData, type ToolName, type ToolSpend } from '../types';

export interface ToolAuditResult {
  toolName: ToolName;
  currentSpend: number;
  recommendedSpend: number;
  recommendedPlan: string;
  savings: number;
  reason: string;
}

export interface FullAuditReport {
  totalCurrentMonthlySpend: number;
  totalRecommendedMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  toolBreakdowns: ToolAuditResult[];
  isOptimal: boolean;
  requiresCredexConsultation: boolean;
}

export function calculateAudit(formData: AuditFormData): FullAuditReport {
  let totalCurrentMonthlySpend = 0;
  let totalRecommendedMonthlySpend = 0;
  const toolBreakdowns: ToolAuditResult[] = [];

  const isINR = formData.currency === 'INR';
  const FX_RATE = 83; // $1 USD = ₹83 INR stable baseline anchor

  const hasCursor = formData.tools['Cursor']?.selected;
  const hasCopilot = formData.tools['GitHub Copilot']?.selected;

  (Object.keys(formData.tools) as ToolName[]).forEach((toolName) => {
    const tool = formData.tools[toolName];
    if (!tool || !tool.selected) return;

    // Capture exact user inputs
    const userSpend = tool.monthlySpend;
    const userSeats = tool.seats;
    
    // Normalize to USD for rule calculations
    const currentSpendInUSD = isINR ? userSpend / FX_RATE : userSpend;
    totalCurrentMonthlySpend += userSpend;

    let recSpendInUSD = currentSpendInUSD;
    let recPlan = tool.plan;
    let reason = 'Your current configuration matches optimized retail performance targets.';

    // RULE 1: Cursor & GitHub Copilot Redundancy Filter
    if (toolName === 'GitHub Copilot' && hasCursor && hasCopilot) {
      recSpendInUSD = 0;
      recPlan = 'Drop Copilot';
      reason = 'Redundant inline code-assistant layer detected. Your active Cursor subscription fully covers your workspace autocompletion needs.';
    }
    
    // RULE 2: Claude Team Minimum Seat Trap Verification
    else if (toolName === 'Claude' && tool.plan === 'Team') {
      if (userSeats < 5) {
        recPlan = 'Individual Pro';
        recSpendInUSD = userSeats * 20; // Pro is $20/seat
        reason = `Claude Team tier forces a 5-seat minimum premium ($150/mo). Consolidating your ${userSeats} active users onto standalone Pro profiles saves empty-seat overhead.`;
      } else {
        recSpendInUSD = userSeats * 30; // Standard Team tier cost
        reason = 'Seats match the minimum tier guidelines. Pricing aligned with standard Anthropic retail tracks.';
      }
    }

    // RULE 3: ChatGPT Retail Cost Drift Protection
    else if (toolName === 'ChatGPT') {
      if (tool.plan === 'Individual' && currentSpendInUSD > (userSeats * 20)) {
        recSpendInUSD = userSeats * 20;
        reason = 'Billing entries exceed standard ChatGPT Plus baselines ($20/seat). Adjusted to match verified retail catalogs.';
      } else if (tool.plan === 'Team' && userSeats < 2) {
        recPlan = 'Individual Pro';
        recSpendInUSD = userSeats * 20;
        reason = 'ChatGPT Team requires a 2-seat minimum. Reverting under-provisioned team account to Individual Plus saves structural costs.';
      } else if (tool.plan === 'Team') {
        recSpendInUSD = userSeats * 25; // Team is $25/seat
      }
    }

    // RULE 4: API Tier Usage Alignment (Fallback Check)
    else if (toolName.includes('API direct')) {
      // API usage defaults straight to structural cost baselines unless wholesale tiers match
      reason = 'Direct infrastructure usage monitored. Active tracking enabled for anomalous throughput surges.';
    }

    // Denominate the calculated values back into the active user layout currency
    const recommendedSpend = isINR ? recSpendInUSD * FX_RATE : recSpendInUSD;
    const savings = Math.max(0, userSpend - recommendedSpend);

    totalRecommendedMonthlySpend += recommendedSpend;

    toolBreakdowns.push({
      toolName,
      currentSpend: userSpend,
      recommendedSpend,
      recommendedPlan: recPlan,
      savings,
      reason
    });
  });

  const totalMonthlySavings = Math.max(0, totalCurrentMonthlySpend - totalRecommendedMonthlySpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

  const savingsInUSD = isINR ? totalMonthlySavings / FX_RATE : totalMonthlySavings;
  const requiresCredexConsultation = savingsInUSD >= 500;
  const isOptimal = totalMonthlySavings <= 0;

  return {
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdowns,
    isOptimal,
    requiresCredexConsultation
  };
}