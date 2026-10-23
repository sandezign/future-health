# Feature Specification: In-Browser WhatsApp Patient Engagement Simulator

**Feature Branch**: `003-whatsapp-simulator`  
**Created**: 2026-10-20  
**Status**: Ready for Planning  
**Input**: Sprint Plan Phase 3 & Behavioral Dialogue Research (`docs/STRATEGIC_RESEARCH_BLUEPRINT.md`)

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Lab Photo Upload & Snap-to-Care Activation (Priority: P1)
Enable patient or judge to upload a lab slip image directly in the chat interface to trigger OCR ingestion and dialogue initiation.

**Acceptance Scenarios**:
1. **Given** paperclip/camera icon clicked, **When** user selects demo lab slip image, **Then** show uploaded photo bubble with "Scanning with Snap-to-Care AI..." status.
2. **Given** valid slip ($\text{blur} \ge 100$), **Then** bot parses eGFR/Creatinine and initiates personalized "Kitchen Filter" dialogue.
3. **Given** blurry slip ($\text{blur} < 100$), **Then** bot requests retake with clear lighting.

---

### User Story 1 - Photorealistic WhatsApp Client (Priority: P1)
Provide a mobile device frame simulating WhatsApp chat with real-time bubble animations and quick replies.

**Acceptance Scenarios**:
1. **Given** user opens simulator, **Then** mobile mockup displays realistic WhatsApp interface with contact info and online status.
2. **Given** bot sends message, **Then** render typing indicator for 400ms followed by message bubble with checkmark ticks.

---

### User Story 2 - Behavioral Dialogue Engine (Priority: P1)
Deliver multi-turn dialogue in Bahasa Indonesia and English using the "Kitchen Filter" / "Filter Air Dapur" metaphor.

**Acceptance Scenarios**:
1. **Given** patient selects denial branch ("I feel healthy"), **Then** explain silent nature of filtration loss using water filter analogy.
2. **Given** patient selects fear branch ("Afraid of harsh chemicals"), **Then** explain SGLT2i as a pressure-relieving organ shield.

---

### User Story 3 - In-Chat Clinic Booking (Priority: P1)
Enable patient to select an appointment slot directly in the chat to complete the screening-to-care loop.

**Acceptance Scenarios**:
1. **Given** patient selects time slot chip, **Then** record confirmed booking and trigger calendar confirmation bubble.

---

### User Story 4 - Kader Escalation Trigger (Priority: P2)
Demonstrate automated escalation to Community Health Workers (*Kader*) upon appointment lapse.

**Acceptance Scenarios**:
1. **Given** user clicks "Simulate Missed Appointment", **Then** dispatch Kader home visit task notification.

## Requirements *(mandatory)*
- **FR-001**: 100% client-side simulation (no live WhatsApp Business API or Twilio credentials required).
- **FR-002**: Multilingual support with instantaneous language toggle (Bahasa Indonesia & English).
- **FR-003**: Message history state reset button for repeatable judging demos.
- **FR-004**: Accessible keyboard and mouse navigation for all quick reply options.

## Success Criteria *(mandatory)*
- **SC-001**: Smooth 60fps animations for chat bubbles and typing indicators.
- **SC-002**: 100% of dialogue paths lead to an appointment confirmation or Kader escalation.
- **SC-003**: Complete user flow executable in $< 90$ seconds.
