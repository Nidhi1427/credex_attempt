import React, { useState } from 'react';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults';
import { usePersistentForm } from './hooks/usePersistentForm';
import { calculateAudit } from './utils/auditEngine';

function App() {
  const [formData, setFormData] = usePersistentForm();
  const [showResults, setShowResults] = useState(false);

  // Execute the calculation profile pass
  const report = calculateAudit(formData);

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {!showResults ? (
        <div className="w-full">
          <SpendForm />
          
          {/* Form Action Footer Control to trigger calculation view switch */}
          <div className="max-w-3xl mx-auto mt-6 text-right">
            <button
              onClick={() => setShowResults(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-md px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Run Instant Spend Audit →
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <AuditResults report={report} onReset={handleReset} />
        </div>
      )}
    </div>
  );
}

export default App;