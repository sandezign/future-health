# Tasks: Multi-Modal Vision & OCR Ingestion Engine (Snap-to-Care Gateway)

**Feature Branch**: `005-vision-ocr-ingestion` | **Date**: 2026-10-21  
**Specification**: [spec.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/005-vision-ocr-ingestion/spec.md)  
**Implementation Plan**: [plan.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/005-vision-ocr-ingestion/plan.md)

---

## Task List

### Sprint 1b.1: OCR Test Suite & Fixtures (TDD First)
- [ ] **TASK-001**: Create `backend/tests/test_ocr_ingestion.py` with test fixtures for sharp and blurred images.
- [ ] **TASK-002**: Write unit tests for Laplacian blur variance filter ($\text{variance} < 100$ rejected, $\ge 100$ accepted).
- [ ] **TASK-003**: Write unit tests for LOINC entity normalization and unit conversion ($\mu\text{mol/L} \rightarrow \text{mg/dL}$).
- [ ] **TASK-004**: Write unit tests for bounding box coordinate validation and confidence score thresholding.
- [ ] **TASK-005**: Write unit tests for HL7 FHIR R4 `DiagnosticReport` bundle generation.

### Sprint 1b.2: Data Models & Core Services
- [ ] **TASK-006**: Create `backend/app/models/ocr.py` with Pydantic schemas (`BoundingBox`, `ExtractedBiomarker`, `OCRResult`, `HITLQueueItem`).
- [ ] **TASK-007**: Implement `backend/app/services/ocr/preprocessor.py` (Laplacian variance blur detector & image pre-processing).
- [ ] **TASK-008**: Implement `backend/app/services/ocr/normalizer.py` (LOINC mapping, unit conversion, confidence scoring).
- [ ] **TASK-009**: Implement `backend/app/services/ocr/layout_parser.py` (Tabular biomarker parser with realistic offline demo fixtures for Prodia, SEHA, PureHealth).
- [ ] **TASK-010**: Implement `backend/app/services/ocr/fhir_builder.py` (HL7 FHIR R4 resource serializer with bounding box extensions).

### Sprint 1b.3: FastAPI Endpoints & Integration
- [ ] **TASK-011**: Implement `backend/app/api/endpoints/ocr.py` with routes:
  - `POST /api/v1/ocr/ingest-lab-slip` (Multi-part upload handler)
  - `GET /api/v1/ocr/hitl-queue` (Pending triage nurse items)
  - `POST /api/v1/ocr/verify` (Nurse review sign-off)
- [ ] **TASK-012**: Register OCR router in `backend/app/main.py`.
- [ ] **TASK-013**: Write API endpoint integration tests in `backend/tests/test_ocr_api.py`.
- [ ] **TASK-014**: Run `pytest backend/tests/test_ocr_ingestion.py` and verify 100% test pass.
