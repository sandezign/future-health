# Implementation Plan: Algorithmic Trajectory Engine

**Branch**: `001-algorithmic-trajectory-engine` | **Date**: 2026-10-20 | **Spec**: [spec.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/001-algorithmic-trajectory-engine/spec.md)

## Summary
Implement the pure Python clinical calculation services and FastAPI endpoints for CKD-EPI 2021 eGFR, OLS eGFR slope, Tangri 4-variable KFRE, and KDIGO 2024 GDMT clinical decision support. Development strictly follows TDD: write clinical benchmark tests first, then implement pure services, then wire FastAPI REST endpoints.

## Technical Context
- **Language**: Python 3.11+
- **Framework**: FastAPI, Pydantic v2
- **Testing**: `pytest`, `pytest-asyncio`
- **Math/Statistics**: Pure Python + `math` / `statistics` / `numpy` (deterministic, zero side-effects)
- **Directory Layout**:
  - `backend/app/core/`: Constants, clinical coefficients
  - `backend/app/models/`: Pydantic schemas (patient, trajectory, GDMT)
  - `backend/app/services/`: Pure clinical services (`ckd_epi.py`, `egfr_slope.py`, `kfre.py`, `gdmt_rules.py`)
  - `backend/app/api/endpoints/`: FastAPI routers (`patients.py`, `clinical_decision.py`)
  - `backend/tests/`: Benchmark unit and integration tests

## Constitution Check
- [x] Principle I (Clinical Rigor): Cites NEJM 2021, JAMA 2016, KDIGO 2024.
- [x] Principle II (TDD First): Failing benchmark tests written before implementation.
- [x] Principle III (Architecture Boundaries): Pure services with no DB or HTTP dependencies.
- [x] Principle IV (Clinical Safety): Hard contraindication stops, 4-week reflex labs, hemodynamic dip reassurance.

## Execution Steps

### Phase 1: Test Suite (TDD Benchmark Fixtures)
1. `backend/tests/test_ckd_epi.py`:
   - Test male & female across creatinine spectrum ($0.4 - 10.0\text{ mg/dL}$).
   - Test boundary at $\kappa$ ($0.7$ female, $0.9$ male).
   - Test invalid inputs (negative/zero creatinine, invalid sex).
2. `backend/tests/test_egfr_slope.py`:
   - Test 2-point, 3-point, 5-point serial observations over months/years.
   - Test rapid progression classification (slope $\le -3.0$).
   - Test edge cases (fewer than 2 points, same-day duplicate dates).
3. `backend/tests/test_kfre.py`:
   - Test Tangri 4-var non-North American baseline survival ($S_0(2) = 0.9832, S_0(5) = 0.9365$).
   - Test risk categorizations: Low ($<3\%$), Intermediate ($3\%-15\%$), High ($>15\%$).
   - Test uACR unit normalization.
4. `backend/tests/test_gdmt_rules.py`:
   - Test 18-cell KDIGO grid mapping.
   - Test SGLT2i contraindication on $\text{eGFR} < 20$.
   - Test ACEi/ARB contraindication on $\text{K}^+ > 5.5$.
   - Verify mandatory 4-week reflex lab order inclusion.

### Phase 2: Implementation of Services
1. `backend/app/core/clinical_constants.py`: Constants for CKD-EPI, KFRE coefficients, KDIGO thresholds.
2. `backend/app/services/ckd_epi.py`: Pure race-free CKD-EPI 2021 equation.
3. `backend/app/services/egfr_slope.py`: OLS regression, progression categorization, projected dialysis date.
4. `backend/app/services/kfre.py`: 4-variable linear predictor and survival exponentiation.
5. `backend/app/services/gdmt_rules.py`: KDIGO grid evaluation and GDMT order generation.

### Phase 3: Pydantic Schemas & API Endpoints
1. `backend/app/models/patient.py` & `backend/app/models/trajectory.py`: Schemas for observations, slopes, GDMT orders.
2. `backend/app/api/endpoints/patients.py`: `GET /api/v1/patients`, `GET /api/v1/patients/{id}/trajectory`.
3. `backend/app/api/endpoints/clinical_decision.py`: `POST /api/v1/clinical-decision/gdmt`.
4. Run full test suite: `pytest backend/tests/` and verify 100% pass.
