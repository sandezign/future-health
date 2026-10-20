import { ComponentMetadata } from './types';

export const badgeMetadata: ComponentMetadata = {
  component: {
    name: 'Badge',
    category: 'atoms',
    description:
      'Pill-shaped indicator badge supporting Mediora interface status tiers and KDIGO 2024 clinical risk categories with animated rapid-progressor pulse.',
    type: 'display',
    version: '1.0.0',
    status: 'stable',
  },

  usage: {
    useCases: [
      'KDIGO 2024 CKD risk staging (Low, Moderate, High, Very High)',
      'Rapid progressor alert (eGFR slope <= -3.0 mL/min/1.73m²/yr)',
      'Medication refill and adherence status (+10 days remain, +3 days remain)',
      'Patient triage status flags and diagnostic categorization',
      'Neutral metadata tags (e.g., age, gender, BPJS tier)',
    ],
    requiredProps: ['children'],
    optionalProps: ['variant', 'className'],
    commonPatterns: [
      {
        name: 'Dual-Encoded KDIGO Very High Risk Badge',
        description: 'Clinically compliant badge pairing red background with AlertTriangle icon and clear text.',
        composition: '<Badge variant="red"><AlertTriangle className="h-3 w-3" /> Very High Risk (KDIGO Red)</Badge>',
      },
      {
        name: 'Rapid Progressor Animated Pulse Badge',
        description: 'Mandatory clinical alert for patients losing > 3.0 mL/min/1.73m² per year.',
        composition: '<Badge variant="rapid"><TrendingDown className="h-3 w-3" /> Rapid Progressor (-4.2 mL/min/yr)</Badge>',
      },
      {
        name: 'Medication Adherence / Stable Status Badge',
        description: 'Positive clinical or adherence confirmation.',
        composition: '<Badge variant="green"><CheckCircle2 className="h-3 w-3" /> Adherent (100%)</Badge>',
      },
      {
        name: 'Informational Lab Metric Tag',
        description: 'Neutral or subtle indigo badge for secondary demographic or lab metadata.',
        composition: '<Badge variant="indigo">CKD Stage 3b</Badge>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Rendering color without an icon or explicit text label (Color-only encoding)',
        reason: 'Violates WCAG 2.2 Criterion 1.4.1 (Use of Color) and Clinical Decision Safety Rule #1 (Dual-Encoding for Severity). Color-blind clinicians cannot distinguish urgency.',
        alternative: 'Always include a supporting icon (e.g. CheckCircle2, AlertTriangle, TrendingDown) and explicit textual risk label.',
      },
      {
        scenario: 'Writing ad-hoc colored spans like `<span className="bg-red-100 text-red-600 px-2 py-1 rounded">`',
        reason: 'Violates Zero Ad-Hoc Styling governance and creates visual fragmentation across clinical views.',
        alternative: 'Import and use `<Badge variant="red">` from `@/shared/ui`.',
      },
      {
        scenario: 'Applying variant="rapid" to patients with eGFR slope > -3.0 mL/min/yr',
        reason: 'Violates clinical guidelines (KDIGO 2024 definition of rapid progression). Causes false alarms and alert fatigue.',
        alternative: 'Only apply variant="rapid" when `egfr_slope <= -3.0`. For moderate decline, use `variant="orange"` or `variant="yellow"`.',
      },
    ],
  },

  composition: {
    slots: {
      default: 'Icon and concise label text',
    },
    nestedComponents: ['lucide-react icons (AlertTriangle, CheckCircle2, TrendingDown, Clock)'],
    commonPartners: ['CardTitle', 'CardHeader', 'PatientIdentityHeader', 'TableCells'],
    parentConstraints: ['CardHeader', 'TableRow', 'ListHeader', 'ModalHeader'],
  },

  behavior: {
    states: ['default', 'pulse (for variant="rapid")'],
    interactions: {
      hover: 'Slight color transition (read-only indicator)',
    },
    responsive: {
      mobile: 'Wrap gracefully or truncate text without breaking container layout',
    },
  },

  accessibility: {
    role: 'status',
    keyboardSupport: 'None (passive presentation element). If made clickable, wrap in a button with appropriate aria attributes.',
    screenReader: 'Screen readers read the contained text and aria-hidden icon label.',
    focusManagement: 'Not focusable by default.',
    wcag: 'AA',
  },

  aiHints: {
    priority: 'high',
    keywords: ['badge', 'tag', 'status', 'kdigo', 'risk tier', 'rapid progressor', 'label', 'pill indicator'],
    context:
      'CRITICAL: Always use dual-encoding for clinical risk badges! Never render a colored badge without both an icon and explicit text. KDIGO mapping: green=Low, yellow=Moderate, orange=High, red=Very High, rapid=Slope <= -3.0.',
    tokensUsed: ['--color-status-success', '--color-status-warning', '--color-status-danger', 'rounded-full'],
  },
};
