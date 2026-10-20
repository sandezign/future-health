---
trigger: all
description: Architectural boundaries and layer constraints for RENAL-PULSE
---

# Architecture Boundaries

## Frontend: Feature-Sliced Design (FSD v2)
The frontend directory follows strict FSD layering:
```
src/
├── app/        # Global providers, router, app-wide styles
├── pages/      # Route entrypoints composed of widgets
├── widgets/    # Self-contained composite UI sections (e.g. EgfrTrajectoryChart, KdigoHeatmap)
├── features/   # User actions & workflows (e.g. initiate-gdmt, trigger-outreach)
├── entities/   # Domain concepts (e.g. patient, cardiorenal-risk, kdigo)
└── shared/     # Domain-agnostic UI kit, API clients, formatters, utilities
```

### Import Rules
- **Layer Hierarchy (strictly top-to-bottom):**  
  `app → pages → widgets → features → entities → shared`
- A layer may **only import from layers strictly below it**.
- Slices on the same layer may **never import from each other** (e.g., `features/initiate-gdmt` cannot import from `features/trigger-outreach`).
- `shared` may never import from any other layer.

## Backend: Clean Fast-API Architecture
```
backend/app/
├── core/       # Configuration, security, constants, mathematical formulas
├── api/        # REST route definitions
├── models/     # Pydantic schemas and data transfer objects (DTOs)
└── services/   # Pure business and clinical logic (CKD-EPI, KFRE, GDMT rules)
```
- Services must be pure and testable without active database or HTTP connections.
- Mathematical functions must accept typed arguments and return typed results with no side effects.
