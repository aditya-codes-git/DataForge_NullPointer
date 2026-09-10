import { SpeechRisk, DetectionMethod, RiskCategory } from './schemas';
import { detectVersions } from './risk-rules/versions';
import { detectIdentifiers } from './risk-rules/identifiers';
import { detectCurrency } from './risk-rules/currency';
import { detectNumbers } from './risk-rules/numbers';
import { detectAcronyms } from './risk-rules/acronyms';
import { detectDomainTerms } from './risk-rules/domain-terms';
import { detectDates } from './risk-rules/dates';
import { detectTimes } from './risk-rules/times';
import { detectUrls } from './risk-rules/urls';
import { detectEmails } from './risk-rules/emails';
import { detectAbbreviations } from './risk-rules/abbreviations';
import { detectAddresses } from './risk-rules/addresses';
import { detectNames } from './risk-rules/names';
import { detectAmbiguousTerms } from './risk-rules/ambiguous';

// Deterministic categories versus Contextual categories
const CONTEXTUAL_CATEGORIES = new Set<RiskCategory>([
  'name',
  'address',
  'domain_term',
  'brand',
  'ambiguous',
  'code_switched',
]);

const SECRET_PATTERNS = [
  /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b/, // GitHub
  /\b(?:sk_live|sk_test)_[0-9a-zA-Z]{20,}\b/, // Stripe
  /\bAKIA[0-9A-Z]{16}\b/, // AWS Access Key
  /\beyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\b/, // JWT
  /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/, // Private Key
  /\b(?:xox[baprs]-[0-9a-zA-Z-]{10,})\b/, // Slack
  /\b(?:gsk_[A-Za-z0-9]{20,})\b/, // Groq key pattern
];

/**
 * Detect sensitive credential-like patterns in input text
 */
export function detectSensitiveCredentials(text: string): string | null {
  if (!text) return null;
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) {
      return 'Sensitive-looking credential detected. Avoid sending real secrets to speech synthesis.';
    }
  }
  return null;
}

export function analyzeSpeechRisks(text: string): SpeechRisk[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Gather detections across all categories
  const rawDetections: Partial<SpeechRisk>[] = [
    // Structural / Deterministic
    ...detectVersions(text),
    ...detectIdentifiers(text),
    ...detectCurrency(text),
    ...detectDates(text),
    ...detectTimes(text),
    ...detectUrls(text),
    ...detectEmails(text),
    ...detectAcronyms(text),
    ...detectNumbers(text),
    ...detectAbbreviations(text),

    // Contextual
    ...detectDomainTerms(text),
    ...detectAddresses(text),
    ...detectNames(text),
    ...detectAmbiguousTerms(text),
  ];

  // Enrich with detectionMethod, investigationRequired, and contextual hints
  const enriched: SpeechRisk[] = rawDetections.map((r, i) => {
    const category = (r.category || 'domain_term') as RiskCategory;
    const isContextual = CONTEXTUAL_CATEGORIES.has(category);
    const detectionMethod: DetectionMethod = isContextual ? 'contextual' : 'deterministic';

    // In SaySure, detection does NOT mean automatic intervention.
    // Certain items (Kubernetes, known technical terms, ambiguous acronyms, versions) MUST be investigated.
    const investigationRequired =
      isContextual ||
      category === 'acronym' ||
      category === 'currency' ||
      category === 'version' ||
      category === 'ambiguous';

    const interventionRecommended =
      category === 'identifier' ||
      category === 'currency' ||
      category === 'abbreviation';

    const hints: string[] = [];
    if (category === 'acronym') hints.push('Determine whether spoken letter-by-letter or as word.');
    if (category === 'currency') hints.push('Check voice/locale suitability (e.g., lakh/crore vs thousands).');
    if (category === 'version') hints.push('Investigate spoken version articulation (digit-by-digit vs whole number).');
    if (category === 'domain_term') hints.push('Test native Rime rendering before applying phonetic transformation.');
    if (category === 'ambiguous') hints.push('Unverified proper noun or brand; human confirmation required.');

    return {
      id: r.id || `risk-${i}`,
      text: r.text || '',
      start: r.start ?? 0,
      end: r.end ?? 0,
      category,
      severity: r.severity || 'medium',
      detectionMethod,
      reason: r.reason || 'Potential pronunciation or delivery variation.',
      contextualHints: hints.length > 0 ? hints : undefined,
      interventionRecommended,
      investigationRequired,
      confidence: r.confidence || 'HIGH',
      ruleMatched: r.ruleMatched,
    };
  });

  // Resolve overlaps: Priority to earlier start, higher severity, then longer span (e.g. HTTP/2 over HTTP, PostgreSQL v16 over PostgreSQL)
  const sorted = enriched.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const severityWeight = { high: 3, medium: 2, low: 1 };
    const sevDiff = severityWeight[b.severity] - severityWeight[a.severity];
    if (sevDiff !== 0) return sevDiff;
    return (b.end - b.start) - (a.end - a.start);
  });

  const nonOverlapping: SpeechRisk[] = [];
  let lastEnd = -1;

  for (const risk of sorted) {
    if (risk.start >= lastEnd) {
      nonOverlapping.push(risk);
      lastEnd = risk.end;
    }
  }

  return nonOverlapping;
}
