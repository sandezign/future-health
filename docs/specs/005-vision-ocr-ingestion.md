# Feature Specification: Multi-Modal Vision & OCR Ingestion Engine (Snap-to-Care Gateway)

**Feature Branch**: `005-vision-ocr-ingestion`  
**Created**: 2026-10-21  
**Status**: Ready for Implementation  
**Specification Owner**: RENAL-PULSE Vision AI & Clinical Data Ingestion Team  
**Primary Standards**: HL7 FHIR R4 (DiagnosticReport, Observation), LOINC, SNOMED CT, KDIGO 2024

---

## 1. Summary & Objectives

Over 85% of at-risk chronic kidney disease patients receive their screening results on printed paper slips from private standalone laboratories (e.g., Prodia, Kimia Farma, PureHealth, SEHA) or visa medical checkups. Because these results are not electronically connected to primary care EHRs, they sit unindexed in drawers or physical folders.

The **Snap-to-Care Gateway** provides a zero-hardware, software-based Document AI pipeline that converts raw smartphone camera photos and scanned PDF reports into structured, interoperable **HL7 FHIR R4 `DiagnosticReport` and `Observation` resources** in $<2\text{ seconds}$.

### Core Responsibilities:
1. **Multi-Modal Document Upload:** Ingest image payloads (JPEG, PNG) and PDF reports via REST API.
2. **Automated Image Quality Gating:** OpenCV Laplacian blur variance detection ($\ge 100$) and perspective correction.
3. **Zero-Template Layout AI & Table Extraction:** Parse divergent laboratory formats into normalized clinical entities: Serum Creatinine, eGFR, Dipstick Protein, Blood Pressure, and Fasting Glucose / HbA1c.
4. **Clinical Vocabulary Normalization:** Map extracted raw strings and units to standardized LOINC codes and convert units (e.g., $\mu\text{mol/L} \rightarrow \text{mg/dL}$).
5. **Confidence Gating & Human-in-the-Loop (HITL) Queue:** High confidence ($\ge 90\%$) auto-promotes to the trajectory engine; low confidence ($<90\%$) routes to a nurse triage queue with highlighted bounding-box overlays.
6. **Source Visual Citation:** Track spatial bounding box coordinates (`[ymin, xmin, ymax, xmax]`) for every extracted biomarker to power interactive lightbox verification in the Doctor Clinical Copilot.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Multi-Modal Document Upload & Quality Gating (Priority: P0)
As an administrative intake nurse, patient, or primary care doctor,  
I want to upload a smartphone camera photo or PDF of a printed laboratory report and receive immediate feedback on image legibility,  
So that unreadable or blurry images are prevented from corrupting clinical decision algorithms.

* **Independent Test:** Submit clear sample lab slips vs. deliberately blurred or low-light images; verify that blurry images ($\text{variance} < 100$) return HTTP 422 with actionable guidance.
* **Acceptance Scenarios:**
  1. **Given** a clear JPEG/PNG image of a lab report with resolution $\ge 1200 \times 1600$, **When** passed to the image preprocessor, **Then** Laplacian blur score is calculated, verified $\ge 100$, and promoted to OCR parsing.
  2. **Given** a blurry photo with Laplacian variance $<100$, **When** evaluated, **Then** return HTTP 422 with `BLURRY_IMAGE_REJECTED` and prompt *"Please retake photo in bright light and hold camera steady"*.
  3. **Given** a skewed or tilted document, **When** preprocessed, **Then** apply automatic Hough line transform and four-point perspective correction.

---

### User Story 2 - Zero-Template Layout-Aware Table & Analyte Extraction (Priority: P0)
As the clinical ingestion engine,  
I want to parse tabular rows and key-value pairs from diverse laboratory formats without requiring hardcoded per-laboratory templates,  
So that reports from Prodia, Kimia Farma, PureHealth, SEHA, or regional clinics are reliably ingested.

* **Target Biomarkers & LOINC Mappings:**

| Analyte Target | Primary LOINC | Accepted Aliases / OCR Strings | Standard Unit | Alternative Unit & Conversion |
| :--- | :--- | :--- | :--- | :--- |
| **Serum Creatinine** | `2160-0` | `Creatinine`, `Kreatinin Darah`, `S-Creatinine`, `Cr` | `mg/dL` | $\mu\text{mol/L} \times 0.0113 = \text{mg/dL}$ |
| **Estimated GFR** | `33914-3` | `eGFR`, `e-GFR`, `LFG`, `Glomerular Filtration Rate` | `mL/min/1.73m2` | — |
| **Dipstick Protein** | `2888-6` | `Urine Protein`, `Protein Urin`, `Albumin Urin`, `Proteinuria` | Qualitative (`NEG`, `TRACE`, `1+`, `2+`, `3+`, `4+`) | $\text{mg/dL}$ mapped to qualitative tier |
| **Blood Pressure** | `85354-9` | `Blood Pressure`, `Tekanan Darah`, `Tensi`, `TD`, `BP` | `mmHg` | Parsed into Systolic (`8480-6`) and Diastolic (`8462-4`) |
| **Fasting Blood Glucose**| `1558-6` | `Fasting Glucose`, `Glukosa Puasa`, `GDP`, `FPG` | `mg/dL` | $\text{mmol/L} \times 18.0182 = \text{mg/dL}$ |
| **HbA1c** | `4548-4` | `HbA1c`, `Glycated Hemoglobin`, `A1C` | `%` | $\text{mmol/mol}$ converted to $\%$ |

