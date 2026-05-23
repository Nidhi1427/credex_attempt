export type ToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'Anthropic API direct'
  | 'OpenAI API direct'
  | 'Gemini'
  | 'Windsurf'; // Chosen over v0 to satisfy the mandatory extra tool constraint

export interface ToolSpend {
  selected: boolean;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  companySize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  tools: Record<ToolName, ToolSpend>;
}

export interface LeadCaptureInput {
  email: string;
  companyName?: string;
  role?: string;
  teamSize: number;
  calculatedMonthlySavings: number;
  calculatedAnnualSavings: number;
}