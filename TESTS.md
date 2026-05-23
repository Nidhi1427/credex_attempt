# Automated Verification Test Suite

This document indexes all active execution tests written to preserve the integrity of the hardcoded mathematical evaluation parameters.

## Core Test Matrix
* **Test File Path**: `src/utils/auditEngine.test.ts`
* **Test Framework**: Vitest Execution Engine

### Registered Unit Test Profiles
1. **Honesty Verification Optimization**: Asserts that already optimized baseline inputs display zero artificial savings margins to enforce evaluation integrity.
2. **Redundant Workspace Detection**: Validates that overlapping code assistant layers (Cursor alongside active GitHub Copilot seats) trigger explicit drop recommendations to remove duplication.
3. **Seat Minimum Validation Constraint**: Validates that under-provisioned team workspaces (such as Claude Team seats below the mandatory 5-seat billing gate) trigger downward conversion logic to clear unutilized seat premiums.
4. **Credex Enterprise Consultation Routing**: Confirms that cumulative monthly waste exceeding or matching $500 properly activates flag parameters indicating high-value consultation suitability.
5. **Standard Cost Drift Realignment**: Asserts that standard retail premium configurations calculate accurately against known official cost references when user inputs demonstrate overpayment.

## How to Execute the Verification Test Suite

Run the automated validation checks locally by running the target execution pipeline script:

```bash
npm run test