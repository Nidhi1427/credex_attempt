import { useState, useEffect } from 'react';
import { type AuditFormData, type ToolName } from '../types';

const INITIAL_STATE: AuditFormData = {
  companySize: 1,
  primaryUseCase: 'mixed',
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
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    }
    return INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('credex_audit_form', JSON.stringify(formData));
  }, [formData]);

  return [formData, setFormData] as const;
}