import React, { useEffect, useState } from 'react';
import { type FullAuditReport } from '../utils/auditEngine';
import { saveLeadToBackend } from '../utils/databaseService';
import { generateAuditSummary } from '../utils/aiService';
import { formatCurrency } from '../utils/currencyFormatter';

interface AuditResultsProps {
  report: FullAuditReport;
  currency: 'USD' | 'INR';
  onReset: () => void;
}

export default function AuditResults({ report, currency, onReset }: AuditResultsProps) {
  const {
    totalCurrentMonthlySpend,
    totalRecommendedMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    toolBreakdowns,
    requiresCredexConsultation
  } = report;

  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [aiSummary, setAiSummary] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingAI(true);
    
    generateAuditSummary(report, currency)
      .then((summary) => {
        if (isMounted) {
          setAiSummary(summary);
          setIsLoadingAI(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingAI(false);
      });

    return () => { isMounted = false; };
  }, [report, currency]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (honeypot) {
      setSubmitStatus('success');
      return;
    }

    setIsSubmitting(true);
    const result = await saveLeadToBackend({
      email,
      companyName,
      role,
      teamSize: 1, 
      calculatedMonthlySavings: totalMonthlySavings,
      calculatedAnnualSavings: totalAnnualSavings
    });
    setIsSubmitting(false);
    setSubmitStatus(result.success ? 'success' : 'error');
  };

  const optimizationPercentage = totalCurrentMonthlySpend > 0 
    ? Math.min(100, Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)) 
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-6 sm:p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl box-border animate-fadeIn">
      
      {/* Premium Header */}
      <header className="flex flex-col items-center text-center mb-8 pb-6 border-b border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm">
          Audit Analytics Complete
        </span>
        <h1 className="text-3xl font-extrabold mt-3 tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Your Optimization Intelligence
        </h1>
      </header>

      {/* Bento Grid Layout Wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Card 1: Monthly Scoreboard */}
        <div className="p-5 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700/60 transition-all group">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Target Savings</span>
          <div className="my-4">
            <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {formatCurrency(totalMonthlySavings, currency)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 border-t border-slate-900 pt-2 block">
            {formatCurrency(totalCurrentMonthlySpend, currency)} → {formatCurrency(totalRecommendedMonthlySpend, currency)}
          </span>
        </div>

        {/* Card 2: Annual Runway Scoreboard */}
        <div className="p-5 bg-gradient-to-br from-slate-950 to-slate-900/60 border border-emerald-500/10 rounded-xl flex flex-col justify-between shadow-md shadow-emerald-950/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Projected Annual Runway Saved</span>
          <div className="my-4">
            <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-300 bg-clip-text text-transparent font-mono tracking-tight">
              {formatCurrency(totalAnnualSavings, currency)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-500/60 font-semibold uppercase tracking-wider flex items-center gap-1">
            ⚡ Retained Infrastructure Capital
          </span>
        </div>

        {/* Card 3: Capital Efficiency Visual Progress Tracker */}
        <div className="p-5 bg-slate-950/50 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Efficiency Index</span>
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
              {optimizationPercentage}% Optimized
            </span>
          </div>
          <div className="my-2 bg-slate-800 h-2.5 w-full rounded-full overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${optimizationPercentage}%` }}
            ></div>
          </div>
          <span className="text-[11px] text-slate-500 pt-2 block leading-relaxed">
            Visualizing structural asset optimization performance.
          </span>
        </div>
      </div>

      {/* Row 2: AI Autonomous Assessment Brief Container */}
      <div className="p-5 bg-slate-950/30 border border-slate-800/60 rounded-xl mb-6 shadow-inner">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Autonomous Executive Brief
        </h3>
        {isLoadingAI ? (
          <div className="space-y-2 animate-pulse py-1">
            <div className="h-3 bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-800 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">{aiSummary}</p>
        )}
      </div>

      {/* Row 3: Granular Infrastructure Line Item Cards Breakdown */}
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 pl-0.5">
        Granular Allocations Breakdown
      </h3>
      <div className="space-y-3 mb-8">
        {toolBreakdowns.map((item) => (
          <div 
            key={item.toolName} 
            className="p-4 bg-slate-950/50 border border-slate-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-800/90 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200 text-sm">{item.toolName}</span>
                <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded shadow-sm">
                  Target: {item.recommendedPlan}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{item.reason}</p>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/40 pt-2 sm:pt-0 gap-4 min-w-[140px] text-right">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider sm:hidden">Impact</span>
              <div className="flex flex-col items-end">
                {item.savings > 0 ? (
                  <>
                    <span className="text-slate-500 line-through text-[11px] font-mono">
                      {formatCurrency(item.currentSpend, currency)}
                    </span>
                    <span className="text-emerald-400 font-bold text-xs font-mono mt-0.5">
                      Save {formatCurrency(item.savings, currency)}/mo
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 text-xs font-semibold bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/40 shadow-sm">
                    Optimal
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Row 4: Lead Capture Panel Card */}
      <section className="p-6 bg-gradient-to-r from-slate-950 via-slate-950 to-slate-900 border border-slate-800 rounded-xl mb-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-200">
          {requiresCredexConsultation ? '🚀 Unlock Wholesale Private Placement Credits' : '✨ Monitor ongoing Footprint Analytics'}
        </h3>
        <p className="text-slate-400 text-xs mt-1 mb-4">
          {requiresCredexConsultation 
            ? 'Your waste scale qualifies for enterprise contract placement support pipelines.' 
            : 'Commit this baseline layout state parameters to track ongoing vendor price changes.'}
        </p>

        {submitStatus === 'success' ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs sm:text-sm font-medium text-center">
            ✓ Parameters locked successfully. Our financial engineering line items team will review your report shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                type="email" required placeholder="Corporate Email (Required)" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
              />
              <input 
                type="text" placeholder="Company Name (Optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
              />
              <input 
                type="text" placeholder="Professional Role (Optional)" value={role} onChange={(e) => setRole(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
              />
            </div>

            <div className="text-right">
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full sm:w-auto bg-slate-100 hover:bg-white text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer uppercase tracking-wider"
              >
                {isSubmitting ? 'Securing...' : requiresCredexConsultation ? 'Book Strategic Consultation' : 'Save & Track Blueprint'}
              </button>
            </div>
            {submitStatus === 'error' && (
              <p className="text-xs text-red-400 mt-2 font-medium">An error occurred connecting to secure parameters storage pipeline lines. Please try again.</p>
            )}
          </form>
        )}
      </section>

      {/* Navigation Footer Reset Trigger Controls */}
      <div className="flex justify-start pt-4 border-t border-slate-800/60">
        <button 
          onClick={onReset} 
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
        >
          ← Adjust Input Parameters & Recalculate
        </button>
      </div>
    </div>
  );
}