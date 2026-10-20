# Feature Specification: Population Command Center & Markov Economic Engine

**Feature Branch**: `004-population-command-center`  
**Created**: 2026-10-20  
**Status**: Ready for Planning  
**Input**: Sprint Plan Phase 4 & Health Economics Blueprint (`docs/STRATEGIC_RESEARCH_BLUEPRINT.md`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Regional Risk Heatmap (Priority: P1)
Visualize primary care clinics and regional clusters categorized by average progression slope and high-risk patient counts.

**Acceptance Scenarios**:
1. **Given** clinic registry data, **When** rendered, **Then** map displays geographic clusters with color-coded risk markers.
2. **Given** user clicks a cluster, **Then** filter the tabular view to clinics within that cluster.

---

### User Story 2 - Markov State-Transition Simulation (Priority: P1)
Simulate a 5-year cohort transitioning between CKD 1-3, CKD 4, Dialysis, and Death under standard care vs. RENAL-PULSE interception.

**Acceptance Scenarios**:
1. **Given** baseline cohort size, **When** computed, **Then** show 39% relative risk reduction in progression to dialysis over 5 years.
2. **Given** transition probabilities, **Then** calculate cumulative dialysis cases averted.

---

### User Story 3 - Actuarial Budgetary Impact Slider (Priority: P2)
Enable interactive adjustment of cohort size and show real-time cost savings in IDR Trillions and USD Millions.

**Acceptance Scenarios**:
1. **Given** Indonesia mode, **When** cohort slider is moved, **Then** update 5-year net savings in IDR (Trillions).
2. **Given** Abu Dhabi mode, **When** cohort slider is moved, **Then** update 5-year net savings in USD (Millions).

## Requirements *(mandatory)*
- **FR-001**: 5-state Markov decision model implemented with pure mathematical transition functions.
- **FR-002**: Real-time client-side calculation latency $< 50\text{ ms}$ upon slider movement.
- **FR-003**: Support dual health system cost structures (BPJS Indonesia vs. DoH Abu Dhabi).

## Success Criteria *(mandatory)*
- **SC-001**: Actuarial savings parity verified against DAPA-CKD / EMPA-KIDNEY health economic literature.
- **SC-002**: 60fps responsive re-rendering during continuous slider interaction.
