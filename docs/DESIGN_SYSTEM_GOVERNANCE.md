# Mediora Clinical Design System — Governance & AI Readiness Manual

**Document Version:** 1.0.0  
**Effective Date:** 2026-10-20  
**Scope:** `frontend/src/shared/ui/`, `DESIGN.md`, `.agents/rules/30-frontend.md`, and all AI Coding Workflows.  
**Authority:** Core Architecture & Clinical Informatics Working Group  

---

## 1. Executive Summary & Philosophy

The **Mediora Clinical Design System** powers the RENAL-PULSE cardiorenal population health engine. It bridges clinical precision with high-trust consumer digital health interfaces. Because clinicians operate in high-cognitive-load, safety-critical environments, interface consistency, rapid scanability, and deterministic component behavior are patient safety imperatives.

To maintain system integrity as human engineers and autonomous AI coding agents (Antigravity, Claude Code, Cursor) collaborate on this codebase, this Governance Manual defines:
1. The **Operational Governance Model**: Ownership, contribution lifecycle, decision rights (DACI), semantic versioning, and deprecation protocols.
2. The **Clinical Quality Standards**: Zero ad-hoc styling, WCAG 2.2 AA accessibility, 44px clinical touch targets, and dual-encoding of medical risk.
3. The **AI-Readiness Infrastructure**: Formal machine-readable component metadata (`/ai-component-metadata` standard), AI anti-pattern guardrails, and automated CI/CD verification pipelines.

