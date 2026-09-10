// TEMPORARY hackathon override — remove once general decimal-version
// detection (versions.ts / deterministic-transform.ts) and a proper
// pronunciation-knowledge entry for "Ubuntu" are in place.

import { Transformation } from './schemas';

/**
 * Hardcoded pronunciation overrides for demo.
 * Matched longest-first, case-sensitive exact substring match.
 * Each entry maps a written form to a spoken-friendly replacement.
 */
const OVERRIDES: [string, string][] = [
  // Longest matches first so "Ubuntu 24.04" wins over bare "Ubuntu"
  ['Ubuntu 24.04',      'oo boon too twenty-four oh four'],
  ['Kubernetes v1.34',  'Kubernetes version one point three four'],
  ['Ubuntu',            'oo boon too'],
];

export interface OverrideResult {
  text: string;
  changes: Transformation[];
}

/**
 * Apply hardcoded overrides to input text.
 * Returns the modified text and a list of Transformation records
 * for each override that matched.
 *
 * Sorted longest-match-first to avoid partial conflicts.
 */
export function applyHardcodedOverrides(input: string): OverrideResult {
  let text = input;
  const changes: Transformation[] = [];

  // Sort by key length descending (longest match first)
  const sorted = [...OVERRIDES].sort((a, b) => b[0].length - a[0].length);

  for (const [pattern, replacement] of sorted) {
    let idx = text.indexOf(pattern);
    while (idx !== -1) {
      text = text.slice(0, idx) + replacement + text.slice(idx + pattern.length);
      changes.push({
        original: pattern,
        replacement,
        category: 'domain_term' as const,
        action: 'USE_CONTROLLED' as const,
        confidence: 'HIGH' as const,
        evidenceStatus: 'verified' as const,
        reason: `Hardcoded pronunciation override (hackathon demo)`,
      });
      // Search for next occurrence after the replacement
      idx = text.indexOf(pattern, idx + replacement.length);
    }
  }

  return { text, changes };
}

/**
 * Check if any hardcoded overrides would match the given text.
 */
export function hasHardcodedOverrides(text: string): boolean {
  return OVERRIDES.some(([pattern]) => text.includes(pattern));
}
