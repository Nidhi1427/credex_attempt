import React from 'react';
import { type FullAuditReport } from '../utils/auditEngine';

interface AuditResultsProps {
  report: FullAuditReport;
  onReset: () => void;
}

export default function AuditResults({ report, onReset }: AuditResultsProps) {
  const {
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdowns,
    isOptimal,
    requiresCredexConsultation
  } = report;

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl animate-fadeIn">
      {/* Hero Header Section */}
      <header className="text-center mb-10 border-b border-slate-800 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          Audit Analysis Complete
        </span>
        <h1 className="text-4xl font-extrabold mt-4 tracking-tight">Your AI Spend Report</h1>
        <p className="text-slate-400 mt-2">Here is a breakdown of your optimization vectors.</p>
      </header>

      {/* Hero Savings Scoreboard */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Monthly Savings</p>
          <p className="text-5xl font-black text-emerald-400">${totalMonthlySavings.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Current: ${totalCurrentMonthlySpend}/mo → Rec: ${totalRecommendedMonthlySpend}/mo</p>
        </div>
        <div className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/20 rounded-xl text-center shadow-lg shadow-emerald-500/2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Annual Savings</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            ${totalAnnualSavings.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-500/80 mt-2 font-medium">Retained operational runway</p>
        </div>
      </section>

      {/* Dynamic Lead Gen CTA States based on Rubric rules */}
      {requiresCredexConsultation && (
        <section className="p-6 bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/30 rounded-xl mb-10 shadow-xl">
          <h3 className="text-lg font-bold text-emerald-300">🚀 Massive Optimization Runway Detected</h3>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Your team is dropping over <strong>$500/month</strong> on standard retail software premiums. Credex sources pre-allocated, institutional-grade AI infrastructure credits directly from companies that overforecasted their capacity, letting you capture up to 30% deep residual savings on these identical seats.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter corporate email to claim credits" 
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 flex-1"
            />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-sm transition-colors shadow-md">
              Book Credex Consultation
            </button>
          </div>
        </section>
      )}

      {isOptimal && (
        <section className="p-5 bg-slate-950/50 border border-slate-800 rounded-xl mb-10 text-center">
          <h3 className="text-md font-bold text-slate-300">✨ Standard Operational Efficiency Met</h3>
          <p className="text-slate-400 text-sm mt-1">
            "You're spending well." Your current subscription profile tracks cleanly to structural baselines. No artificial savings padding applied.
          </p>
          <div className="mt-4 max-w-md mx-auto flex gap-2">
            <input 
              type="email" 
              placeholder="Notify me when optimization thresholds change" 
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-emerald-500 flex-1"
            />
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-1.5 rounded-lg text-xs transition-colors">
              Monitor Stack
            </button>
          </div>
        </section>
      )}

      {/* Per-Tool Audit Item Breakdowns */}
      <h3 className="text-lg font-bold text-slate-300 mb-4">Granular Line-Item Breakdown</h3>
      <div className="space-y-3 mb-8">
        {toolBreakdowns.map((item) => (
          <div key={item.toolName} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="max-w-xl">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-slate-200">{item.toolName}</span>
                <span className="text-xs text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                  Target: {item.recommendedPlan}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.reason}</p>
            </div>
            
            <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
              <span className="text-xs text-slate-500 sm:hidden">Calculated Savings</span>
              <div>
                {item.savings > 0 ? (
                  <>
                    <span className="text-slate-400 line-through text-xs mr-2">${item.currentSpend}</span>
                    <span className="text-emerald-400 font-bold text-sm">Save ${item.savings}/mo</span>
                  </>
                ) : (
                  <span className="text-slate-400 text-sm font-medium">Optimal (${item.currentSpend}/mo)</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Control Action */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
        <button 
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          ← Adjust Inputs & Recalculate
        </button>
        <button className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg transition-colors">
          Share Public Link 🔗
        </button>
      </div>
    </div>
  );
}