* **Acceptance Scenarios:**
  1. **Given** a lab report displaying `"Creatinine: 1.4 mg/dL"`, **When** parsed, **Then** analyte is recognized as LOINC `2160-0`, numeric value is `1.4`, unit is `"mg/dL"`, and confidence is recorded.
  2. **Given** a lab report from UAE displaying `"Creatinine: 124 umol/L"`, **When** parsed, **Then** value is automatically normalized to `1.40 mg/dL` with conversion flag logged.
  3. **Given** a qualitative urinalysis row `"Protein: ++"`, **When** parsed, **Then** mapped to `"2+"` and LOINC `2888-6`.

---

### User Story 3 - Human-in-the-Loop (HITL) Confidence Gating & Nurse Queue (Priority: P0)
As a clinical safety supervisor or clinic intake nurse,  
I want any OCR extraction with confidence $<90\%$ on key renal analytes to be held in an administrative verification queue,  
So that no questionable or hallucinated clinical data ever reaches the automated prescribing engine.

* **Acceptance Scenarios:**
  1. **Given** an extraction where all analytes have confidence scores $\ge 0.90$, **When** processed, **Then** status is set to `AUTO_VERIFIED` and immediately exported as an active FHIR bundle.
  2. **Given** an extraction where Serum Creatinine has a confidence score of $0.82$ ($<0.90$) due to paper crease, **When** processed, **Then** status is set to `REQUIRES_HUMAN_REVIEW` and enqueued in `GET /api/v1/ocr/hitl-queue`.
  3. **Given** a nurse inspecting the low-confidence record, **When** the nurse confirms or edits the value in $<5\text{ seconds}$ via `POST /api/v1/ocr/verify`, **Then** status transitions to `HUMAN_VERIFIED` and is pushed to the trajectory engine.

---

### User Story 4 - Source Visual Citation & Bounding Box Generation (Priority: P0)
As a frontline primary care physician,  
I want to click any biomarker badge on my Clinical Copilot to see the original scanned paper slip with an interactive bounding box,  
So that I can verify the laboratory report with my own eyes before signing a GDMT prescription.

* **Acceptance Scenarios:**
  1. **Given** an extracted analyte, **When** serialized, **Then** include normalized coordinate bounds:
     `{"box_2d": [ymin, xmin, ymax, xmax], "page": 1}` normalized to a $0–1000$ coordinate grid.
  2. **Given** the Doctor Copilot UI, **When** physician clicks the `"Source Citation"` icon beside Creatinine, **Then** open a modal displaying the document image with a high-contrast green bounding box centered over the text.

---

### User Story 5 - Interoperable HL7 FHIR R4 Bundle Assembly (Priority: P1)
As a population health integration service,  
I want the extracted lab data converted into standard HL7 FHIR R4 `DiagnosticReport` and `Observation` bundles,  
So that records can be directly merged with external HIE systems (Abu Dhabi Malaffi and Indonesia SatuSehat).

* **Acceptance Scenarios:**
  1. Returns a valid FHIR `Bundle` of type `transaction` containing:
     * One `DiagnosticReport` resource referencing the laboratory name, specimen collection timestamp, and issued status.
     * Distinct `Observation` resources for each parsed analyte (Creatinine, eGFR, Dipstick Protein, BP).
     * Bounding box metadata embedded inside an `extension` on each `Observation`.

---

## 3. Data Schemas & API Specifications

### 3.1 Upload & Ingestion Endpoint: `POST /api/v1/ocr/ingest-lab-slip`

#### Request (Multi-part Form Data):
```http
POST /api/v1/ocr/ingest-lab-slip HTTP/1.1
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="lab_slip_prodia_01.jpg"
Content-Type: image/jpeg

<binary image data>
------WebKitFormBoundary
Content-Disposition: form-data; name="patient_id"

PAT-89210
------WebKitFormBoundary
Content-Disposition: form-data; name="capture_channel"

WHATSAPP_UPLOAD
------WebKitFormBoundary--
```

