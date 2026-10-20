# Tasks: Algorithmic Trajectory Engine

**Feature Branch**: `001-algorithmic-trajectory-engine` | **Date**: 2026-10-20  
**Specification**: [spec.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/001-algorithmic-trajectory-engine/spec.md)  
**Implementation Plan**: [plan.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/001-algorithmic-trajectory-engine/plan.md)

---

## Task List

### Sprint 1.1: Clinical Benchmark Tests (TDD First)
- [ ] **TASK-001**: Create `backend/tests/test_ckd_epi.py` with published NEJM 2021 validation benchmarks.
- [ ] **TASK-002**: Create `backend/tests/test_egfr_slope.py` with serial multi-date test fixtures and progression thresholds.
- [ ] **TASK-003**: Create `backend/tests/test_kfre.py` with Tangri JAMA 2016 validation values and baseline survival.
- [ ] **TASK-004**: Create `backend/tests/test_gdmt_rules.py` testing KDIGO 2024 order sets, contraindications, and reflex lab orders.

### Sprint 1.2: Clinical Services Implementation
- [ ] **TASK-005**: Implement `backend/app/core/clinical_constants.py` containing validated mathematical coefficients and KDIGO definitions.
- [ ] **TASK-006**: Implement `backend/app/services/ckd_epi.py` (race-free CKD-EPI 2021 equation).
- [ ] **TASK-007**: Implement `backend/app/services/egfr_slope.py` (OLS slope, progressor categorization, dialysis horizon).
- [ ] **TASK-008**: Implement `backend/app/services/kfre.py` (Tangri 4-variable KFRE 2-yr & 5-yr risks).
- [ ] **TASK-009**: Implement `backend/app/services/gdmt_rules.py` (1-click GDMT order set generator with safety screens).

### Sprint 1.3: Data Models & FastAPI Endpoints
- [ ] **TASK-010**: Define Pydantic models in `backend/app/models/` for Patient, Observation, Trajectory, and GDMT.
- [ ] **TASK-011**: Implement `GET /api/v1/patients` registry endpoint.
- [ ] **TASK-012**: Implement `GET /api/v1/patients/{id}/trajectory` endpoint.
- [ ] **TASK-013**: Implement `POST /api/v1/clinical-decision/gdmt` endpoint.
- [ ] **TASK-014**: Write integration tests in `backend/tests/test_api_endpoints.py`.
- [ ] **TASK-015**: Run `make test-be` and verify 100% test pass.
