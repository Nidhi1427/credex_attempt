import { describe, it, expect } from 'vitest';
import { calculateAudit } from './auditEngine';
import { type AuditFormData } from '../types';

// Baseline helper to clear state clutter in tests
const createMockForm = (toolsOverrides = {}): AuditFormData => ({
  companySize: 1,
  primaryUseCase: 'mixed',
  currency: 'USD',
  tools: {
    'Cursor': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'GitHub Copilot': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'Claude': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'ChatGPT': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'Anthropic API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
    'OpenAI API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
    'Gemini': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    'Windsurf': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
    ...toolsOverrides
  }
});

describe('AI Spend Audit Engine - Line-by-Line Spec Validation', () => {

  it('Rule 1: Should flag GitHub Copilot as $0 recommended spend if Cursor is also active', () => {
    const mockData = createMockForm({
      'Cursor': { selected: true, plan: 'Individual', monthlySpend: 20, seats: 1 },
      'GitHub Copilot': { selected: true, plan: 'Individual', monthlySpend: 10, seats: 1 }
    });

    const report = calculateAudit(mockData);
    const copilotResult = report.toolBreakdowns.find(t => t.toolName === 'GitHub Copilot');

    expect(copilotResult?.recommendedSpend).toBe(0);
    expect(copilotResult?.savings).toBe(10);
    expect(report.totalMonthlySavings).toBe(10);
  });

  it('Rule 2: Should catch the Claude Team 5-seat minimum billing trap', () => {
    const mockData = createMockForm({
      'Claude': { selected: true, plan: 'Team', monthlySpend: 150, seats: 2 }
    });

    const report = calculateAudit(mockData);
    const claudeResult = report.toolBreakdowns.find(t => t.toolName === 'Claude');

    // 2 active seats downgraded to individual Pro ($20 * 2 = $40)
    expect(claudeResult?.recommendedSpend).toBe(40);
    expect(claudeResult?.savings).toBe(110);
  });

  it('Rule 3: Should catch ChatGPT pricing drift or invalid Team seat usage', () => {
    const mockData = createMockForm({
      'ChatGPT': { selected: true, plan: 'Individual', monthlySpend: 50, seats: 1 } // Overpaying retail baseline
    });

    const report = calculateAudit(mockData);
    const chatGptResult = report.toolBreakdowns.find(t => t.toolName === 'ChatGPT');

    expect(chatGptResult?.recommendedSpend).toBe(20);
    expect(chatGptResult?.savings).toBe(30);
  });

  it('Bonus: Should accurately process calculation models under localized INR currency layers', () => {
    const mockData = createMockForm({
      'Cursor': { selected: true, plan: 'Individual', monthlySpend: 1660, seats: 1 }, // 20 USD * 83 FX
      'GitHub Copilot': { selected: true, plan: 'Individual', monthlySpend: 830, seats: 1 } // 10 USD * 83 FX
    });
    mockData.currency = 'INR';

    const report = calculateAudit(mockData);
    const copilotResult = report.toolBreakdowns.find(t => t.toolName === 'GitHub Copilot');

    expect(copilotResult?.recommendedSpend).toBe(0);
    expect(copilotResult?.savings).toBe(830); // Saves full INR amount
  });
});