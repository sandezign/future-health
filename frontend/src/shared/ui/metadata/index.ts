import { ComponentMetadata } from './types';
import { buttonMetadata } from './button.meta';
import { badgeMetadata } from './badge.meta';
import { cardMetadata } from './card.meta';
import { inputMetadata } from './input.meta';
import { modalMetadata } from './modal.meta';

export * from './types';
export * from './button.meta';
export * from './badge.meta';
export * from './card.meta';
export * from './input.meta';
export * from './modal.meta';

/**
 * Canonical AI Component Metadata Registry
 * Maps each design system primitive name to its AI-ready metadata definition.
 */
export const componentMetadataRegistry: Record<string, ComponentMetadata> = {
  Button: buttonMetadata,
  Badge: badgeMetadata,
  Card: cardMetadata,
  Input: inputMetadata,
  Modal: modalMetadata,
};

/**
 * Retrieve metadata for a specific component by name.
 */
export function getComponentMetadata(name: string): ComponentMetadata | undefined {
  return componentMetadataRegistry[name];
}

/**
 * Retrieve all registered component metadata entries.
 */
export function getAllComponentMetadata(): ComponentMetadata[] {
  return Object.values(componentMetadataRegistry);
}

/**
 * Search components by keyword or task description (for AI prompt routing).
 */
export function searchComponentsByKeyword(keyword: string): ComponentMetadata[] {
  const normalized = keyword.toLowerCase().trim();
  return getAllComponentMetadata().filter((meta) => {
    const inName = meta.component.name.toLowerCase().includes(normalized);
    const inDesc = meta.component.description.toLowerCase().includes(normalized);
    const inKeywords = meta.aiHints.keywords.some((kw) => kw.toLowerCase().includes(normalized));
    const inUseCases = meta.usage.useCases.some((uc) => uc.toLowerCase().includes(normalized));
    return inName || inDesc || inKeywords || inUseCases;
  });
}

/**
 * Export all component metadata as a serialized JSON string for injection
 * into LLM context windows, system prompts, or agent tool calling schemas.
 */
export function exportAiCatalogJson(): string {
  return JSON.stringify(componentMetadataRegistry, null, 2);
}
