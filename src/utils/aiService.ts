import { type FullAuditReport } from './auditEngine';

export async function generateAuditSummary(report: FullAuditReport): Promise<string> {
  // Simulate network flight latency for an external LLM endpoint call
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (report.totalMonthlySavings === 0) {
    return `Your infrastructure configuration displays pristine operational efficiency. Every evaluated license matches standard retail baselines precisely, with zero tool redundancy or seat minimum waste. We recommend locking this baseline profile to monitor for future vendor pricing shifts. Your current stack is fully optimized for your active team footprint.`;
  }

  const topLeak = report.toolBreakdowns.reduce((max, item) => item.savings > max.savings ? item : max, report.toolBreakdowns[0]);
  
  return `Your infrastructure analysis reveals significant cost optimization vectors, leaking $${report.totalMonthlySavings.toLocaleString()} monthly. The primary driver is your ${topLeak.toolName} allocation, which represents unnecessary spend. Consolidating overlapping workspaces and adjusting underutilized seat licenses will recover $${report.totalAnnualSavings.toLocaleString()} in annual operational runway instantly. Action is highly recommended to align your profile to wholesale efficiency targets.`;
}