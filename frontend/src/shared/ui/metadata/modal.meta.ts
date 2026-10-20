import { ComponentMetadata } from './types';

export const modalMetadata: ComponentMetadata = {
  component: {
    name: 'Modal',
    category: 'organisms',
    description:
      'Accessible clinical dialog overlay featuring 28px deep squircle curvature, ambient diffuse elevation, blurred backdrop, body scroll lock, and ESC key listener.',
    type: 'container',
    version: '1.0.0',
    status: 'stable',
  },

  usage: {
    useCases: [
      'Comprehensive laboratory inspection reports (eGFR trajectory data, dipstick urinalysis, serum creatinine timeline)',
      '1-Click GDMT order review and final clinician signature/submission confirmation',
      'Patient risk stratification breakdown and KFRE 4-variable calculator inspector',
      'Outreach message review prior to WhatsApp dispatch',
    ],
    requiredProps: ['isOpen', 'onClose', 'children'],
    optionalProps: ['title', 'description', 'footer', 'maxWidth', 'className'],
    commonPatterns: [
      {
        name: 'Clinical Lab Inspection Dialog',
        description: 'Deep modal displaying diagnostic history table, reference ranges, and confirmation action.',
        composition: `<Modal
  isOpen={isLabModalOpen}
  onClose={() => setIsLabModalOpen(false)}
  title="Complete Metabolic & Urinalysis History"
  description="Patient MRN-88421 • Dr. Sarah Al Mansoori"
  maxWidth="lg"
  footer={
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => setIsLabModalOpen(false)}>Close</Button>
      <Button variant="primary" shape="pill" onClick={handleExport}>Export PDF Report</Button>
    </div>
  }
>
  <LabHistoryTable patientId={patient.id} />
</Modal>`,
      },
      {
        name: 'Prescription Confirmation Dialog',
        description: 'Confirmation step before signing and transmitting GDMT order to pharmacy EHR.',
        composition: `<Modal
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  title="Confirm 1-Click GDMT Protocol"
  description="Dapagliflozin 10mg + Telmisartan 40mg daily"
  maxWidth="md"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
      <Button variant="primary" shape="pill" onClick={handleSignOrder}>Sign & Transmit Order</Button>
    </>
  }
>
  <p className="text-sm text-slate-600">This order set includes a mandatory 4-week follow-up serum potassium and creatinine safety panel.</p>
</Modal>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Using Modal for routine clinical notices or low-severity warnings (Alert Fatigue)',
        reason: 'Violates Clinical Safety Rule #2 (Zero Alert Fatigue). Excessive modal popups cause clinicians to reflexively dismiss warnings without reading them, leading to medical errors.',
        alternative: 'Use inline `<Card>` callouts or non-interruptive badges for expected conditions (such as the expected 10-20% eGFR dip with SGLT2i).',
      },
      {
        scenario: 'Using browser native `window.alert()` or `window.confirm()`',
        reason: 'Completely unstyled, non-accessible, freezes execution thread, and destroys clinician trust.',
        alternative: 'Always use `<Modal>` from `@/shared/ui`.',
      },
      {
        scenario: 'Building ad-hoc fixed div overlays without body scroll lock or ESC key binding',
        reason: 'Traps users, causes double scrolling, and fails WCAG 2.2 Criterion 2.1.2 (No Keyboard Trap).',
        alternative: 'Use `<Modal>` which automatically manages body overflow, backdrop clicks, and keyboard Escape listener.',
      },
    ],
  },

  composition: {
    slots: {
      header: 'Title, description, and close (X) icon button',
      children: 'Scrollable interior body with max-h-[75vh]',
      footer: 'Bottom action strip with muted background and action buttons',
    },
    nestedComponents: ['Button', 'Card', 'Badge', 'X icon'],
    commonPartners: ['Button', 'Table', 'Form'],
    parentConstraints: ['Root document body (rendered via fixed portal overlay)'],
  },

  behavior: {
    states: ['closed (returns null)', 'open (animate-in zoom-in-95 and fade-in)'],
    interactions: {
      backdropClick: 'Invokes onClose handler',
      escapeKey: 'Invokes onClose handler and cleans up window listener on unmount',
      scrollLock: 'Locks document.body.style.overflow="hidden" while open, resets on close',
    },
    responsive: {
      mobile: 'Fills viewport width with p-4 margin; interior body scrolls smoothly',
    },
  },

  accessibility: {
    role: 'dialog',
    keyboardSupport: 'Escape key closes modal. Tab key focuses inside dialog content.',
    screenReader: 'Renders aria-modal="true" and role="dialog". Close button provides aria-label="Close".',
    focusManagement: 'Traps focus within dialog boundaries while open.',
    wcag: 'AA',
  },

  aiHints: {
    priority: 'high',
    keywords: ['modal', 'dialog', 'popup', 'overlay', 'lightbox', 'confirm dialog'],
    context:
      'CRITICAL: Do NOT use Modal for routine clinical alerts (prevents alert fatigue). Use only for intentional user workflows like detailed lab inspection or prescription sign-off.',
    tokensUsed: ['rounded-3xl', 'shadow-modal', 'backdrop-blur-md', '--color-surface-card'],
  },
};
