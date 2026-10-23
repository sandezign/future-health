# Feature Specification: Algorithmic Trajectory Engine (Backend Core)

**Feature Branch**: `001-algorithmic-trajectory-engine`  
**Created**: 2026-10-20  
**Status**: Ready for Implementation  
**Specification Owner**: RENAL-PULSE Core Clinical Engineering  
**Primary Standards**: KDIGO 2024, Tangri JAMA 2016 (KFRE), Inker NEJM 2021 (CKD-EPI 2021 Refit)

---

## 1. Summary & Objectives

The **Algorithmic Trajectory Engine** is the mathematical and clinical foundation of RENAL-PULSE. It transforms routine, latent primary care lab data (serum creatinine, dipstick protein, age, sex, and blood pressure) into continuous progression trajectories and actionable risk predictions.

This engine eliminates the "Signal-to-Action Translation Chasm" by:
1. Accurately computing race-free eGFR via CKD-EPI 2021.
2. Calculating longitudinal Ordinary Least Squares (OLS) eGFR slope to detect silent rapid progressors ($<-3\text{ mL/min/1.73m}^2/\text{yr}$).
3. Calculating 2-year and 5-year ESKD risk via the Tangri 4-Variable KFRE.
4. Generating KDIGO 2024 guideline-directed 1-click GDMT order recommendations with automatic safety contraindication screening.
5. Exposing clean, typed REST API endpoints for frontend consumption.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Race-Free eGFR Calculation via CKD-EPI 2021 (Priority: P1)
As a clinical decision support system,  
I want to compute estimated Glomerular Filtration Rate (eGFR) using the race-free CKD-EPI 2021 creatinine equation,  
So that kidney function is accurately calculated without racial bias or outdated correction factors.

- **Why this priority:** Fundamental clinical primitive for all downstream classification, staging, and prescribing logic.
- **Independent Test:** Can be verified against published benchmark values in NEJM 2021 (Inker et al.) across combinations of sex, age (18–90), and serum creatinine ($0.4–12.0\text{ mg/dL}$).
- **Acceptance Scenarios:**
  1. **Given** a 55-year-old male with $S_{cr} = 1.2\text{ mg/dL}$, **When** calculating eGFR, **Then** result must equal $73.3 \pm 0.1\text{ mL/min/1.73m}^2$.
  2. **Given** a 62-year-old female with $S_{cr} = 0.6\text{ mg/dL}$, **When** calculating eGFR, **Then** result must equal $98.8 \pm 0.1\text{ mL/min/1.73m}^2$ using $\kappa = 0.7$, $\alpha = -0.241$, and $1.012$ sex multiplier.
  3. **Given** a patient with missing creatinine or $S_{cr} \le 0$, **When** passed to the service, **Then** a strict `ValueError` must be raised.

---

### User Story 2 - Longitudinal OLS eGFR Slope & Rapid Progression Classification (Priority: P1)
As a primary care physician,  
I want the system to compute the historical rate of kidney function loss ($\text{mL/min/1.73m}^2/\text{year}$) using Ordinary Least Squares linear regression over sequential observations,  
So that asymptomatic rapid progressors who appear to have "normal" static creatinine are immediately flagged.

- **Why this priority:** Identifies silent progressors who lose $>3\text{ mL/min/yr}$ before they cross into irreversible Stage 4 CKD.
- **Independent Test:** Feed synthetic serial observations spanning 12–36 months and verify calculated slope and classification.
- **Acceptance Scenarios:**
  1. **Given** 3 observations over 24 months dropping from $85 \rightarrow 72 \rightarrow 59\text{ mL/min/1.73m}^2$, **When** computing slope, **Then** slope is $-13.0\text{ mL/min/yr}$ and classified as `RAPID_PROGRESSION` ($\ge 3.0$ loss).
  2. **Given** observations with decline $< 1.0\text{ mL/min/yr}$, **When** computing slope, **Then** classified as `NORMAL_AGING_DECLINE`.
  3. **Given** fewer than 2 valid observations, **When** computing slope, **Then** return `None` with `INSUFFICIENT_DATA` status without crashing.

---

### User Story 3 - Tangri 4-Variable KFRE 2-Year & 5-Year Risk Calculation (Priority: P1)
As a healthcare provider or population health manager,  
I want to compute the Tangri 4-variable KFRE probability of progression to End-Stage Renal Disease (dialysis/transplant) at 2 years and 5 years,  
So that high-risk patients are triaged into urgent nephrology co-management and GDMT therapy.

