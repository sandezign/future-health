# Implementation Plan: Multi-Modal Vision & OCR Ingestion Engine (Snap-to-Care Gateway)

**Branch**: `005-vision-ocr-ingestion` | **Date**: 2026-10-21 | **Spec**: [spec.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/specs/005-vision-ocr-ingestion/spec.md)

## Summary
Implement the pure Python image preprocessing, OCR extraction, LOINC clinical normalization, and HL7 FHIR R4 document builder services for the Snap-to-Care Vision Ingestion Gateway. Development follows TDD: write test fixtures and unit tests for blur gating, entity normalization, unit conversion, and FHIR generation first, then implement the services and FastAPI REST endpoints.

## Technical Context
- **Language**: Python 3.11+
- **Framework**: FastAPI, Pydantic v2
- **Computer Vision / OCR**: OpenCV (`cv2`) for Laplacian blur detection and deskewing; Layout parser with offline benchmark fixtures.
- **Testing**: `pytest`, `pytest-asyncio`
- **Interoperability**: HL7 FHIR R4 (`DiagnosticReport`, `Observation`), LOINC standard codes
- **Directory Layout**:
  - `backend/app/models/ocr.py`: Pydantic models for OCR requests, bounding boxes, extracted analytes, and HITL items.
  - `backend/app/services/ocr/preprocessor.py`: Image quality gating (Laplacian blur test) and dewarping.
  - `backend/app/services/ocr/layout_parser.py`: Tabular analyte extraction and bounding-box coordinates.
  - `backend/app/services/ocr/normalizer.py`: LOINC entity mapping and metric unit conversion ($\mu\text{mol/L} \rightarrow \text{mg/dL}$).
  - `backend/app/services/ocr/fhir_builder.py`: HL7 FHIR R4 resource generation.
  - `backend/app/api/endpoints/ocr.py`: FastAPI routes (`/ingest-lab-slip`, `/hitl-queue`, `/verify`).
  - `backend/tests/test_ocr_ingestion.py`: Unit tests for the OCR pipeline.

## Constitution Check
- [x] Principle I (Clinical Rigor): Standard LOINC codes (`2160-0`, `33914-3`, `2888-6`) and standard conversion formulas ($88.42$).
- [x] Principle II (TDD First): Test cases with clear slips, blurry images, and mock fixtures created before service implementation.
- [x] Principle III (Architecture Boundaries): Pure processing services separated from HTTP routers.
- [x] Principle IV (Clinical Safety): Hard rejection on unreadable images; Human-in-the-Loop review for extractions $< 90\%$ confidence.

## Execution Steps

### Phase 1: Test Suite & Fixtures (TDD First)
1. `backend/tests/test_ocr_ingestion.py`:
   - Test blur filter: verify rejection of synthetic blurred arrays ($\text{variance} < 100$) and acceptance of sharp images ($\ge 100$).
   - Test LOINC normalization: verify $\mu\text{mol/L} \rightarrow \text{mg/dL}$ conversion, dipstick protein tiering.
   - Test bounding box serialization: verify relative coordinate ranges $[0.0, 1.0]$.
   - Test confidence thresholding: verify records $<0.90$ are flagged for `HITL_REVIEW_REQUIRED`.
   - Test FHIR R4 builder: verify valid `DiagnosticReport` structure with observation extensions.

### Phase 2: Pydantic Schemas & Services
1. `backend/app/models/ocr.py`: Schemas for `BoundingBox`, `ExtractedBiomarker`, `OCRResult`, `HITLQueueItem`, and `NurseVerificationRequest`.
2. `backend/app/services/ocr/preprocessor.py`: Laplacian variance calculation, image resizing, and deskew logic.
3. `backend/app/services/ocr/normalizer.py`: LOINC registry mapping, unit conversions, and confidence scoring.
4. `backend/app/services/ocr/layout_parser.py`: Document layout parsing with offline demo fixtures (Prodia, SEHA, PureHealth).
5. `backend/app/services/ocr/fhir_builder.py`: Serialization into FHIR R4 resources.

### Phase 3: FastAPI Endpoints & Integration
1. `backend/app/api/endpoints/ocr.py`:
   - `POST /api/v1/ocr/ingest-lab-slip`: Multi-part upload with automated validation.
   - `GET /api/v1/ocr/hitl-queue`: List pending low-confidence records.
   - `POST /api/v1/ocr/verify`: Nurse review submission updating record status.
2. Register OCR router in `backend/app/main.py`.
3. Verify test coverage: run `pytest backend/tests/test_ocr_ingestion.py`.
