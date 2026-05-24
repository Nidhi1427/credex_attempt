import React, { useState } from 'react';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults';
import { usePersistentForm } from './hooks/usePersistentForm';
import { calculateAudit } from './utils/auditEngine';

function App() {
  // 1. Sourced the active persistent state array hook
  const [formData, setFormData] = usePersistentForm();
  const [showResults, setShowResults] = useState(false);

  // 2. Pass the DYNAMIC live formData state into your calculation engine!
  const report = calculateAudit(formData);

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {!showResults ? (
        <div className="w-full">
          {/* FIXED: Form state and updater passed explicitly as props */}
          <SpendForm formData={formData} setFormData={setFormData} />
          
          {/* Form Action Footer Control to trigger calculation view switch */}
          <div className="max-w-3xl mx-auto mt-6 text-right">
            <button
              onClick={() => setShowResults(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-extrabold text-md px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Run Instant Spend Audit →
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {/* Pass down BOTH the calculated data pass report and the live currency configuration state key! */}
          <AuditResults 
            report={report} 
            currency={formData.currency} 
            onReset={handleReset} 
          />
        </div>
      )}
    </div>
  );
}

export default App;