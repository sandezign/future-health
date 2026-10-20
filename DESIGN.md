---
version: alpha
name: mediora-clinical-design-system
description: Reconstructed design language and token specification extracted from Mediora clinical and patient health management interfaces.
colors:
  background-canvas: "#f5f6f9"
  surface-card: "#ffffff"
  surface-subtle: "#f8fafc"
  surface-muted: "#f1f5f9"
  surface-popover: "#ffffff"
  primary-indigo: "#4f46e5"
  primary-hover: "#4338ca"
  primary-subtle: "#eef2ff"
  accent-cyan: "#06b6d4"
  accent-purple: "#a855f7"
  text-primary: "#0f172a"
  text-secondary: "#64748b"
  text-muted: "#94a3b8"
  text-inverse: "#ffffff"
  border-subtle: "#e2e8f0"
  border-card: "#f1f5f9"
  border-focus: "#6366f1"
  status-success: "#10b981"
  status-success-subtle: "#ecfdf5"
  status-success-text: "#065f46"
  status-warning: "#f97316"
  status-warning-subtle: "#fff7ed"
  status-warning-text: "#9a3412"
  status-danger: "#ef4444"
  status-danger-subtle: "#fef2f2"
  status-danger-text: "#991b1b"
  status-info: "#3b82f6"
  status-info-subtle: "#eff6ff"
  status-info-text: "#1e40af"
typography:
  sans:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
  mono:
    fontFamily: JetBrains Mono, monospace
  display:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 24px
    lineHeight: 32px
    fontWeight: 700
  title:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 18px
    lineHeight: 26px
    fontWeight: 600
  subtitle:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 15px
    lineHeight: 22px
    fontWeight: 600
  body:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 14px
    lineHeight: 20px
    fontWeight: 400
  caption:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 12px
    lineHeight: 16px
    fontWeight: 500
  micro:
    fontFamily: Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
    fontSize: 10px
    lineHeight: 14px
    fontWeight: 600
rounded:
  base: 12px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 24px
  3xl: 28px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
---

## Overview

This document is a reconstructed design language specification extracted from the Mediora clinical health portal and patient co-pilot reference interfaces. Mediora presents an approachable, high-trust healthcare dashboard aesthetic combining clinical precision with soft, warm consumer SaaS design patterns. 

The visual system avoids intimidating, sterile hospital software tropes by utilizing generous card curvatures, an airy off-white canvas, soft diffuse drop shadows, high-contrast typography, and playful, friendly 3D assistant iconography accompanied by ambient pastel glow gradients.

---

## Colors

The color palette centers on a crisp white-on-cool-gray foundation energized by digital indigo as the primary interactive hue, complemented by semantic clinical indicators and gentle atmospheric glow blends.

- **Canvas & Surfaces:**
  - Base Application Canvas: `#f5f6f9` (`background-canvas`). Provides soft contrast against elevated cards without creating harsh borders.
  - Primary Surface Container: `#ffffff` (`surface-card`). Used for all cards, modal viewports, and primary panels.
  - Sub-surfaces & Read-only Inputs: `#f8fafc` (`surface-subtle`) to `#f1f5f9` (`surface-muted`) for nested information tiles, filter tags, and form fields.
- **Brand & Interactive Accent:**
  - Primary Action: `#4f46e5` (`primary-indigo`) for primary action buttons (`+ Add medication`, `+ Invite Manager`, `Track Result`, `Book a Call`), focused indicators, and key links.
  - Active State & Hover: `#4338ca` (`primary-hover`).
  - Active Tint Surface: `#eef2ff` (`primary-subtle`) for selected navigation items, informational banners, and active tab containers.
- **Clinical & Status Tiers:**
  - Stable / Adherent / Ready: `#10b981` (`status-success`) with `#ecfdf5` background and `#065f46` text for medication adherence tags (`+ 10 days remain`), online doctor statuses, and completed lab results.
  - Warning / Refill Required / Pending: `#f97316` (`status-warning`) with `#fff7ed` background and `#9a3412` text for urgent refills (`+ 3 days remain`, `+ 7 days remain`) and pending diagnostic reports.
  - Critical / Alert: `#ef4444` (`status-danger`) with `#fef2f2` background and `#991b1b` text for abnormal vitals and contraindication warnings.