```
+-----------------------------------------------------------------------------------+
|                        MEDIORA DESIGN SYSTEM GOVERNANCE                           |
+-----------------------------------------------------------------------------------+
|  Foundational Layer:   DESIGN.md (Tokens, Typography, Geometry, Elevation)        |
|  Primitive Layer:      shared/ui (Button, Card, Badge, Input, Modal)              |
|  AI Metadata Layer:    shared/ui/metadata/*.meta.ts & ai-catalog.json             |
|  Enforcement Layer:    validate_ai_metadata.py + .agents/rules/30-frontend.md     |
|  Consuming Layers:     entities/ -> features/ -> widgets/ -> pages/ (FSD v2)     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Governance Framework (The 7 Pillars)

### Pillar 1: Ownership Model (Hybrid Architecture)

To balance rigorous clinical safety with rapid product iteration, RENAL-PULSE adopts a **Hybrid Ownership Model**:

* **Core Design System Team (Foundation Custodians):**
  * **Scope:** Foundational tokens (`DESIGN.md`, `index.css`), global primitives (`frontend/src/shared/ui/*`), AI metadata schemas (`metadata/types.ts`), and governance tooling (`scripts/validate_ai_metadata.py`).
  * **Responsibilities:** Maintain token parity, guarantee WCAG 2.2 AA compliance, review primitive RFCs, and release versioned packages.
* **Federated Product & Clinical Teams (Domain Contributors):**
  * **Scope:** Domain entities (`entities/patient`, `entities/kdigo`), interactive features (`features/prescribe-gdmt`, `features/outreach-simulator`), and composite widgets (`widgets/kdigo-heatmap`).
  * **Responsibilities:** Propose new primitives when recurring patterns emerge across $\ge 2$ features; ensure domain implementations adhere to primitive APIs and clinical dual-encoding rules.

#### RACI Responsibility Matrix

| Area / Artifact | Core DS Team | Feature Engineers | Clinical Lead | AI Coding Agents |
|---|---|---|---|---|
| Design Tokens (`DESIGN.md`, CSS Variables) | **Accountable** | Consulted | Consulted | Informed (Read-Only) |
| UI Primitives (`shared/ui/*.tsx`) | **Accountable** | Responsible | Consulted | Responsible (Code-Gen) |
| AI Component Metadata (`*.meta.ts`) | **Accountable** | Responsible | Consulted | Informed (Read & Obey) |
| Clinical Risk Badges & Dual Encoding | Consulted | Responsible | **Accountable** | Responsible (Strict Rule) |
| FSD Layer Boundaries (`rules/30-frontend.md`)| **Accountable** | Responsible | Informed | Responsible (Strict Rule) |

---

### Pillar 2: Contribution Lifecycle

Every change or addition to the design system must follow this structured 7-stage lifecycle:

```
[1. Proposal / RFC] ──> [2. Triage & Gate] ──> [3. Clinical & UX Spec]
                                                          │
[6. Semver Release] <── [5. Automated Gates] <── [4. AI Metadata & Impl]
        │
[7. Consumer Adoption]
```

1. **Proposal / RFC:** Contributor opens an issue or RFC when a UI pattern is needed in at least two separate features and cannot be fulfilled by existing primitives.
2. **Triage & Decision Gate:** Core team reviews within 2 business days:
   * *Generalizability:* Is this truly reusable, or feature-specific?
   * *Existing Alternatives:* Can existing components (`Button`, `Card`, `Badge`) be composed to solve this?
   * *Clinical Alignment:* Does it adhere to Mediora squircle geometry and token constraints?
3. **Clinical & UX Specification:** Detailed props, variants, states, accessibility behavior, and clinical safety considerations documented.
4. **Implementation & AI Metadata Generation:**
   * Component code written in `shared/ui/[component].tsx`.
   * **Mandatory AI Metadata** created in `shared/ui/metadata/[component].meta.ts` according to `/ai-component-metadata` schema.
5. **Automated Quality Verification:**
   * `python3 scripts/validate_ai_metadata.py` checks parity and metadata schema completeness.
   * TypeScript typecheck (`tsc -b`) and component unit tests.
   * WCAG AA accessibility verification (keyboard traps, color contrast, touch targets).
6. **Semantic Release:** Version tag incremented, `ai-catalog.json` recompiled, and release notes published to changelog.
7. **Consumer Adoption & Monitoring:** Product feature slices adopt the new primitive; telemetry monitors usage vs legacy markup.

---

### Pillar 3: Proposal & Decision Framework (DACI)

All design system architecture decisions follow the **DACI Framework**:

* **Driver (D):** The author of the RFC (engineer, designer, or AI agent pair) driving the proposal forward.
* **Approver (A):** The Core Design System Lead (for technical/architectural changes) or Clinical Safety Officer (for risk visualization changes). Exactly one Approver per decision.
* **Contributors (C):** Domain engineers, accessibility specialists, and product managers who provide input and edge cases.
* **Informed (I):** All engineers and consuming agents notified via repository release notes and rules updates.

#### Lightweight RFC Template for Design System Primitives

```markdown
# RFC: [Component / Token Name]

## 1. Problem Statement
Which product/clinical features require this? Why do existing primitives fail to satisfy it?

## 2. Proposed Component API
- **Name:**
- **Category:** atom | molecule | organism
- **Props & Variants:**
- **Geometry & Tokens Used:**

## 3. Clinical & Accessibility Safety Review
- **WCAG Level:** AA
- **Keyboard Interaction Model:**
- **Clinical Dual-Encoding Strategy (if applicable):**
- **Touch Target Size:** (Must be >= 44px)

## 4. AI Metadata Draft
Include drafted `commonPatterns` and `antiPatterns` for AI agent consumption.
```

---

### Pillar 4: Semantic Versioning Policy (Semver)

The design system adheres to Semantic Versioning (`MAJOR.MINOR.PATCH`):

| Version Bump | Clinical / UI Criteria | Examples |
|---|---|---|
| **PATCH** (`x.y.Z`) | Bug fixes, visual polish adjustments, doc updates, metadata additions, accessibility attribute corrections without API changes. | Fix badge focus border; update `button.meta.ts` anti-patterns; correct contrast token. |
| **MINOR** (`x.Y.z`) | New primitives, new non-breaking component variants, new props with safe defaults. Fully backward-compatible. | Adding `Table` primitive; adding `shape="pill"` to Input; introducing new status variant. |
| **MAJOR** (`X.y.z`) | Breaking changes: prop renames, prop removals, altered default behavior, deleted components, or modified clinical safety thresholds. | Renaming `variant="red"` to `variant="critical"`; changing Modal default `isOpen` behavior; modifying eGFR slope threshold. |

* **Notice Period:** Breaking changes must be preceded by a formal deprecation notice lasting at least one full MINOR release cycle.
* **Release Cadence:** Minor releases occur on bi-weekly sprints; Patches are deployed continuously via CI.

---

### Pillar 5: Breaking Changes & Migration Protocol

Breaking changes must minimize cognitive burden and refactoring friction for both human engineers and AI coding agents:

1. **Deprecation Notice:** The existing prop or component is marked with `@deprecated` in TypeScript JSDoc and flagged in its corresponding `.meta.ts` file under `antiPatterns`.
2. **Runtime Warning (Dev Mode):** In development builds, the deprecated component outputs a non-fatal console warning specifying the replacement API and target removal version.
3. **Migration Guide & Codemod:**
   * Every major bump must provide an explicit before-and-after code recipe in `docs/migrations/v[X]-migration.md`.
   * For mechanical renames, an automated AST codemod or regex script must be provided in `scripts/codemods/`.
4. **Compatibility Shim:** Where immediate migration of critical clinical workflows is not viable, a backward-compatible shim wrapper must be supplied during the transition window.

---

### Pillar 6: Deprecation & Sunsetting Lifecycle

Components and variants transition through three distinct phases:

```
[ Phase 1: ACTIVE ]
       │
       ▼  (Replacement released with migration guide)
[ Phase 2: DEPRECATED ] ──> Documented in *.meta.ts as Anti-Pattern
       │                    Logged in development console
       │                    Grace period: Minimum 1 Minor Version Cycle
       ▼  (Major version bump)
[ Phase 3: SUNSET & REMOVED ]
```

* **Timeline:** An item entering `DEPRECATED` in version `2.4.0` cannot be removed until `3.0.0` at the earliest.
* **AI Agent Guardrail:** As soon as an item is marked `DEPRECATED`, its companion AI metadata records it as an `antiPattern`. AI coding agents will immediately cease generating the deprecated API and will suggest the replacement.

---

### Pillar 7: Quality Standards & Verification Gates

Before any component or modification is merged into `shared/ui/`, it must pass five mandatory gates:

1. **Zero Ad-Hoc Styling Gate:**
   * Raw HTML elements (`<button>`, `<input>`, unstyled `<div>` cards) are strictly prohibited in application slices when a primitive exists.
   * All colors, borders, shadows, and radii must resolve to canonical tokens from `DESIGN.md`.
2. **Accessibility Gate (WCAG 2.2 Level AA):**
   * Minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text / UI controls.
   * Full keyboard navigation (Tab order, Space/Enter activation, Escape dismissal for overlays).
   * Minimum 44px touch target height for clinical interactive elements.
3. **Clinical Safety Gate (Dual-Encoding & Alert Fatigue):**
   * Severity and risk indicators must dual-encode color with text and iconography (e.g. Red + AlertTriangle + "Very High Risk"). Color-only indicators are rejected.
   * Blocking dialogs (`Modal`) are banned for routine clinical notifications to prevent alert fatigue.
4. **Feature-Sliced Design (FSD v2) Layer Boundary Gate:**
   * Components in `shared/ui/` must remain completely domain-agnostic. No patient models, lab formulas, or business rules may be imported into `shared/`.
5. **AI Metadata & Parity Gate:**
   * Every component in `shared/ui/` must possess a valid, complete `.meta.ts` specification.
   * `python3 scripts/validate_ai_metadata.py` must execute with exit code `0`.

---

## 3. Building for AI Readiness

### Why AI Readiness is a Design System Priority

Modern engineering teams increasingly rely on autonomous AI agents (Google DeepMind Antigravity, Anthropic Claude Code, Cursor, Copilot) to generate frontend interfaces. However, standard LLMs exhibit predictable failure modes when generating UI code:
* **Token Drift:** Reverting to generic Tailwind defaults (`bg-blue-500`, `rounded-md`, harsh drop shadows) instead of design tokens.
* **HTML Hallucination:** Writing unstyled raw HTML (`<button>`, `<input>`) instead of importing audited design system primitives.
* **Clinical Safety Blindspots:** Violating dual-encoding rules (generating color-only risk indicators) or introducing alert fatigue with modal popups for non-emergency conditions.
* **Accessibility Omissions:** Skipping ARIA labels on icon buttons or failing to handle focus traps.

The **Mediora AI-Ready Architecture** eliminates these failure modes by transforming the design system into a **machine-readable knowledge graph** that guides, constrains, and verifies AI-generated code.

---

### The AI-Component Metadata Architecture (`/ai-component-metadata`)

Every primitive in `shared/ui/` is paired 1-to-1 with an AI metadata specification in `shared/ui/metadata/`:

```
frontend/src/shared/ui/
├── button.tsx            <── Component Implementation
├── card.tsx
├── badge.tsx
├── input.tsx
├── modal.tsx
└── metadata/
    ├── types.ts          <── Canonical Metadata Schema Interface
    ├── button.meta.ts    <── AI Specification (Patterns, Anti-Patterns, ARIA)
    ├── card.meta.ts
    ├── badge.meta.ts
    ├── input.meta.ts
    ├── modal.meta.ts
    ├── index.ts          <── Registry, Lookup API, & Context Exporter
    └── ai-catalog.json   <── Compiled Machine-Readable Catalog for Agent Prompts
```

#### Metadata Schema Fields Explained

```typescript
export interface ComponentMetadata {
  component: {
    name: string;              // Exact component export name
    category: 'atoms' | 'molecules' | 'organisms';
    description: string;       // Precise functional summary
    type: 'interactive' | 'display' | 'container' | 'input' | 'navigation';
    version?: string;          // Component semver
    status?: 'stable' | 'beta' | 'deprecated';
  };
  usage: {
    useCases: string[];        // When the AI should pick this component
    requiredProps: string[];   // Props that MUST be provided
    optionalProps?: string[];  // Available configuration props
    commonPatterns: {          // Runnable code examples illustrating exact composition
      name: string;
      description: string;
      composition: string;
    }[];
    antiPatterns: {            // Specific anti-patterns with reasons and direct alternatives
      scenario: string;        // The bad code pattern the AI might generate
      reason: string;          // Why it breaks UX or clinical safety
      alternative: string;     // The exact compliant replacement
    }[];
  };
  composition: {
    slots?: Record<string, string>;       // Named slots (header, content, footer)
    nestedComponents?: string[];          // Allowed child primitives
    commonPartners?: string[];            // Components commonly used alongside
    parentConstraints?: string[];         // Where this component is permitted
  };
  behavior: {
    states: string[];                     // hover, focus, active, disabled, pulse
    interactions: Record<string, string>; // Keyboard & pointer event behavior
    responsive?: Record<string, string>;  // Viewport adaptation rules
  };
  accessibility: {
    role: string;                         // ARIA role
    keyboardSupport: string;              // Exact keys handled (Enter, Space, Escape)
    screenReader: string;                 // How assistive technology announces it
    focusManagement: string;              // Focus rings and traps
    wcag: 'A' | 'AA' | 'AAA';             // Certification target
  };
  aiHints: {
    priority: 'high' | 'medium' | 'low';  // Selection priority in ambiguous contexts
    keywords: string[];                   // Natural language triggers
    context: string;                      // Clinical / UX operational guidance
    tokensUsed?: string[];                // Bound design tokens
  };
}
```

---

### How AI Coding Agents Ingest and Obey the System

#### 1. Pre-Generation Context Ingestion
When an AI agent is tasked with building or updating a UI feature (e.g., Doctor Clinical Copilot or Population Command Center):
1. The agent reads `.agents/rules/30-frontend.md` and discovers the component governance mandate.
2. The agent references `frontend/src/shared/ui/metadata/ai-catalog.json` (or calls `searchComponentsByKeyword`) to identify matching components and their allowed patterns.
3. The agent verifies prop requirements, slot compositions, and anti-patterns *before* generating code.

#### 2. Negative Constraint Enforcement (Anti-Patterns as Prompt Penalties)
By explicitly specifying what *not* to do with concrete alternatives, the metadata prevents standard hallucinations:

| Component | AI Hallucination Scenario | Metadata Anti-Pattern Guardrail | Compliant Replacement |
|---|---|---|---|
| **Button** | `<button className="bg-blue-600 ...">` | Zero Ad-Hoc Styling violation; breaks tactile scale-98 and focus ring. | `<Button variant="primary" shape="pill">` |
| **Badge** | `<span className="text-red-500">Critical</span>` | Ad-hoc styling; missing semantic status role. | `<Badge variant="red">` |
| **Badge** | `<Badge variant="red">Very High</Badge>` | Single-channel color encoding; violates WCAG 1.4.1 & Clinical Safety Rule #1. | `<Badge variant="red"><AlertTriangle className="h-3 w-3" /> Very High Risk (KDIGO Red)</Badge>` |
| **Card** | `<div className="shadow-2xl border-black">` | Harsh dark shadow & non-squircle borders violate Mediora tokens. | `<Card><CardHeader>...<CardContent>...</Card>` |
| **Input** | `<input className="h-8" />` | Sub-44px touch target violates WCAG 2.5.8 and clinical ergonomics. | `<Input label="..." shape="rounded" />` (44px min) |
| **Modal** | Modal popup for routine 10-20% eGFR dip | Alert Fatigue violation (Clinical Safety Rule #2). | Inline `<Card>` reassurance banner. |

---

### Automated Validation & CI/CD Pipeline

To ensure that human contributors and AI agents never drift from this specification, the repository includes an automated verification script:

```bash
# Run metadata validation and catalog compiler
python3 scripts/validate_ai_metadata.py
```

#### What `validate_ai_metadata.py` Enforces:
1. **1-to-1 Parity:** Every UI component in `shared/ui/*.tsx` must have an identical `shared/ui/metadata/*.meta.ts` counterpart.
2. **Schema Completeness:** All 6 required root sections (`component`, `usage`, `composition`, `behavior`, `accessibility`, `aiHints`) and their required nested fields must be defined.
3. **Guardrail Depth:** Enforces a minimum of 2 runnable `commonPatterns` and 2 concrete `antiPatterns` per component to guarantee adequate guidance for AI models.
4. **Automated Catalog Compilation:** Automatically emits updated, minified, and pretty-printed machine-readable registries to `frontend/src/shared/ui/metadata/ai-catalog.json` and `data/ai-component-catalog.json`.

---

## 4. Human-in-the-Loop Clinical Verification Rubric

When code is generated by AI agents for clinical interfaces, human reviewers (or secondary verification agents) must audit the pull request against this 5-point checklist:

- [ ] **1. Zero Raw Primitives:** No native `<button>`, `<input>`, or raw border/shadow divs used in place of `@/shared/ui` components.
- [ ] **2. Dual-Encoded Severity:** Every clinical risk badge pairs color with an explicit status label and a Lucide icon.
- [ ] **3. Metric Precision:** All eGFR figures render with 1 decimal place and units (`mL/min/1.73m²`) in `font-mono`; eGFR slopes include explicit sign and `/yr`.
- [ ] **4. Non-Interruptive Warnings:** Expected pharmacological responses (e.g. initial eGFR dip from SGLT2i) use inline reassurance cards rather than blocking modal dialogs.
- [ ] **5. Touch Target & Accessibility:** All interactive elements meet the $\ge 44\text{px}$ touch target requirement and include visible focus rings.

---

## 5. Summary & Quick Reference

| Resource | Path | Purpose |
|---|---|---|
| **Design Tokens & Visual Spec** | [DESIGN.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/DESIGN.md) | Canonical source for colors, typography, elevation, and squircle radii. |
| **Frontend Agent Rules** | [.agents/rules/30-frontend.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/.agents/rules/30-frontend.md) | Instructions and constraints for AI coding agents. |
| **Component Primitives** | [frontend/src/shared/ui/](file:///Users/mb-rci-backup/Documents/antigravity/future-health/frontend/src/shared/ui/) | Production React 19 UI primitives. |
| **AI Metadata Registry** | [frontend/src/shared/ui/metadata/](file:///Users/mb-rci-backup/Documents/antigravity/future-health/frontend/src/shared/ui/metadata/) | Machine-readable component metadata specifications. |
| **Compiled AI Catalog** | [ai-catalog.json](file:///Users/mb-rci-backup/Documents/antigravity/future-health/frontend/src/shared/ui/metadata/ai-catalog.json) | JSON catalog for agent context injection. |
| **Validation Script** | [validate_ai_metadata.py](file:///Users/mb-rci-backup/Documents/antigravity/future-health/scripts/validate_ai_metadata.py) | Parity and schema verification script (`python3 scripts/validate_ai_metadata.py`). |
