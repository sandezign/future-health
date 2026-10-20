# RENAL-PULSE — Agent Guide

RENAL-PULSE is a cardiorenal population health engine built for the **Future Health Digital Innovation Challenge** (Abu Dhabi Global Initiative / Hack2skill). It bridges the "Signal-to-Action Translation Chasm" by converting routine, latent primary care lab data (serum creatinine, blood pressure, dipstick protein) into upstream prevention before patients develop irreversible End-Stage Kidney Disease (ESKD) requiring lifelong dialysis.

The solution provides:
1. An **Algorithmic Trajectory Engine** that computes CKD-EPI 2021 eGFR slopes and the Tangri 4-variable Kidney Failure Risk Equation (KFRE).
2. A **Doctor Clinical Copilot** (React 19, Feature-Sliced Design) delivering 1-click Guideline-Directed Medical Therapy (GDMT: SGLT2i + ARB) order sets.
3. A **Behavioral WhatsApp Engagement Agent** that overcomes asymptomatic patient denial and secures clinic attendance.
4. A **Population Health Command Center** visualizing regional cardiorenal heat maps and projected national insurance (BPJS / DoH) cost savings.

This file provides shared context for coding agents working in this repository. Rules live in `.agents/rules/`.

---

## Where the Truth Lives

| Need | Read |
|---|---|
| Strategic Blueprint & Research Synthesis | `docs/STRATEGIC_RESEARCH_BLUEPRINT.md` |
| Project Context & Competition Track | `docs/INITIAL_CONTEXT.md` |
| Track Alignment: Closing the Screening-to-Care Loop | `docs/CLOSING_THE_SCREENING_TO_CARE_LOOP.md` |
| Problem Space & User Discovery Research | `docs/research/PROBLEM_SPACE_DISCOVERY.md` |
| Product Requirements Document (PRD) | `docs/PRD-renal-pulse.md` |
| System Scope & User Flow Specification | `docs/USER_FLOWS.md` |
| Clinical Formulas & Validation Criteria | `docs/CLINICAL_FORMULAS.md` |
| Technical Architecture & Schemas | `docs/ARCHITECTURE.md` |
| Data Model & Synthetic Schema | `data/schemas/patient_schema.json` |
| Frontend Conventions & FSD Rules | `.agents/rules/30-frontend.md` |
| Clinical Decision Safety Rules | `.agents/rules/40-clinical-safety.md` |
| Active Tasks & Sprints | `docs/specs/sprint-plan.md` |

---

## How We Work

1. **Spec & Task First:** Work from explicit task lists in `docs/specs/`. Never start implementation without clear acceptance criteria.
2. **Feature-Sliced Design (FSD):** The frontend strictly obeys:
   `app → pages → widgets → features → entities → shared`.
   Imports only flow downward. Cross-imports within the same slice are banned.
3. **Clinical Rigor:** Every risk score or clinical alert must cite its guideline origin (KDIGO 2024, KFRE JAMA 2016, CKD-EPI NEJM 2021). Never invent clinical formulas.
4. **TDD for Algorithms:** For math and risk engines, write the failing test with published clinical benchmark data first, then implement the code to pass.
5. **Verify Before Declaring Complete:** Always run `make check` or test commands and verify exit codes before completing turns.

---

## Commands

| Task | Command |
|---|---|
| Install all dependencies | `make setup` |
| Run full stack locally (API :8000, Vite :5173) | `make dev` |
| Run all quality gates (lint, types, tests) | `make check` |
| Run frontend development server | `make dev-fe` |
| Run backend development server | `make dev-be` |
| Run backend unit tests | `make test-be` |
| Run frontend unit tests | `make test-fe` |
| Regenerate synthetic patient data | `make synth` |
