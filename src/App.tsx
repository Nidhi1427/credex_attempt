import React, { useState } from 'react';
import SpendForm from './components/SpendForm';
import AuditResults from './components/AuditResults';
import { usePersistentForm } from './hooks/usePersistentForm';
import { calculateAudit } from './utils/auditEngine';

function App() {
  const [formData, setFormData] = usePersistentForm();
  const [showResults, setShowResults] = useState(false);

  const report = calculateAudit(formData);

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {!showResults ? (
        <div className="w-full">
          {/* Form state properties and functional callback logic passed explicitly here */}
          <SpendForm 
            formData={formData} 
            setFormData={setFormData} 
            onRunAudit={() => setShowResults(true)} 
          />
        </div>
      ) : (
        <div className="w-full">
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