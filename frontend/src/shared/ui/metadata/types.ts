/**
 * AI-Ready Component Metadata Schema
 *
 * Defines machine-readable specifications, usage patterns, anti-patterns,
 * and composition rules for design system primitives, enabling AI coding agents
 * (e.g. Antigravity, Claude Code, Cursor) to generate safe, accessible,
 * and token-compliant UI components without hallucinating ad-hoc styling.
 *
 * Conforms to the ai-component-metadata standard.
 */

export type ComponentCategory = 'atoms' | 'molecules' | 'organisms';
export type ComponentType = 'interactive' | 'display' | 'container' | 'input' | 'navigation';
export type ComponentStatus = 'stable' | 'beta' | 'deprecated';
export type AiPriority = 'high' | 'medium' | 'low';

export interface CommonPattern {
  name: string;
  description: string;
  composition: string;
}

export interface AntiPattern {
  scenario: string;
  reason: string;
  alternative: string;
}

export interface ComponentMetadata {
  component: {
    name: string;
    category: ComponentCategory;
    description: string;
    type: ComponentType;
    version?: string;
    status?: ComponentStatus;
  };

  usage: {
    useCases: string[];
    requiredProps: string[];
    optionalProps?: string[];
    commonPatterns: CommonPattern[];
    antiPatterns: AntiPattern[];
  };

  composition: {
    slots?: Record<string, string>;
    nestedComponents?: string[];
    commonPartners?: string[];
    parentConstraints?: string[];
  };

  behavior: {
    states: string[];
    interactions: Record<string, string>;
    responsive?: Record<string, string>;
  };

  accessibility: {
    role: string;
    keyboardSupport: string;
    screenReader: string;
    focusManagement: string;
    wcag: 'A' | 'AA' | 'AAA';
  };

  aiHints: {
    priority: AiPriority;
    keywords: string[];
    context: string;
    tokensUsed?: string[];
  };
}