- **Why this priority:** Validated predictive standard (JAMA 2016) used globally for dialysis risk quantification and specialist referral thresholds.
- **Independent Test:** Verify output against the published Tangri JAMA 2016 regression coefficients and baseline survival rates ($S_0(2) = 0.9832$, $S_0(5) = 0.9365$ for non-North American cohorts).
- **Acceptance Scenarios:**
  1. **Given** a 60-year-old male, $\text{eGFR} = 35\text{ mL/min/1.73m}^2$, $\text{uACR} = 450\text{ mg/g}$, Non-North American calibration, **When** computing KFRE, **Then** 2-year risk and 5-year risk are correctly computed and categorized as `HIGH_RISK` ($> 15\%$).
  2. **Given** uACR reported in $\text{mg/mmol}$, **When** passed with unit specification, **Then** the service converts to $\text{mg/g}$ (multiplier $8.84$) before evaluating the natural logarithm.

---

### User Story 4 - KDIGO 2024 Staging Grid & 1-Click GDMT Order Recommendation Engine (Priority: P1)
As a primary care doctor during a 3-minute consultation,  
I want an automated clinical decision support engine that evaluates eGFR and uACR against KDIGO 2024 to suggest 1-click GDMT order sets with safety contraindication checks,  
So that I can overcome therapeutic inertia and safely initiate organ-protective therapy.

- **Why this priority:** Overcomes the 82% therapeutic inertia rate in primary care by transforming complex guidelines into instant orders.
- **Independent Test:** Execute unit tests across the 18-cell KDIGO grid (G1–G5 $\times$ A1–A3) and verify generated order sets and contraindication flags.
- **Acceptance Scenarios:**
  1. **Given** patient with $\text{eGFR} = 42\text{ mL/min/1.73m}^2$ (G3b) and $\text{uACR} = 350\text{ mg/g}$ (A3) with no contraindications, **When** generating GDMT, **Then** system recommends:
     - SGLT2i: Dapagliflozin 10 mg once daily.
     - ARB: Losartan 50 mg once daily.
     - Reflex Safety Order: Serum potassium + creatinine at 4 weeks.
     - Reassurance note: Benign hemodynamic eGFR dip $\le 30\%$ anticipated.
  2. **Given** patient with $\text{eGFR} = 17\text{ mL/min/1.73m}^2$ ($<20$), **When** generating GDMT, **Then** SGLT2i is contraindicated for initiation; prompt specialist nephrology referral.
  3. **Given** patient with serum potassium $K^+ = 5.7\text{ mEq/L}$ ($>5.5$), **When** generating GDMT, **Then** ACEi/ARB is withheld with clear clinical safety warning.

---

### User Story 5 - REST API Endpoints for Patient Registry & Trajectories (Priority: P2)
As a frontend developer or external health system (Puskesmas / Malaffi),  
I want clean, well-documented FastAPI endpoints returning typed patient summaries, trajectories, and GDMT recommendations,  
So that the web client can seamlessly render risk charts and action cards.

- **Acceptance Scenarios:**
  1. `GET /api/v1/patients`: Returns paginated patient summaries including current eGFR, KDIGO stage, eGFR slope, and 5-year KFRE risk.
  2. `GET /api/v1/patients/{id}/trajectory`: Returns historical time-series observations, calculated OLS regression parameters, and projected trajectory to dialysis threshold ($\text{eGFR} < 15$).
  3. `POST /api/v1/clinical-decision/gdmt`: Accepts patient clinical state and returns structured GDMT order set with contraindications.

---

## 3. Mathematical Specifications

### 3.1 CKD-EPI 2021 Refit Creatinine Formula
$$\text{eGFR} = 142 \times \min\left(\frac{S_{cr}}{\kappa}, 1\right)^\alpha \times \max\left(\frac{S_{cr}}{\kappa}, 1\right)^{-1.200} \times 0.9938^{\text{Age}} \times [1.012 \text{ if Female}]$$

| Parameter | Female | Male |
|---|---|---|
| $\kappa$ | $0.7$ | $0.9$ |
| $\alpha$ | $-0.241$ | $-0.302$ |
| Sex Multiplier | $1.012$ | $1.000$ |

### 3.2 Longitudinal OLS Slope
$$\text{Slope} = \frac{\sum_{i=1}^n (t_i - \bar{t})(\text{eGFR}_i - \overline{\text{eGFR}})}{\sum_{i=1}^n (t_i - \bar{t})^2}$$
*where $t_i$ is time in fractional years from the initial observation.*

- $\text{Slope} > -1.0$: `NORMAL_AGING_DECLINE`
- $-1.0 \ge \text{Slope} > -3.0$: `MILD_DECLINE`
- $-3.0 \ge \text{Slope} > -5.0$: `RAPID_PROGRESSION` (High Priority Alert)
- $\text{Slope} \le -5.0$: `CATASTROPHIC_PROGRESSION` (Urgent Nephrology Referral)

### 3.3 Tangri 4-Variable KFRE
$$\text{Linear Predictor (LP)} = -0.2201 \times \left(\frac{\text{Age}}{10} - 7.036\right) + 0.2467 \times (\text{Male} - 0.5642) - 0.5567 \times \left(\frac{\text{eGFR}}{5} - 7.222\right) + 0.4510 \times (\ln(\text{uACR}) - 5.137)$$
$$\text{Risk}(t) = 1 - S_0(t)^{\exp(\text{LP})}$$

