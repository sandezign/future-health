# Feature Specification: Doctor Clinical Copilot

**Feature Branch**: `002-doctor-clinical-copilot`  
**Created**: 2026-10-20  
**Status**: Ready for Planning  
**Input**: Sprint Plan Phase 2 & FSD Guidelines (`.agents/rules/30-frontend.md`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dual-Context Health System Switcher (Priority: P1)
Switch between Indonesia (BPJS Kesehatan / Puskesmas) and Abu Dhabi (DoH / Malaffi HIE) across the application.

**Acceptance Scenarios**:
1. **Given** Indonesia mode selected, **Then** display IDR currency (`Rp xx,xxx,xxx`), Indonesian clinical terminology, and Kader escalation buttons.
2. **Given** Abu Dhabi mode selected, **Then** display USD/AED currency, English clinical terminology, and Malaffi HIE sync badges.

---

### User Story 2 - Longitudinal Trajectory Visualizer (Priority: P1)
Render historical eGFR measurements, OLS trendline, and projected dialysis date ($eGFR < 15$).

**Acceptance Scenarios**:
1. **Given** patient trajectory data, **When** rendered, **Then** plot serial points and OLS line with clear date axes.
2. **Given** slope <= -3.0 mL/min/yr, **Then** show high-priority "Rapid Progressor" warning badge.

---

### User Story 3 - 1-Click GDMT Order Set Card (Priority: P1)
Provide a 1-click clinical decision support card to authorize SGLT2i + ARB with mandatory reflex 4-week safety labs.

**Acceptance Scenarios**:
1. **Given** eligible patient, **When** physician clicks authorize, **Then** submits order set including Dapagliflozin 10mg + Losartan 50mg + 4-week Potassium and Creatinine lab orders.
2. **Given** contraindication present, **Then** disable specific drug button and display clear clinical reason.

---

### User Story 4 - Hemodynamic Dip Reassurance Modal (Priority: P2)
Explain the physiological rationale behind an initial 10-20% eGFR drop following SGLT2i/RAS initiation.

**Acceptance Scenarios**:
1. **Given** physician opens dip modal, **Then** display KDIGO 2024 explanation on intraglomerular pressure decompression.

## Requirements *(mandatory)*
- **FR-001**: FSD architecture strictly enforced (`pages -> widgets -> features -> entities -> shared`).
- **FR-002**: Zero blocking modal alerts for routine clinical care.
- **FR-003**: Dual-encoding for all risk badges (color + icon + text).
- **FR-004**: Formatting: eGFR to 1 decimal place, slope with explicit sign, currency localized.
- **FR-005**: Response time from click to prescription authorization $< 300\text{ ms}$.

## Success Criteria *(mandatory)*
- **SC-001**: Physician can authorize complete GDMT in $< 3$ clicks and $< 30$ seconds.
- **SC-002**: 100% of order sets enforce reflex safety labs.
- **SC-003**: Zero FSD cross-slice import violations (`npm run lint` passes cleanly).
