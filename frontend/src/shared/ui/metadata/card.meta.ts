import { ComponentMetadata } from './types';

export const cardMetadata: ComponentMetadata = {
  component: {
    name: 'Card',
    category: 'molecules',
    description:
      'Compound container component implementing Mediora squircle geometry (rounded-2xl), ambient diffuse elevation, and structured clinical content slots.',
    type: 'container',
    version: '1.0.0',
    status: 'stable',
  },

  usage: {
    useCases: [
      'Clinical summary cards (eGFR trajectory, KDIGO staging, lab panels)',
      '1-Click GDMT order and prescription modules',
      'Population health KPI metric cards',
      'Patient triage queue list items',
      'Conversational WhatsApp outreach and co-pilot simulation frames',
    ],
    requiredProps: ['children'],
    optionalProps: ['className'],
    commonPatterns: [
      {
        name: 'Standard Clinical Metric Card',
        description: 'Complete structured card with header, badge indicator, content body, and action footer.',
        composition: `<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <div>
      <CardTitle>eGFR Filtration Rate</CardTitle>
      <CardDescription>CKD-EPI 2021 race-free refit</CardDescription>
    </div>
    <Badge variant="red"><AlertTriangle className="h-3 w-3" /> G4 Severe</Badge>
  </CardHeader>
  <CardContent>
    <div className="font-mono text-3xl font-bold text-slate-900">28.4 <span className="text-xs font-normal text-slate-500">mL/min/1.73m²</span></div>
  </CardContent>
  <CardFooter>
    <Button variant="primary" shape="pill" size="sm">Review Trajectory</Button>
  </CardFooter>
</Card>`,
      },
      {
        name: 'Compact Informational Tile',
        description: 'Card with minimal padding for secondary vitals or lab summary grids.',
        composition: `<Card className="p-4">
  <div className="text-xs text-slate-500 font-medium">Systolic Blood Pressure</div>
  <div className="font-mono text-xl font-bold text-slate-900 mt-1">148/92 <span className="text-xs font-normal text-slate-400">mmHg</span></div>
</Card>`,
      },
    ],
    antiPatterns: [
      {
        scenario: 'Writing `<div className="bg-white rounded-lg shadow-md border border-gray-300 p-4">`',
        reason: 'Breaks Mediora elevation hierarchy, violates squircle token rules, and creates inconsistent padding across views.',
        alternative: 'Use `<Card>`, `<CardHeader>`, `<CardContent>`, and `<CardFooter>` from `@/shared/ui`.',
      },
      {
        scenario: 'Adding harsh dark shadows like `shadow-2xl` or black outlines `border-black`',
        reason: 'Violates the Mediora design language which strictly requires soft, ambient diffuse shadows and `#f1f5f9` / `#e2e8f0` hairlines.',
        alternative: 'Rely on `<Card>` default classes which provide calibrated `shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.03)]`.',
      },
      {
        scenario: 'Nesting Card inside Card with identical elevation and white backgrounds',
        reason: 'Causes visual ambiguity between parent and child surfaces.',
        alternative: 'For nested panels inside a Card, use `bg-slate-50/70` (`surface-subtle`) or `bg-slate-100/60` (`surface-muted`) containers.',
      },
    ],
  },

  composition: {
    slots: {
      header: 'CardHeader (contains CardTitle and optional CardDescription or Badges)',
      content: 'CardContent (main body with p-5/p-6 pt-0 spacing)',
      footer: 'CardFooter (bottom action row with flex items-center justify-end/between)',
    },
    nestedComponents: ['CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter', 'Badge', 'Button'],
    commonPartners: ['Button', 'Badge', 'Recharts components'],
    parentConstraints: ['Bento grid column', 'Main working stage', 'Right rail co-pilot'],
  },

  behavior: {
    states: ['default', 'hover (subtle translateY and ambient shadow expansion)'],
    interactions: {
      hover: 'Elevates slightly to signal interactivity if wrapped or bound with click handler',
    },
    responsive: {
      mobile: 'Full width stacked layout, padding adjusts from p-5 on mobile to p-6 on desktop',
    },
  },

  accessibility: {
    role: 'region or article',
    keyboardSupport: 'None for static cards; if card is interactive/clickable, provide role="button", tabIndex={0}, and onKeyDown handler.',
    screenReader: 'Headings inside CardTitle provide semantic document outline (h3 by default).',
    focusManagement: 'Focus rings wrap inner interactive controls rather than card container unless card itself is a link/button.',
    wcag: 'AA',
  },

  aiHints: {
    priority: 'high',
    keywords: ['card', 'panel', 'container', 'tile', 'surface', 'squircle', 'widget box'],
    context:
      'Universal container for all dashboard modules. Always compose using CardHeader, CardTitle, CardContent, and CardFooter. Never write raw div wrappers with custom borders.',
    tokensUsed: ['--color-surface-card', '--color-border-card', 'rounded-2xl', 'shadow-card', 'shadow-card-hover'],
  },
};
