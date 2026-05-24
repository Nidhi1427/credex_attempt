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
    isOptimal,
    requiresCredexConsultation
  } = report;

  // React local view state tracking
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
    
    generateAuditSummary(report)
      .then((summary) => {
        if (isMounted) {
          setAiSummary(summary);
          setIsLoadingAI(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingAI(false);
      });

    return () => {
      isMounted = false;
    };
  }, [report]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (honeypot) {
      console.warn('Bot submission attempt intercepted via hidden honeypot filter field.');
      setSubmitStatus('success');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const result = await saveLeadToBackend({
      email,
      companyName,
      role,
      teamSize: 1, 
      calculatedMonthlySavings: totalMonthlySavings,
      calculatedAnnualSavings: totalAnnualSavings
    });

    setIsSubmitting(false);
    if (result.success) {
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
  };

  // Calculate optimization ratio safely to prevent NaN bugs if current spend is 0
  const optimizationPercentage = totalCurrentMonthlySpend > 0 
    ? Math.min(100, Math.round((totalMonthlySavings / totalCurrentMonthlySpend) * 100)) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto my-10 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-slate-100 shadow-2xl animate-fadeIn">
      {/* Hero Header */}
      <header className="text-center mb-10 border-b border-slate-800 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          Audit Analysis Complete
        </span>
        <h1 className="text-4xl font-extrabold mt-4 tracking-tight">Your AI Spend Report</h1>
        <p className="text-slate-400 mt-2">Here is a breakdown of your optimization vectors.</p>
      </header>

      {/* Scoreboard Panels - Formatted Dynamically */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Monthly Savings</p>
          <p className="text-5xl font-black text-emerald-400">
            {formatCurrency(totalMonthlySavings, currency)}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Current: {formatCurrency(totalCurrentMonthlySpend, currency)}/mo → Rec: {formatCurrency(totalRecommendedMonthlySpend, currency)}/mo
          </p>
        </div>
        <div className="p-6 bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/20 rounded-xl text-center shadow-lg shadow-emerald-500/2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Total Annual Savings</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            {formatCurrency(totalAnnualSavings, currency)}
          </p>
          <p className="text-xs text-emerald-500/80 mt-2 font-medium">Retained runway</p>
        </div>
      </section>

      {/* NEW: Capital Efficiency Visual Runway Tracker Bar */}
      <section className="p-6 bg-slate-950/60 border border-slate-800 rounded-xl mb-10">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Capital Efficiency Target</h3>
            <p className="text-xs text-slate-400 mt-0.5">Visualizing structural waste recovered for your operational runway.</p>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md">
            {optimizationPercentage}% Optimized
          </span>
        </div>

        {/* Outer Track */}
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden relative">
          {/* Inner Fill Layer with CSS Transition Transition Animation Hook */}
          <div 
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-emerald-500/20"
            style={{ width: `${optimizationPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mt-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          <span>Baseline Spend ({formatCurrency(totalCurrentMonthlySpend, currency)})</span>
          <span>Optimized Target ({formatCurrency(totalRecommendedMonthlySpend, currency)})</span>
        </div>
      </section>

      {/* Autonomous AI Executive Summary Box */}
      <section className="p-6 bg-slate-950/40 border border-slate-800/80 rounded-xl mb-10">
        <div className="flex items-center space-x-2.5 mb-3">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLoadingAI ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLoadingAI ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isLoadingAI ? 'AI Engine Synthesizing Executive Brief...' : 'Autonomous Executive Summary'}
          </h3>
        </div>

        {isLoadingAI ? (
          <div className="space-y-2.5 animate-pulse py-1">
            <div className="h-3.5 bg-slate-800 rounded w-full"></div>
            <div className="h-3.5 bg-slate-800 rounded w-5/6"></div>
            <div className="h-3.5 bg-slate-800 rounded w-2/3"></div>
          </div>
        ) : (
          <p className="text-slate-300 text-sm leading-relaxed font-normal animate-fadeIn">
            {aiSummary}
          </p>
        )}
      </section>

      {/* Lead Capture Controls */}
      <section className="p-6 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl mb-10">
        <h3 className="text-lg font-bold text-slate-200">
          {requiresCredexConsultation ? '🚀 Connect with a Credex Expert to Capture Savings' : '✨ Monitor Your Infrastructure Stack'}
        </h3>
        <p className="text-slate-400 text-xs mt-1 mb-4">
          {requiresCredexConsultation 
            ? 'Your enterprise footprint qualifies for wholesale private placement credit allocations.' 
            : 'Lock in your baseline configuration profile to map ongoing pricing drop alerts.'}
        </p>

        {submitStatus === 'success' ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium text-center">
            ✓ Report compiled successfully. Our optimization team will review your infrastructure parameters.
          </div>
        ) : (
          <form onSubmit={handleSubmitLead} className="space-y-4">
            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="email" required placeholder="Corporate Email (Required)" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
              <input 
                type="text" placeholder="Company Name (Optional)" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
              <input 
                type="text" placeholder="Your Professional Role (Optional)" value={role} onChange={(e) => setRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white"
              />
            </div>

            <div className="text-right">
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full sm:w-auto bg-slate-100 hover:bg-white text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Saving...' : requiresCredexConsultation ? 'Book Credex Consultation' : 'Save & Monitor Stack'}
              </button>
            </div>
            {submitStatus === 'error' && (
              <p className="text-xs text-red-400 mt-2">An error occurred connecting to our secure storage lines. Please retry.</p>
            )}
          </form>
        )}
      </section>

      {/* Granular Breakdown Row Map - Formatted Dynamically */}
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
                    <span className="text-slate-400 line-through text-xs mr-2">
                      {formatCurrency(item.currentSpend, currency)}
                    </span>
                    <span className="text-emerald-400 font-bold text-sm">
                      Save {formatCurrency(item.savings, currency)}/mo
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400 text-sm font-medium">
                    Optimal ({formatCurrency(item.currentSpend, currency)}/mo)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
        <button onClick={onReset} className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
          ← Adjust Inputs & Recalculate
        </button>
      </div>
    </div>
  );
}