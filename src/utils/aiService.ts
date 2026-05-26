import { type FullAuditReport } from './auditEngine';

// FIX: Add the optional currency parameter to the function definition here
export async function generateAuditSummary(report: FullAuditReport, currency: 'USD' | 'INR' = 'USD'): Promise<string> {
  // Simulate network flight latency for an external LLM endpoint call
  await new Promise((resolve) => setTimeout(resolve, 600));

  const symbol = currency === 'INR' ? '₹' : '$';

  // Scenario 1: The stack is completely optimal
  if (report.totalMonthlySavings <= 0) {
    return `Your infrastructure configuration displays excellent operational efficiency. Every evaluated software license matches standard retail baselines precisely, with zero tool redundancy or seat minimum waste. We recommend locking this baseline profile to monitor for future vendor pricing shifts. Your active stack is fully optimized for your current team footprint.`;
  }

  // Find the tool that is leaking the absolute most amount of cash
  const leakingTools = report.toolBreakdowns.filter(t => t.savings > 0);
  const topLeak = leakingTools.reduce((max, item) => item.savings > max.savings ? item : max, leakingTools[0]);
  
  const formattedSavings = report.totalMonthlySavings.toLocaleString();
  const formattedAnnual = report.totalAnnualSavings.toLocaleString();
  const formattedTopLeakSavings = topLeak.savings.toLocaleString();

  // Scenario 2: Multiple tools are leaking money
  if (leakingTools.length > 1) {
    return `Your infrastructure analysis reveals significant cost optimization vectors across multiple software layers, leaking a total of ${symbol}${formattedSavings} monthly. The primary driver of this waste is your ${topLeak.toolName} configuration, which is leaking ${symbol}${formattedTopLeakSavings}/mo due to structural tier mismatches or tool overlaps. Consolidating these profiles will immediately recover ${symbol}${formattedAnnual} in annual operational runway.`;
  }

  // Scenario 3: Single tool leak
  return `Your infrastructure analysis has isolated a single operational inefficiency vector within your ${topLeak.toolName} allocation. This single friction point is costing your team an extra ${symbol}${formattedSavings} monthly compared to standard retail baseline benchmarks. Moving this tool to the recommended plan tier will scale your annual runway retention by ${symbol}${formattedAnnual} with zero impact on developer output.`;
}