- **Atmospheric AI Aura:**
  - Radial gradient blending `#cffafe` (cyan), `#e0e7ff` (indigo), and `#f3e8ff` (purple) behind AI assistant hero modules to convey intelligence and empathy.

---

## Typography

Typography prioritizes clarity, rapid scanability, and legibility across dense clinical and administrative tables.

- **Primary Typeface:** `Plus Jakarta Sans` across all display headings, navigational labels, and interface controls.
- **Data & Lab Figures:** `JetBrains Mono` or tabular numerals for lab test quantities, dosage specifications, biometric percentages, and clock times.
- **Hierarchy Rules:**
  - `display`: Page titles (24px / 32px, Bold, `#0f172a`).
  - `title`: Section titles and modal headings (18px / 26px, Semi-bold, `#0f172a`).
  - `subtitle`: Card titles and provider names (15px / 22px, Semi-bold, `#0f172a`).
  - `body`: Primary interface copy, form values, and table cells (14px / 20px, Regular, `#0f172a`).
  - `caption`: Form field labels, sub-descriptions, and secondary metadata (12px / 16px, Medium, `#64748b`).
  - `micro`: Pill tags, badge text, and table header indicators (10px / 14px, Bold uppercase or tracked semi-bold, `#94a3b8`).

---

## Layout

Mediora utilizes an asymmetric multi-column layout structured to balance patient management tasks with contextual AI assistance.

- **Shell Architecture:**
  - Left Sidebar (Fixed 240px–260px): Logo header, primary navigation links with 20px icons, security encryption guarantee badge, and docked patient profile pill at the base.
  - Global Header Bar (64px height): Centered pill search bar (`Search here...` with `⌘S` keyboard shortcut chip), user group avatar cluster, and primary header action button.
  - Main Working Stage (Flexible central grid): 12-column bento grid accommodating cards, medication product grids, provider cards, or clinical appointment calendars.
  - Right Rail (320px–360px): Persistent or contextual panel dedicated to the conversational AI co-pilot, quick action grids, and immediate dose reminders.
- **Grid Systems:**
  - Medication Catalog: 3-column responsive card grid (`gap-4` to `gap-6`).
  - Available Providers: 3-column provider card grid with 1:1.2 vertical card proportions.
  - Appointment Schedule: Multi-day time matrix with horizontal 1-hour intervals and rounded event blocks.

---

## Elevation & Depth

Surfaces rely on subtle ambient light diffusion rather than heavy drop shadows, producing a floating, tactile appearance.

- **Base Cards:** `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(0, 0, 0, 0.03)` with a hairline 1px border (`#f1f5f9`).
- **Hover Elevation:** Subtle transform translation `translateY(-2px)` accompanied by expanded ambient shadow `box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.06)`.
- **Modals & Overlays:** Centered floating cards with `box-shadow: 0 24px 48px -12px rgba(15, 23, 42, 0.18)` positioned above a blurred semi-transparent backdrop (`backdrop-blur-md bg-slate-900/30`).
- **Interactive Pill Badges:** Flat surfaces with 1px border matching the accent color tone (e.g. `border-emerald-200 bg-emerald-50`).

---

## Shapes

Shapes feature generous, organic rounding ("squircle" geometry) that softens clinical interaction points.

- **Buttons & Chips:** Pill radius `rounded-full` (9999px) for all standalone action buttons (`+ Add medication`, `Track Result`, `Book a Call`), search inputs, and filter chips.
- **Content Cards:** `rounded-2xl` (20px) to `rounded-3xl` (24px) for all dashboard cards, bento modules, and assistant containers.
- **Form Inputs:** `rounded-xl` (12px) to `rounded-2xl` (16px) with clean `#f8fafc` surface fills and inset label placement.
- **Modals:** `rounded-3xl` (28px) with generous interior padding (24px to 32px).
- **Avatar & Icon Badges:** Rounded squares (`rounded-xl` / 12px) or circular frames with soft contrasting fills.

