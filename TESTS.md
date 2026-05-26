# Comprehensive Engineering Quality Assurance Test Suites

## 1. Execution Overview
To preserve the absolute mathematical integrity of the deterministic evaluation formulas, every code modification must pass this automated test block suite. 

- **Test Runner File Path:** `src/utils/auditEngine.test.ts`
- **Testing Engine Framework:** Vitest Execution Runtime Environment
- **Assertion Strictness Tier:** High TypeScript Compiling Constraints

---

## 2. Core Registered Unit Test Profiles & Assertions

### Profile 1: Honesty Verification Optimization (Optimal Baseline)
- **Objective:** Assert that an already fully optimized developer tool configuration returns exactly zero artificial savings margins to preserve system evaluation integrity.
- **Input Matrix:** Single-seat configurations matching raw standard retail rates exactly.
- **Verification Criteria:** `totalMonthlySavings == 0`, `totalAnnualSavings == 0`, and the `toolBreakdowns` status maps cleanly to `Optimal`.

### Profile 2: Redundant Workspace Detection (IDE vs. Extension)
- **Objective:** Validate that overlapping code assistant layers (such as active `Cursor` Pro seats run concurrently alongside active `GitHub Copilot` subscriptions) trigger explicit consolidation drop flags.
- **Input Matrix:** Checking both tools simultaneously for a single developer seat.
- **Verification Criteria:** Isolates the GitHub Copilot row, marks its `recommendedPlan` to "Consolidate", and shifts its individual cost outflow directly into the savings column ($10/seat).

### Profile 3: Seat Minimum Validation Constraint (Claude Team Gates)
- **Objective:** Validate that under-provisioned workspaces (such as choosing a `Claude` or `ChatGPT` Team tier but entering a seat count below the mandatory vendor billing gate) trigger automated adjustment logic.
- **Input Matrix:** Tool selected on "Team Plan" with seats manually entered as `2` or `3`.
- **Verification Criteria:** Programmatically flags the unutilized seat premium or auto-adjusts the calculation parameters to mirror the mandatory minimum threshold cost baseline (e.g., enforcing the 5-seat minimum billing footprint or down-converting to individual licensing benchmarks).

### Profile 4: Credex Enterprise Consultation Routing (High-Value Filter)
- **Objective:** Verify that cumulative monthly infrastructure waste values exceeding or matching the enterprise boundary limit successfully activate the direct consultation routing parameters.
- **Input Matrix:** Multi-seat team allocations displaying overlapping assistant footprints that leak significant capital.
- **Verification Criteria:** If calculated `totalMonthlySavings >= 500`, the system must programmatically switch the `requiresCredexConsultation` boolean flag to strict `true`.

### Profile 5: Standard Cost Drift Realignment
- **Objective:** Assert that standard retail premium configurations calculate accurately against known official market reference models if user text inputs demonstrate dramatic manual overpayments.
- **Verification Criteria:** Form tracking algorithms cross-reference input values against internal hardcoded price matrices to capture accurate delta points.

---

## 3. How to Execute the Verification Test Suite

To fire up the Vitest automation runner engine locally and execute the complete test matrix suite, run this target pipeline script in your PowerShell window:

```bash
npm run test