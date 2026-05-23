import { type AuditFormData,type ToolName } from '../types';
import { PRICING_REFERENCE } from './pricingData';

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

  // Track tool selections to identify redundant tool overlaps
  const hasCursor = formData.tools['Cursor']?.selected;
  const hasCopilot = formData.tools['GitHub Copilot']?.selected;

  (Object.keys(formData.tools) as ToolName[]).map((toolName) => {
    const userTool = formData.tools[toolName];
    if (!userTool || !userTool.selected) return;

    const currentSpend = userTool.monthlySpend;
    totalCurrentMonthlySpend += currentSpend;

    let recommendedSpend = currentSpend;
    let recommendedPlan = userTool.plan;
    let reason = 'Your current tier configuration is financially optimized for your footprint.';

    // Rule 1: Eliminate Redundant Overlaps (Cursor vs. GitHub Copilot code-assist duplication)
    if (toolName === 'GitHub Copilot' && hasCursor && hasCopilot) {
      recommendedSpend = 0;
      recommendedPlan = 'Ecosystem Consolidate (Drop Copilot)';
      reason = 'Redundant code-assistant layer detected. Your active Cursor subscription fully covers your inline workspace autocompletion needs.';
    } 
    
    // Rule 2: Evaluate Seat Minimum Over-provisioning (e.g., Claude Team seat minimum errors)
    else if (toolName === 'Claude' && userTool.plan.toLowerCase().includes('team')) {
      if (userTool.seats < 5) {
        // Drop down to Pro tier pricing for their actual active seats
        recommendedPlan = 'Pro';
        recommendedSpend = userTool.seats * 20;
        reason = `Claude Team plan mandates a 5-seat minimum bill. Consolidating your ${userTool.seats} active seats onto Pro tiers eliminates empty-seat premiums.`;
      }
    }

    // Rule 3: General Retail Standard Cost Alignment Check
    else {
      const tiers = PRICING_REFERENCE[toolName as keyof typeof PRICING_REFERENCE];
      if (tiers) {
        // Look for an exact match or standard benchmark
        const matchedTier = tiers.find(t => t.name.toLowerCase() === userTool.plan.toLowerCase());
        if (matchedTier) {
          const expectedCost = matchedTier.costPerSeat * userTool.seats;
          // If they are overpaying retail baselines mysteriously, flag it
          if (currentSpend > expectedCost) {
            recommendedSpend = expectedCost;
            reason = `Identified standard retail billing drift. Aligning seats to standard ${matchedTier.name} pricing structures benchmarks your baseline spend perfectly.`;
          }
        }
      }
    }

    const savings = Math.max(0, currentSpend - recommendedSpend);
    totalRecommendedMonthlySpend += recommendedSpend;

    toolBreakdowns.push({
      toolName,
      currentSpend,
      recommendedSpend,
      recommendedPlan,
      savings,
      reason
    });
  });

  const totalMonthlySavings = Math.max(0, totalCurrentMonthlySpend - totalRecommendedMonthlySpend);
  const totalAnnualSavings = totalMonthlySavings * 12;
  
  // High savings threshold sets up lead generation hook for Credex credits
  const requiresCredexConsultation = totalMonthlySavings >= 500; 
  const isOptimal = totalMonthlySavings < 100;

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