#### Successful Response (`200 OK`):
```json
{
  "scan_id": "scn_20261021_94812",
  "patient_id": "PAT-89210",
  "ingested_at": "2026-10-21T08:12:00Z",
  "overall_confidence": 0.942,
  "status": "AUTO_VERIFIED",
  "image_quality": {
    "blur_variance": 248.5,
    "resolution_dpi": 300,
    "is_acceptable": true
  },
  "extracted_biomarkers": [
    {
      "analyte_name": "Serum Creatinine",
      "loinc_code": "2160-0",
      "raw_text": "Kreatinin Darah: 1.4 mg/dL",
      "normalized_value": 1.4,
      "unit": "mg/dL",
      "reference_range": "0.7 - 1.2",
      "confidence": 0.97,
      "bounding_box": {
        "page": 1,
        "ymin": 412,
        "xmin": 120,
        "ymax": 445,
        "xmax": 580
      }
    },
    {
      "analyte_name": "Estimated GFR",
      "loinc_code": "33914-3",
      "raw_text": "eGFR: 52 mL/min/1.73m2",
      "normalized_value": 52.0,
      "unit": "mL/min/1.73m2",
      "reference_range": "> 60",
      "confidence": 0.95,
      "bounding_box": {
        "page": 1,
        "ymin": 460,
        "xmin": 120,
        "ymax": 492,
        "xmax": 580
      }
    },
    {
      "analyte_name": "Dipstick Protein",
      "loinc_code": "2888-6",
      "raw_text": "Protein Urin: 2+",
      "normalized_value": "2+",
      "unit": "qualitative",
      "reference_range": "Negative",
      "confidence": 0.91,
      "bounding_box": {
        "page": 1,
        "ymin": 520,
        "xmin": 120,
        "ymax": 550,
        "xmax": 420
      }
    }
  ],
  "fhir_bundle_url": "/api/v1/patients/PAT-89210/fhir/bundle"
}
```

#### Blurry Image Error Response (`422 Unprocessable Entity`):
```json
{
  "error_code": "IMAGE_QUALITY_DEFECT",
  "message": "Image resolution or sharpness is insufficient for clinical safety.",
  "metrics": {
    "blur_variance": 42.1,
    "threshold_required": 100.0
  },
  "user_guidance": "Foto buram atau kurang cahaya. Mohon pegang kamera dengan stabil di tempat terang dan ulangi pengambilan foto."
}
```

---

### 3.2 Human-in-the-Loop Verification Endpoint: `POST /api/v1/ocr/verify`

#### Request Payload:
```json
{
  "scan_id": "scn_20261021_94812",
  "verified_by_user_id": "NURSE-041",
  "corrections": [
    {
      "loinc_code": "2160-0",
      "corrected_value": 1.4,
      "action": "CONFIRMED"
    }
  ],
  "verification_notes": "Crease over creatinine line resolved by visual inspection."
}
```

#### Successful Response (`200 OK`):
```json
{
  "scan_id": "scn_20261021_94812",
  "status": "HUMAN_VERIFIED",
  "verified_at": "2026-10-21T08:14:30Z",
  "dispatched_to_trajectory_engine": true
}
```

---

## 4. Implementation Details & File Layout

```
backend/app/
├── api/
│   └── endpoints/
│       └── ocr.py                 # FastAPI endpoints for upload, HITL queue, and verification
├── services/
│   └── ocr/
│       ├── __init__.py
│       ├── preprocessor.py        # OpenCV blur variance, deskew, contrast normalization
│       ├── layout_parser.py       # Zero-template tabular extraction & bounding box mapping
│       ├── normalizer.py          # LOINC entity linking & unit conversions
│       └── fhir_builder.py        # HL7 FHIR R4 DiagnosticReport & Observation generator
└── tests/
    └── test_ocr_ingestion.py      # Unit & benchmark test suite with synthetic lab slips
```

---

## 5. Security, Privacy & Compliance Guardrails

1. **Ephemeral Processing in RAM:** Raw image files submitted by patients or clinics are held in memory during OCR inference. Once bounding boxes and normalized numerical values are generated, image files are written to encrypted local disk storage with strict access control.
2. **PII Masking on WhatsApp:** Extracted laboratory slips originating from WhatsApp chats are stripped of national identification numbers (NIK / Emirates ID) before being broadcast over external webhooks.
3. **Audit Trail:** Every auto-verified or nurse-corrected analyte logs an immutable audit entry recording user ID, timestamp, and raw OCR confidence score.

---

## 6. Verification & Test Plan

1. **Blur Detection Unit Tests:** Execute unit tests against synthetic clear vs. blurred images, verifying that Laplacian variance accurately discriminates between sharp ($\ge 100$) and blurry ($<100$) inputs.
2. **Multi-Unit Normalization Tests:** Verify that creatinine values given in $\mu\text{mol/L}$ are mathematically converted to $\text{mg/dL}$ within a tolerance of $\pm 0.01\text{ mg/dL}$.
3. **FHIR Validation:** Verify that generated JSON bundles validate against the official HL7 FHIR R4 schema with zero missing mandatory fields.
4. **End-to-End Pipeline Verification:** Test upload of a real-world lab slip photo $\rightarrow$ OCR parsing $\rightarrow$ FHIR bundle $\rightarrow$ trigger CKD-EPI 2021 calculation in $<2\text{ seconds}$.
