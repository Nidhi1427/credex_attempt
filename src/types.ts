export type ToolName = 
  | 'Cursor' 
  | 'GitHub Copilot' 
  | 'Claude' 
  | 'ChatGPT' 
  | 'Anthropic API direct' 
  | 'OpenAI API direct' 
  | 'Gemini' 
  | 'Windsurf';

export interface ToolSpend {
  selected: boolean;
  plan: string; 
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  companySize: number;
  primaryUseCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
  currency: 'USD' | 'INR';
  tools: Record<ToolName, ToolSpend>;
}