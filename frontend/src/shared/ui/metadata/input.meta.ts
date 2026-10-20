import { ComponentMetadata } from './types';

export const inputMetadata: ComponentMetadata = {
  component: {
    name: 'Input',
    category: 'atoms',
    description:
      'Accessible form input supporting Mediora pill and rounded geometries, integrated icons, inset label hierarchy, and explicit error message presentation.',
    type: 'input',
    version: '1.0.0',
    status: 'stable',
  },

  usage: {
    useCases: [
      'Global patient search pill in header (with Search icon and keyboard shortcut chip)',
      'Clinical parameter inputs (eGFR, serum creatinine, systolic/diastolic BP, urine ACR)',
      'WhatsApp simulator message composer',
      'Filter criteria and threshold inputs in population health dashboard',
    ],
    requiredProps: [],
    optionalProps: ['label', 'error', 'helperText', 'icon', 'shape', 'placeholder', 'type', 'value', 'onChange', 'disabled'],
    commonPatterns: [
      {
        name: 'Global Header Search Pill',
        description: 'Centered search pill with icon for searching patient records across facilities.',
        composition: '<Input shape="pill" icon={<Search className="h-4 w-4" />} placeholder="Search patient by name or MRN..." />',
      },
      {
        name: 'Clinical Metric Input Field',
        description: 'Standard rounded input for numerical lab test values with label and helper text.',
        composition: '<Input label="Serum Creatinine (mg/dL)" type="number" step="0.01" placeholder="1.20" helperText="Standard automated enzymatic method" />',
      },
      {
        name: 'Validated Field with Error Message',
        description: 'Displays rose highlight and accessible error message when validation fails.',
        composition: '<Input label="Systolic Blood Pressure" error="Systolic BP must be between 60 and 260 mmHg" value={280} />',
      },
    ],
    antiPatterns: [
      {
        scenario: 'Writing `<input className="border p-2 rounded" />` without label or wrapper',
        reason: 'Violates Zero Ad-Hoc Styling governance, skips accessibility labels, and breaks focus state uniformity.',
        alternative: 'Import and use `<Input label="..." />` from `@/shared/ui`.',
      },
      {
        scenario: 'Setting custom height smaller than 44px (e.g., `h-8` or `h-7`)',
        reason: 'Violates clinical ergonomics and WCAG 2.2 Criterion 2.5.8 (Target Size - Minimum). Healthcare workers using tablets or laptops need reliable touch targets.',
        alternative: 'Use default height `h-11` (44px) provided by `<Input>`.',
      },
      {
        scenario: 'Displaying error state using only red border without descriptive error text',
        reason: 'Users cannot discern why the field is invalid or how to correct the value.',
        alternative: 'Pass the error message to the `error` prop: `<Input error="Value exceeds allowable range" />`.',
      },
    ],
  },

  composition: {
    slots: {
      icon: 'Left-aligned decorative or action icon (e.g. Search, Calendar, User)',
      label: 'Top inset label text',
      error: 'Bottom error description in rose-600',
      helperText: 'Bottom helper text in slate-500',
    },
    nestedComponents: ['lucide-react icons'],
    commonPartners: ['Button', 'Card', 'Modal'],
    parentConstraints: ['Form', 'CardContent', 'Modal body', 'Header search area'],
  },

  behavior: {
    states: ['default', 'hover', 'focus-visible (indigo ring)', 'error (rose ring)', 'disabled'],
    interactions: {
      focus: 'Applies 2px indigo-500 ring and border highlights',
      input: 'Fires standard onChange event with typed value',
    },
    responsive: {
      mobile: 'Full width container (w-full) by default',
    },
  },

  accessibility: {
    role: 'textbox',
    keyboardSupport: 'Standard keyboard text entry, Tab navigation, Escape to clear where supported.',
    screenReader: 'Label is linked to input element; error text provides descriptive feedback.',
    focusManagement: 'Visible focus ring (`focus-visible:ring-2 focus-visible:ring-indigo-500`).',
    wcag: 'AA',
  },

  aiHints: {
    priority: 'high',
    keywords: ['input', 'text field', 'search bar', 'form control', 'textbox', 'search pill'],
    context:
      'Always use shape="pill" for header search bars and shape="rounded" for data entry forms. Never write bare HTML inputs.',
    tokensUsed: ['--color-surface-subtle', '--color-border-subtle', '--color-border-focus', 'rounded-xl', 'rounded-full'],
  },
};
