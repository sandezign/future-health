---
trigger: glob
globs: frontend/**
description: Frontend conventions, design tokens, and component governance for RENAL-PULSE
---

# Frontend Design System & Component Governance

All UI development must comply with the canonical design specification in [DESIGN.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/DESIGN.md) and adhere to the strict Feature-Sliced Design (FSD v2) hierarchy.

---

## 1. Framework & Token Foundation

- **Core Stack:** React 19 + Vite + TypeScript (strict mode).
- **Styling Engine:** Tailwind CSS v4 configured via `@theme` in `src/app/styles/index.css`.
- **Design Tokens:**
  - **Canvas Background:** `--color-canvas` (`#f5f6f9`).
  - **Surfaces:** `--color-surface-card` (`#ffffff`), `--color-surface-subtle` (`#f8fafc`), `--color-surface-muted` (`#f1f5f9`).
  - **Primary Interactive:** `--color-primary-indigo` (`#4f46e5`), hover (`#4338ca`), subtle background (`#eef2ff`).
  - **Clinical / Status:**
    - Success / Low Risk: `--color-status-success` (`#10b981`), subtle (`#ecfdf5`).
    - Warning / Moderate: `--color-status-warning` (`#f97316`), subtle (`#fff7ed`).
    - Danger / Critical / Very High: `--color-status-danger` (`#ef4444`), subtle (`#fef2f2`).
  - **Typography:**
    - UI & Headings: `Plus Jakarta Sans` (`font-sans`).
    - Lab Measurements, eGFR, BP, & Math: `JetBrains Mono` (`font-mono`).
  - **Geometry:**
    - Action Buttons & Filter Chips: Pill shape (`rounded-full` / `shape="pill"`).
    - Content Cards: Soft squircle (`rounded-2xl` 16px–20px / `rounded-3xl` 24px).
    - Modal Dialogs: Deep squircle (`rounded-3xl` 28px).
    - Form Wells: Soft rounded rectangle (`rounded-xl` 12px–16px).
  - **Elevation:** Ambient diffuse shadows (`shadow-card`, `shadow-card-hover`, `shadow-modal`). Never use harsh dark shadows.

---

## 2. Reusable Component Governance (Zero Ad-Hoc Styling)

Developers and coding agents **must never write raw unstyled HTML elements** when a primitive exists in `shared/ui`. Always import and compose from `shared/ui`:

```typescript
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Input, Modal } from '@/shared/ui';
// or from '../../../shared/ui'
```

1. **Buttons (`Button`):**
   - **Banned:** `<button className="bg-blue-500 ...">`
   - **Required:** `<Button variant="primary" shape="pill">`
   - **Variants:** `primary` (indigo), `secondary` (slate-900), `subtle` (indigo-50), `outline` (bordered white), `success` (emerald-600), `danger` (rose-600), `ghost`, `link`.
   - **Shapes:** `pill` (default for standalone CTAs) or `rounded` (for toolbars/dense rows).

2. **Cards & Containers (`Card`):**
   - **Banned:** Raw `<div>` with arbitrary card borders and shadows.
   - **Required:** `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardDescription>`, `<CardContent>`, `<CardFooter>`.
   - Ensures consistent squircle curvature (`rounded-2xl`), ambient elevation, and responsive internal padding (`p-5` to `p-6`).

3. **Status Indicators & Tiers (`Badge`):**
   - **Banned:** Ad-hoc inline colored spans.
   - **Required:** `<Badge variant="...">`.
   - **Variants:**
     - Clinical KDIGO: `green` (low risk), `yellow` (moderate), `orange` (high), `red` (very high), `rapid` (rapid progressor pulse).
     - Interface Status: `indigo`, `cyan`, `purple`, `outline`, `secondary`.

4. **Form Controls (`Input`):**
   - **Banned:** Raw `<input>` tags.
   - **Required:** `<Input label="..." icon={<Search />} error="..." shape="pill" | "rounded" />`.
   - Guaranteed minimum 44px touch target height, inset label, and accessible focus rings.

5. **Modals & Dialogs (`Modal`):**
   - **Banned:** Ad-hoc fixed div overlays or browser `alert()`/`confirm()`.
   - **Required:** `<Modal isOpen={isOpen} onClose={handleClose} title="..." footer={...}>`.
   - Guaranteed backdrop blur (`backdrop-blur-md bg-slate-900/30`), 28px squircle dialog, ESC key binding, and body scroll lock.

---

## 3. Pattern Reusability & Architecture Boundaries (FSD v2)

Component creation must respect strict layer ownership:
- **`shared/ui/`:** Domain-agnostic UI primitives only (`Button`, `Card`, `Badge`, `Input`, `Modal`). Never import business logic, patient models, or formulas into `shared`.
- **`entities/`:** Domain-specific presentation models (e.g., patient identity badge, lab result item, KDIGO stage cell).
- **`features/`:** User interactions and workflows (e.g., 1-click GDMT order trigger, WhatsApp outreach simulator sender).
- **`widgets/`:** Composite sections that combine entities and features (e.g., `EgfrTrajectoryChart`, `KdigoHeatmap`, `PatientTriageTable`).
- **`pages/`:** Route views composed of widgets.
- **`app/`:** Global setup, providers, styles.

**Import Rule:** strictly downward (`app → pages → widgets → features → entities → shared`). Slices on the same layer must never import from each other.

---

## 4. Clinical Usability & Safety Standards

1. **Dual-Encoding for Severity:** Never rely on color alone. Always pair color with an icon and explicit text status (e.g., Red badge + `AlertTriangle` icon + "Very High Risk (KDIGO Red)").
2. **Zero Alert Fatigue:** Clinical cards must be non-interruptive, clear, and actionable. Avoid blocking modal dialogs for routine warnings; reserve `Modal` for intentional workflows (e.g. detailed lab inspection, order confirmation).
3. **Hemodynamic Dip Reassurance:** Any recommendation for SGLT2i or ARB must explicitly display the KDIGO reassurance badge explaining that an acute 10–20% eGFR dip at 4 weeks is expected intraglomerular pressure reduction, not nephrotoxicity.
4. **Standardized Clinical Formatting:**
   - eGFR: Always formatted to 1 decimal place with units (`mL/min/1.73m²`).
   - eGFR Slope: Displayed with explicit sign and time unit (e.g., `-3.8 mL/min/yr`). Negative slopes $\le -3.0$ must display the `rapid` badge.
   - Blood Pressure: Formatted as `systolic/diastolic mmHg`.
   - Currency: Centralized formatters in `shared/lib/formatters.ts` (`IDR Rp xx,xxx,xxx` or `USD $xx,xxx`).

---

## 5. AI-Ready Component Governance & Metadata Mandate

All coding agents (Antigravity, Cursor, Claude Code) must comply with the canonical design system governance specification in `docs/DESIGN_SYSTEM_GOVERNANCE.md`.

1. **Consult Component Metadata Before Generation:**
   - Every primitive in `frontend/src/shared/ui/` has a corresponding AI metadata specification in `frontend/src/shared/ui/metadata/*.meta.ts`.
   - Agents must review `commonPatterns` and `antiPatterns` before generating new JSX.
2. **Enforce AI Anti-Patterns:**
   - Any PR or code change introducing an anti-pattern defined in component metadata (e.g. ad-hoc divs, single-channel color encoding, sub-44px touch targets) will fail automated quality gates.
3. **Component Contribution Parity:**
   - Any new component added to `shared/ui/` must include a companion `[component].meta.ts` file registered in `shared/ui/metadata/index.ts`.
   - Verification command: `python3 scripts/validate_ai_metadata.py`.
