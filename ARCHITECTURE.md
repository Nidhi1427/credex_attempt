# System Architecture Specification

## Component Topology & Data Flow
The application is structured as a decoupled, unidirectional state architecture built on React, TypeScript, and Vite.

[App.tsx] (Global View States & Calculation Engine)
   │
   ├──► [usePersistentForm.ts] (Synchronizes Form State with LocalStorage)
   │
   ├──► [SpendForm.tsx] (Self-Defending UI Input Form with Inline CSS)
   │
   └──► [AuditResults.tsx] (Bento Grid Visualizer & Lead Capture Layer)
           │
           ├──► [databaseService.ts] (Handles Transactional Log Writes)
           └──► [aiService.ts] (Simulates LLM Executive Brief Generation)

## State Lifecycle
1. **Hydration:** On mount, `usePersistentForm` reads from the browser's cache to populate active software inputs.
2. **Mutation:** User toggles checkboxes or scales seats in `SpendForm`, mutating the local state object.
3. **Evaluation:** `App.tsx` passes raw data through `calculateAudit()` from the `auditEngine`, computing target baseline differentials instantly.
4. **Persistence:** Lead records are committed to local browser vectors via synchronous write streams in `databaseService`.