*Baseline survival probabilities ($S_0$):*
- Non-North American: $S_0(2) = 0.9832$, $S_0(5) = 0.9365$
- North American: $S_0(2) = 0.9750$, $S_0(5) = 0.9240$

---

## 4. Requirements & Data Contracts

### Functional Requirements
- **FR-001**: System MUST compute CKD-EPI 2021 race-free eGFR accurately to 4 decimal places during calculation and return rounded to 1 decimal place.
- **FR-002**: System MUST support biological sex as strictly `"male"` or `"female"`.
- **FR-003**: System MUST compute OLS linear slope if $\ge 2$ observations separated by at least 30 days are available.
- **FR-004**: System MUST project the time (in months and years) until eGFR drops below $15\text{ mL/min/1.73m}^2$ based on current slope.
- **FR-005**: System MUST compute Tangri 4-variable 2-year and 5-year ESKD risk percentages.
- **FR-006**: System MUST automatically convert uACR from $\text{mg/mmol}$ to $\text{mg/g}$ when specified.
- **FR-007**: System MUST classify patients into KDIGO G1–G5 and A1–A3 grid risk tiers (Low/Green, Moderate/Yellow, High/Orange, Very High/Red).
- **FR-008**: System MUST evaluate contraindications: block SGLT2i initiation if $\text{eGFR} < 20$ and block ACEi/ARB if potassium $> 5.5\text{ mEq/L}$.
- **FR-009**: System MUST attach the hemodynamic dip reassurance disclosure to every GDMT recommendation.
- **FR-010**: System MUST expose REST API endpoints with OpenAPI documentation at `/docs`.
- **FR-011**: System MUST accept patient observations originating from either direct electronic EHR feeds or optical lab reports ingested via the Snap-to-Care Gateway (`docs/specs/005-vision-ocr-ingestion.md`), preserving source bounding-box citations for clinical traceability.

### Key Entities
```python
class PatientObservation(BaseModel):
    date: date
    serum_creatinine: float  # mg/dL
    egfr: Optional[float] = None  # mL/min/1.73m2
    uacr: Optional[float] = None  # mg/g
    systolic_bp: Optional[int] = None  # mmHg
    diastolic_bp: Optional[int] = None  # mmHg
    source: Optional[str] = "ELECTRONIC_FEED"  # "ELECTRONIC_FEED" | "SNAP_TO_CARE_OCR"
    bounding_box: Optional[list[float]] = None  # [ymin, xmin, ymax, xmax] normalized coordinates
    document_id: Optional[str] = None  # Ingested optical document reference
    confidence: Optional[float] = None  # OCR confidence score (0.00 - 1.00)

class TrajectoryAnalysis(BaseModel):
    current_egfr: float
    current_stage: str  # e.g., "G3b"
    current_albuminuria_stage: str  # e.g., "A2"
    kdigo_composite_risk: str  # "LOW", "MODERATE", "HIGH", "VERY_HIGH"
    egfr_slope_per_year: Optional[float]
    progression_rate: str  # "NORMAL", "MILD", "RAPID", "CATASTROPHIC", "INSUFFICIENT_DATA"
    projected_dialysis_date: Optional[date]
    kfre_2yr_risk: Optional[float]  # Percentage e.g. 4.2%
    kfre_5yr_risk: Optional[float]  # Percentage e.g. 16.8%

class GDMTOrderRecommendation(BaseModel):
    sglt2i_recommended: bool
    sglt2i_drug: Optional[str]  # "Dapagliflozin 10mg PO Daily"
    sglt2i_contraindicated: bool
    sglt2i_contraindication_reason: Optional[str]
    ras_blockade_recommended: bool
    ras_blockade_drug: Optional[str]  # "Losartan 50mg PO Daily"
    ras_blockade_contraindicated: bool
    ras_contraindication_reason: Optional[str]
    nsmra_recommended: bool
    reflex_safety_lab_order: str  # "Serum Potassium + Creatinine in 4 weeks"
    hemodynamic_dip_reassurance: str
```

---

## 5. Success Criteria & Verification Gates

- **SC-001 (100% Math Parity):** All unit tests for CKD-EPI 2021 and Tangri KFRE pass with zero deviation from published clinical benchmark values.
- **SC-002 (Test Coverage):** Minimum 95% line coverage on `backend/app/services/`.
- **SC-003 (Deterministic Performance):** Calculation time per patient trajectory is $< 2\text{ ms}$.
- **SC-004 (Clinical Safety Guarantee):** No GDMT order set is ever generated without the mandatory 4-week potassium and creatinine safety reflex order.
- **SC-005 (Quality Gate):** `pytest backend/tests/` passes cleanly with exit code 0.
