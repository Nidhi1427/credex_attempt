import { describe, it, expect } from 'vitest';
import { calculateAudit } from './auditEngine';
import { type AuditFormData } from '../types';

// Helper to generate a clean baseline form state configuration
const createMockForm = (overrides: Partial<AuditFormData> = {}): AuditFormData => {
  return {
    companySize: 5,
    primaryUseCase: 'coding',
    tools: {
      'Cursor': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
      'GitHub Copilot': { selected: false, plan: 'Individual', monthlySpend: 0, seats: 1 },
      'Claude': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
      'ChatGPT': { selected: false, plan: 'Plus', monthlySpend: 0, seats: 1 },
      'Anthropic API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
      'OpenAI API direct': { selected: false, plan: 'API direct', monthlySpend: 0, seats: 1 },
      'Gemini': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
      'Windsurf': { selected: false, plan: 'Pro', monthlySpend: 0, seats: 1 },
      ...overrides.tools
    },
    ...overrides
  };
};

describe('AI Spend Audit Engine Core Mathematics', () => {
  
  // Test 1: Absolute Honesty Validation (Rubric Rule: Don't manufacture fake savings)
  it('should accurately validate an already optimized stack with zero artificial savings padding', () => {
    const mockForm = createMockForm({
      tools: {
        'Cursor': { selected: true, plan: 'Pro', monthlySpend: 20, seats: 1 }
      }
    });
    const report = calculateAudit(mockForm);
    expect(report.totalMonthlySavings).toBe(0);
    expect(report.isOptimal).toBe(true);
    expect(report.requiresCredexConsultation).toBe(false);
  });

  // Test 2: Redundant Workspace Overlap Filter (Cursor + Copilot double-allocation rule)
  it('should flag redundant code assistant layers and recommend dropping GitHub Copilot if Cursor is active', () => {
    const mockForm = createMockForm({
      tools: {
        'Cursor': { selected: true, plan: 'Pro', monthlySpend: 20, seats: 1 },
        'GitHub Copilot': { selected: true, plan: 'Individual', monthlySpend: 10, seats: 1 }
      }
    });
    const report = calculateAudit(mockForm);
    expect(report.totalMonthlySavings).toBe(10); // Should drop Copilot completely
    const copilotAudit = report.toolBreakdowns.find(t => t.toolName === 'GitHub Copilot');
    expect(copilotAudit?.recommendedSpend).toBe(0);
    expect(copilotAudit?.recommendedPlan).toContain('Drop Copilot');
  });

  // Test 3: Claude Team Tier Seat Minimum Trap
  it('should calculate structural waste if a team is paying for Claude Team tier with under 5 active seats', () => {
    const mockForm = createMockForm({
      tools: {
        // User reports spending $150 for 2 seats on Team tier (which mandates a $150 minimum bill)
        'Claude': { selected: true, plan: 'Team', monthlySpend: 150, seats: 2 }
      }
    });
    const report = calculateAudit(mockForm);
    // Optimization moves them to 2 Pro seats ($40 total), saving $110/month
    expect(report.totalMonthlySavings).toBe(110);
    const claudeAudit = report.toolBreakdowns.find(t => t.toolName === 'Claude');
    expect(claudeAudit?.recommendedPlan).toBe('Pro');
  });

  // Test 4: Enterprise Lead Generation Consultation Threshold Trigger (>$500/mo waste)
  it('should explicitly mandate a Credex Consultation flag if cumulative monthly waste matches or scales past $500', () => {
    const mockForm = createMockForm({
      tools: {
        // High waste setup to simulate bloated enterprise configurations
        'Claude': { selected: true, plan: 'Team', monthlySpend: 750, seats: 3 } // $750 - $60 = $690 waste
      }
    });
    const report = calculateAudit(mockForm);
    expect(report.totalMonthlySavings).toBeGreaterThanOrEqual(500);
    expect(report.requiresCredexConsultation).toBe(true);
  });

  // Test 5: Standard Retail Cost Alignment Drift Validation
  it('should verify pricing calculations match retail reference baselines when users report inflated billings', () => {
    const mockForm = createMockForm({
      tools: {
        'ChatGPT': { selected: true, plan: 'Plus', monthlySpend: 50, seats: 1 } // Standard Plus is $20
      }
    });
    const report = calculateAudit(mockForm);
    expect(report.totalMonthlySavings).toBe(30); // $50 current - $20 retail expectation = $30 saved
  });
});