---

## Components

### 1. Navigation Sidebar
- Displays brand logo with geometric gradient icon.
- Navigation items render icon + title in `text-slate-600 hover:text-slate-900`.
- Active item uses full pill selection with subtle light-blue / gray background tint (`#f1f5f9` or `#eef2ff`) and semi-bold title.
- Docked footer card displays security encryption status ("Your health data is encrypted and protected.") alongside a patient profile selector.

### 2. Global Search Pill
- Centered in header with pill geometry (`rounded-full`).
- Light neutral background (`#f8fafc`) with subtle 1px border.
- Features search icon on left and shortcut chip (`⌘S` / `⌘K`) on right.

### 3. AI Co-Pilot Card
- Elevated white card featuring a friendly 3D blue speech bubble mascot with pill eyes.
- Atmospheric background with pastel cyan-purple gradient mesh.
- Welcome headline: "Good Morning, [Name] / How Can I Assist You Today?".
- Action prompt chips with chevron indicators for quick common queries.
- Bottom multimodal prompt bar equipped with image attachment, document upload, and voice microphone triggers.

### 4. Medication & Product Cards
- Clean white card with soft 1px border and 20px corner radius.
- Upper region contains centered product packaging asset on a clean neutral background.
- Floating refill status badge on upper-left (`+ 3 days remain` or `+ 10 days remain`).
- Card body specifies medication name, active ingredients / strength, and dosage frequency.

### 5. Provider & Specialist Cards
- Photo header featuring healthcare provider portrait framed by a soft periwinkle rounded enclosure (`#e0e7ff`).
- Provider credentials, specialty badge, and 3-column metric bar: Rating (star icon), Years of Experience, and Review Count.
- Dual button footer: Primary pill button ("Book a Call") alongside secondary icon button (Eye icon for profile inspection).

### 6. Clinical Modal Dialog
- Centered 28px rounded container with dark blurred backdrop.
- Header with test category icon, laboratory name, and diagnostic timestamp.
- Structured laboratory test results table:
  - Columns: `Measurement | Value | Reference`.
  - Values rendered in bold indigo-blue for rapid recognition.
- Reference range disclaimer callout in `#eef2ff` container with info icon.
- Full-width primary pill action button ("Track Result").

---

## Do's and Don'ts

### Do's
- Pair all clinical severity indicators with clear text labels and icons; do not rely on color alone.
- Use pill-shaped (`rounded-full`) geometry for primary action triggers and navigation filter chips.
- Ensure form inputs maintain a minimum touch target height of 44px.
- Enclose laboratory values and medical numerical data in high-legibility tabular or monospace styling.
- Frame medical product imagery and provider portraits within clean, soft-colored containers.

### Don'ts
- Do not use harsh, stark black borders or dark shadows; use soft cool-gray borders (`#e2e8f0` / `#f1f5f9`).
- Do not use abrasive red warning boxes for routine notifications; reserve `#ef4444` strictly for critical contraindications or severe lab flags.
- Do not make card corner radii sharp; adhere to the minimum 16px–24px curvature standard.
- Do not overcrowd layouts; maintain 16px to 24px internal card padding and 24px section margins.

---

## Governance & AI Readiness

The Mediora Clinical Design System is strictly governed to maintain clinical safety and prevent token drift across human and AI-assisted workflows:

- **Governance Specification:** See [docs/DESIGN_SYSTEM_GOVERNANCE.md](file:///Users/mb-rci-backup/Documents/antigravity/future-health/docs/DESIGN_SYSTEM_GOVERNANCE.md) for ownership rules, the 7-stage RFC lifecycle, and semantic versioning policies.
- **AI-Component Metadata:** All UI primitives in `frontend/src/shared/ui/` have machine-readable metadata in `frontend/src/shared/ui/metadata/` conforming to the `ai-component-metadata` standard.
- **Compiled Catalog:** Context injection file available at `frontend/src/shared/ui/metadata/ai-catalog.json`.
- **Automated Verification:** Run `python3 scripts/validate_ai_metadata.py` or `make check-ds` to verify 1-to-1 component-metadata parity and schema completeness.

