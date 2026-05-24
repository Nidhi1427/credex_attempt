import { useState, useEffect } from 'react';
import { type AuditFormData } from '../types';

const INITIAL_STATE: AuditFormData = {
  companySize: 1,
  primaryUseCase: 'mixed',
  currency: 'USD', 
  tools: {
    'Cursor': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
    'GitHub Copilot': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'Claude': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
    'ChatGPT': { selected: false, plan: 'Plus', monthlySpend: 0, seats: 1 },
    'Anthropic API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
    'OpenAI API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
    'Gemini': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
    'Windsurf': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
  }
};

export function usePersistentForm() {
  const [formData, setFormData] = useState<AuditFormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('credex_audit_form');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Defensive Merge: Mixes the old cached data with INITIAL_STATE structures
          // to guarantee new keys like 'currency' or missing tools are never undefined.
          return {
            ...INITIAL_STATE,
            ...parsed,
            tools: {
              ...INITIAL_STATE.tools,
              ...(parsed.tools || {})
            }
          };
        } catch (e) {
          return INITIAL_STATE;
        }
      }
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('credex_audit_form', JSON.stringify(formData));
  }, [formData]);

  return [formData, setFormData] as const;
}