import { ComponentMetadata } from './types';

export const buttonMetadata: ComponentMetadata = {
  component: {
    name: 'Button',
    category: 'atoms',
    description:
      'Universal interactive button primitive supporting Mediora clinical design language with pill and rounded squircle geometries, subtle elevation, and dual focus rings.',
    type: 'interactive',
    version: '1.0.0',
    status: 'stable',
  },

  usage: {
    useCases: [
      'Primary clinical call-to-actions (e.g., Order 1-Click GDMT, Book Clinical Appointment)',
      'Secondary actions and panel dismissals',
      'Compact table/list item actions and inspector triggers',
      'Icon-only controls with accessible labels',
      'In-page filter triggers and tab switches',
    ],
    requiredProps: ['children'],
    optionalProps: ['variant', 'size', 'shape', 'disabled', 'onClick', 'type', 'className', 'asChild'],
    commonPatterns: [
      {
        name: 'Primary Standalone CTA (Pill)',
        description: 'Default primary action button for high-prominence clinical workflows.',
        composition: '<Button variant="primary" shape="pill" size="md">Order 1-Click GDMT</Button>',
      },
      {
        name: 'Compact Table Toolbar Action (Rounded)',
        description: 'Used inside compact data grids and dense clinical tables where pills consume too much lateral space.',
        composition: '<Button variant="outline" shape="rounded" size="sm">Inspect Labs</Button>',
      },
      {
        name: 'Icon-Only Control with Accessible Label',
        description: 'For toolbar buttons, dialog dismissals, or quick actions where an icon conveys the full intent.',
        composition: '<Button variant="ghost" size="icon" aria-label="Dismiss alert"><X className="h-4 w-4" /></Button>',
      },
      {
        name: 'Subtle Filter Pill',
        description: 'Used for non-urgent secondary filters or toggles in patient list headers.',
        composition: '<Button variant="subtle" shape="pill" size="sm">KDIGO High Risk</Button>',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Writing raw <button className="bg-blue-600 text-white px-4 py-2 rounded">',
        reason: 'Violates the Zero Ad-Hoc Styling governance rule. Loses tactile active animation, focus ring, and token consistency.',
        alternative: 'Import and use `<Button variant="primary" shape="pill">` from `@/shared/ui`.',
      },
      {
        scenario: 'Using size="icon" without an aria-label or accessible text',
        reason: 'Screen readers cannot announce the purpose of the button, violating WCAG 2.2 Criterion 4.1.2 (Name, Role, Value).',
        alternative: 'Always provide `aria-label="Action description"` when rendering an icon without text.',
      },
      {
        scenario: 'Using variant="danger" for ordinary cancellation or closing',
        reason: 'Red is reserved in clinical interfaces strictly for critical risk alerts or irreversible data destructions.',
        alternative: 'Use `variant="ghost"` or `variant="outline"` for dismiss and cancel actions.',
      },
      {
        scenario: 'Applying square edges or harsh black borders via custom className',
        reason: 'Breaks Mediora squircle/pill aesthetic and visual trust.',
        alternative: 'Stick to `shape="pill"` (standalone) or `shape="rounded"` (dense/toolbar).',
      },
    ],
  },

  composition: {
    slots: {
      default: 'Button text label and/or leading/trailing icons',
    },
    nestedComponents: ['lucide-react icons'],
    commonPartners: ['CardFooter', 'Modal', 'Input'],
    parentConstraints: ['CardFooter', 'header actions', 'table row action cell', 'modal footer'],
  },

  behavior: {
    states: ['default', 'hover', 'active (scale-98)', 'focus-visible', 'disabled'],
    interactions: {
      click: 'Executes onClick handler when not disabled',
      keyboard: 'Triggers on Enter or Space keydown',
    },
    responsive: {
      mobile: 'Full width (w-full sm:w-auto) on small viewports when used in action bars or card footers',
    },
  },

  accessibility: {
    role: 'button',
    keyboardSupport: 'Full standard keyboard activation via Enter and Space. Tab navigation.',
    screenReader: 'Announces button role, accessible name, and disabled status.',
    focusManagement: 'Visible 2px indigo focus ring with 2px offset on keyboard focus (:focus-visible).',
    wcag: 'AA',
  },

  aiHints: {
    priority: 'high',
    keywords: ['button', 'action', 'cta', 'submit', 'trigger', 'pill', 'interactive'],
    context:
      'Always default to shape="pill" for standalone CTAs and hero actions. Use shape="rounded" only in compact tables or toolbars. Never invent ad-hoc button markup.',
    tokensUsed: ['--color-primary-indigo', '--color-primary-hover', '--color-primary-subtle', 'rounded-full', 'rounded-xl'],
  },
};
