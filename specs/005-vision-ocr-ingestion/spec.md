# Feature Specification: Multi-Modal Vision & OCR Ingestion Engine (Snap-to-Care Gateway)

**Feature Branch**: `005-vision-ocr-ingestion`  
**Created**: 2026-10-21  
**Status**: Ready for Implementation  
**Input**: Sprint Plan Phase 1b & Technical Specification ([docs/specs/005-vision-ocr-ingestion.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/specs/005-vision-ocr-ingestion.md))

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Multi-Modal Document Upload & Quality Gating (Priority: P1)
Ingest raw smartphone camera photos (JPEG/PNG) and scanned PDFs of paper lab reports, validating image clarity before downstream extraction.

**Why this priority**: Frontline community screening frequently suffers from motion blur, low lighting, or poor focus that corrupts OCR accuracy.

**Independent Test**: Pass blurred synthetic images (Laplacian variance $< 100$) and clear test lab slips (variance $\ge 100$) and verify HTTP responses.

**Acceptance Scenarios**:
1. **Given** an image with Laplacian variance $\ge 100$, **When** posted to `/api/v1/ocr/ingest-lab-slip`, **Then** pass the quality gate and proceed to parsing.
2. **Given** a blurry image with Laplacian variance $< 100$, **When** posted, **Then** return HTTP 422 with status `REJECTED_BLURRY` and actionable user guidance to retake under stable lighting.
3. **Given** an unsupported file type, **When** posted, **Then** return HTTP 415 unsupported media type.

---

### User Story 2 - Zero-Template Layout AI & Biomarker Normalization (Priority: P1)
Extract clinical analytes from unstructured lab slips across diverse layouts (e.g., Prodia, PureHealth, SEHA) and normalize them to standardized LOINC codes and metric units.

**Why this priority**: Lab slips have divergent column layouts, units ($\mu\text{mol/L}$ vs. $\text{mg/dL}$), and nomenclature.

**Independent Test**: Test extraction across varied lab slip fixtures for Serum Creatinine, eGFR, Dipstick Protein, and Blood Pressure.

**Acceptance Scenarios**:
1. **Given** Serum Creatinine in $\mu\text{mol/L}$ (e.g., $106.1\ \mu\text{mol/L}$), **When** normalized, **Then** map to LOINC `2160-0` and convert to $1.20\text{ mg/dL}$ ($106.1 / 88.42$).
2. **Given** Dipstick Protein values (`"++"` or `"2+"`), **When** normalized, **Then** map to LOINC `2888-6` and categorical stage `A2` / `A3`.
3. **Given** eGFR stated on slip, **When** normalized, **Then** map to LOINC `33914-3` and cross-verify against computed CKD-EPI 2021 value.

---

### User Story 3 - Source Visual Citation & Bounding Box Coordinates (Priority: P1)
Track and serialize normalized 2D bounding boxes (`[ymin, xmin, ymax, xmax]`) for every extracted biomarker to enable 1-click clinical visual verification.

**Why this priority**: Clinicians must never be asked to trust ungrounded black-box AI; visual bounding boxes provide 100% auditability.

**Acceptance Scenarios**:
1. **Given** an extracted analyte, **Then** return normalized relative coordinates `[ymin, xmin, ymax, xmax]` in range $[0.0, 1.0]$.
2. **Given** client rendering with lightbox, **Then** the bounding box visually matches the exact printed text snippet on the document image.

---

### User Story 4 - Confidence Gating & Human-in-the-Loop (HITL) Queue (Priority: P1)
Route low-confidence extractions ($<90\%$) to a triage nurse review queue while auto-promoting high-confidence records ($\ge 90\%$) directly to the trajectory engine.

**Acceptance Scenarios**:
1. **Given** extraction confidence $\ge 0.90$, **Then** set status `AUTO_PROMOTED` and dispatch directly to patient trajectory registry.
2. **Given** extraction confidence $< 0.90$, **Then** enqueue document into `GET /api/v1/ocr/hitl-queue` with status `HITL_REVIEW_REQUIRED`.
3. **Given** triage nurse reviews and submits `POST /api/v1/ocr/verify`, **Then** update status to `NURSE_VERIFIED` with nurse ID and promote record.

---

### User Story 5 - Interoperable HL7 FHIR R4 Bundle Assembly (Priority: P2)
Assemble extracted biomarkers into compliant HL7 FHIR R4 `DiagnosticReport` and `Observation` bundles with custom bounding box extensions.

**Acceptance Scenarios**:
1. Generate valid JSON representation conforming to FHIR R4 resource definitions.
2. Observation resources contain LOINC code, normalized numeric value, standard UCUM units, and source image bounding box extension.

---

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: Preprocessor MUST compute OpenCV Laplacian blur variance and enforce threshold $\ge 100$.
- **FR-002**: System MUST support JPEG, PNG, and multi-page PDF ingestion up to 15 MB.
- **FR-003**: Normalizer MUST map recognized biomarkers to LOINC (`2160-0`, `33914-3`, `2888-6`, `85354-9`).
- **FR-004**: System MUST convert International System ($\mu\text{mol/L}$) creatinine to conventional units ($\text{mg/dL}$) using divisor $88.42$.
- **FR-005**: Extractor MUST output normalized bounding box tuples `[ymin, xmin, ymax, xmax]` for each analyte.
- **FR-006**: Confidence gate MUST partition records into auto-promoted ($\ge 90\%$) vs. nurse queue ($< 90\%$).
- **FR-007**: API MUST expose `/ingest-lab-slip`, `/hitl-queue`, and `/verify` endpoints.
- **FR-008**: System MUST assemble standard HL7 FHIR R4 `DiagnosticReport` bundles.

## Success Criteria *(mandatory)*
- **SC-001 (Extraction Accuracy):** Field extraction accuracy $\ge 95\%$ on standard printed laboratory slips.
- **SC-002 (Speed):** End-to-end processing latency $< 2.0\text{ seconds}$ per document.
- **SC-003 (Safety Rejection):** 100% of blurry images ($\text{variance} < 100$) rejected with retry prompt.
- **SC-004 (Traceability):** 100% of extracted values link to valid bounding box coordinates.
