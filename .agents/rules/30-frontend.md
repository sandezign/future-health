---
trigger: glob
globs: frontend/**
description: Frontend conventions and styling standards for RENAL-PULSE
---

# Frontend Conventions

1. **Framework & Tooling:**
   - React 19 + Vite + TypeScript (strict mode).
   - Package manager: `npm` or `pnpm`.
   - Styling: Tailwind CSS v4 + Lucide icons.
   - Charts & Visualization: Recharts for longitudinal clinical trajectories and KDIGO grids.
   - Server State: `@tanstack/react-query` for asynchronous patient data caching.

2. **UI & Usability Standards (Clinical Grade):**
   - **Zero Alert Fatigue:** Clinical cards must be non-interruptive, clear, and actionable. Avoid blocking modal dialogs for routine warnings.
   - **Dual-Encoding for Clinical Severity:** Never use color alone. Always pair color with an icon and clear textual status (e.g., Red badge + AlertTriangle icon + "Very High Risk (KDIGO Red)").
   - **Reassurance on Hemodynamic Dips:** Any recommendation for SGLT2i or ACEi/ARB must explicitly display the KDIGO reassurance badge explaining that an acute 10–20% eGFR dip is expected and indicates reduced intraglomerular pressure, not drug toxicity.
   - **Responsive & Accessible:** Minimum touch target size 44px; accessible color contrast for all text over badges; full responsiveness from 360px mobile to 1600px desktop.

3. **Number & Medical Formatting:**
   - eGFR: Always formatted to 1 decimal place with units (`mL/min/1.73m²`).
   - eGFR Slope: Displayed with explicit sign and time unit (e.g., `-3.8 mL/min/yr`). Negative slopes $\ge 3.0$ must display a "Rapid Progression" badge.
   - Blood Pressure: Formatted as `systolic/diastolic mmHg`.
   - Currency: Formatted as `IDR Rp xx,xxx,xxx` or `USD $xx,xxx` via centralized formatters in `shared/lib/formatters.ts`.
