import { SpeechRisk } from '../schemas';

// Common technical entities that can be followed by versions (with or without 'v')
const KNOWN_TECH_ENTITIES = new Set([
  'kubernetes', 'postgresql', 'postgres', 'python', 'nodejs', 'node.js', 'node',
  'cuda', 'ubuntu', 'react', 'docker', 'linux', 'java', 'go', 'golang', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'typescript', 'scala', 'elixir', 'erlang',
  'haskell', 'dart', 'flutter', 'electron', 'vue', 'angular', 'svelte', 'next.js',
  'nextjs', 'nuxt', 'django', 'flask', 'fastapi', 'spring', 'rails', 'laravel',
  'express', 'tensorflow', 'pytorch', 'opencv', 'redis', 'mongodb', 'kafka',
  'elasticsearch', 'cassandra', 'mysql', 'mariadb', 'sqlite', 'cockroachdb',
  'clickhouse', 'neo4j', 'nginx', 'apache', 'caddy', 'traefik', 'envoy', 'istio',
  'terraform', 'ansible', 'prometheus', 'grafana', 'debian', 'fedora', 'centos',
  'rhel', 'alpine', 'arch', 'macos', 'ios', 'android', 'windows', 'gpt', 'claude',
  'llama', 'mistral', 'gemini', 'openssl', 'llvm', 'gcc', 'clang', 'v8', 'babel',
  'webpack', 'vite', 'rollup', 'eslint', 'prettier', 'tailwind', 'bootstrap',
  'grpc', 'graphql', 'webrtc'
]);

// Non-entity common words that should never be treated as entities even if capitalized at start of sentence
const EXCLUDED_PRECEDING_WORDS = new Set([
  'page', 'chapter', 'section', 'part', 'step', 'table', 'figure', 'item', 'row',
  'column', 'room', 'level', 'floor', 'gate', 'flight', 'track', 'line', 'case',
  'rule', 'test', 'question', 'answer', 'day', 'month', 'year', 'week', 'hour',
  'minute', 'second', 'time', 'grade', 'class', 'group', 'model', 'type', 'size',
  'in', 'at', 'on', 'to', 'for', 'with', 'from', 'by', 'about', 'over', 'after',
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'is', 'was', 'are', 'were',
  'have', 'had', 'has', 'bought', 'found', 'got', 'saw', 'see', 'need', 'want'
]);

// Measurement unit suffixes that indicate numeric measurements, NOT versions
const UNIT_SUFFIX_REGEX = /^(?:%|percent\b|(?:kg|g|mg|m|cm|mm|km|s|ms|h|min|hz|khz|mhz|ghz|gb|mb|kb|tb|px|rem|em|degrees?|c|f|k|v|w|a|ma|l|ml)\b)/i;

export interface VersionInfo {
  fullMatch: string;
  entity?: string;
  hasVPrefix: boolean;
  versionDigits: string;
  separator: string;
  start: number;
  end: number;
}

export function parseVersionInfo(text: string): VersionInfo | null {
  // Pattern 1: ENTITY[-]v?N.N[.N] or ENTITY vN or ENTITY N.N
  const entityMatch = /^([A-Za-z][A-Za-z0-9_.]*)\s*([-\s])\s*(v|V)?(\d+(?:\.\d+)*)$/.exec(text);
  if (entityMatch) {
    return {
      fullMatch: text,
      entity: entityMatch[1],
      separator: entityMatch[2],
      hasVPrefix: Boolean(entityMatch[3]),
      versionDigits: entityMatch[4],
      start: 0,
      end: text.length,
    };
  }

  // Pattern 2: Standalone vN.N[.N] or vN
  const standaloneMatch = /^(v|V)(\d+(?:\.\d+)*)$/.exec(text);
  if (standaloneMatch) {
    return {
      fullMatch: text,
      separator: '',
      hasVPrefix: true,
      versionDigits: standaloneMatch[2],
      start: 0,
      end: text.length,
    };
  }

  // Pattern 3: Standalone decimal or multi-segment version without 'v' (e.g. "1.34", "3.12", "12.6", "24.04", "1.34.7")
  const standaloneDecimalMatch = /^(\d+\.\d+(?:\.\d+)*)$/.exec(text);
  if (standaloneDecimalMatch) {
    return {
      fullMatch: text,
      separator: '',
      hasVPrefix: false,
      versionDigits: standaloneDecimalMatch[1],
      start: 0,
      end: text.length,
    };
  }

  return null;
}

export function detectVersions(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];
  const matches: VersionInfo[] = [];

  // Pattern 1: ENTITY[-]v?N.N[.N] or ENTITY vN or ENTITY N.N
  // Group 1: Preceding word/entity (e.g. "Kubernetes", "Node.js", "GPT", "Python")
  // Group 2: Separator (' ' or '-')
  // Group 3: Optional 'v' or 'V'
  // Group 4: Version digits (e.g. "1.34", "16", "3.12", "12.6", "24.04")
  const entityVersionRegex = /\b([A-Za-z][A-Za-z0-9_.]*)\s*([-\s])\s*(v|V)?(\d+(?:\.\d+)*)\b/g;

  let match: RegExpExecArray | null;
  while ((match = entityVersionRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const rawEntity = match[1];
    const separator = match[2];
    const vPrefix = Boolean(match[3]);
    const versionDigits = match[4];
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    // Reject if followed by measurement units (e.g. "12.50 kg")
    const afterMatch = text.slice(matchEnd).trimStart();
    if (UNIT_SUFFIX_REGEX.test(afterMatch)) {
      continue;
    }

    // Reject if what looks like version is actually part of a date (e.g. "12.05.2026")
    if (text.slice(matchEnd).startsWith('.') && /\.\d{4}\b/.test(text.slice(matchEnd))) {
      continue;
    }

    // Check preceding entity
    const lowerEntity = rawEntity.toLowerCase();
    if (EXCLUDED_PRECEDING_WORDS.has(lowerEntity)) {
      continue;
    }

    const isKnownTech = KNOWN_TECH_ENTITIES.has(lowerEntity) || KNOWN_TECH_ENTITIES.has(lowerEntity.replace(/\.js$/, ''));
    const isDecimal = versionDigits.includes('.');
    const isHyphenated = separator === '-';

    let qualifies = false;
    if (vPrefix) {
      // With explicit 'v', any valid entity qualifies (e.g. "Kubernetes v1.34", "PostgreSQL v16")
      qualifies = true;
    } else if (isKnownTech) {
      // Known tech entity followed by decimal or integer version (e.g. "Python 3.12", "Node.js 22", "CUDA 12.6", "Ubuntu 24.04", "React 19")
      if (isDecimal || /^\d{1,3}$/.test(versionDigits)) {
        qualifies = true;
      }
    } else if (isHyphenated && isDecimal && /^[A-Z0-9]{2,}$/.test(rawEntity)) {
      // Hyphenated model / version (e.g. "GPT-5.6")
      qualifies = true;
    }

    if (qualifies) {
      matches.push({
        fullMatch,
        entity: rawEntity,
        separator,
        hasVPrefix: vPrefix,
        versionDigits,
        start: matchStart,
        end: matchEnd,
      });
    }
  }

  // Pattern 2: Standalone version with explicit 'v' prefix: e.g. "v1.34", "v1.34.7", "v16"
  const standaloneVRegex = /\b(v|V)(\d+(?:\.\d+)*)\b/g;
  while ((match = standaloneVRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const versionDigits = match[2];
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    // Check if this was already covered by an ENTITY + VERSION detection
    const alreadyCovered = matches.some((d) => matchStart >= d.start && matchEnd <= d.end);
    if (alreadyCovered) {
      continue;
    }

    const afterMatch = text.slice(matchEnd).trimStart();
    if (UNIT_SUFFIX_REGEX.test(afterMatch)) {
      continue;
    }

    matches.push({
      fullMatch,
      separator: '',
      hasVPrefix: true,
      versionDigits,
      start: matchStart,
      end: matchEnd,
    });
  }

  // Pattern 3: Standalone decimal or multi-segment version number without 'v' prefix:
  // e.g. "1.34", "3.12", "12.6", "24.04", "1.34.7"
  const standaloneDecimalRegex = /(?:^|(?<=[^\w.]))(\d+\.\d+(?:\.\d+)*)(?=[^\w.]|$)/g;
  while ((match = standaloneDecimalRegex.exec(text)) !== null) {
    const fullMatch = match[1];
    const versionDigits = fullMatch;
    const matchStart = match.index;
    const matchEnd = matchStart + fullMatch.length;

    // Reject if already covered by an ENTITY + VERSION or v-prefixed detection
    const alreadyCovered = matches.some((d) => matchStart >= d.start && matchEnd <= d.end);
    if (alreadyCovered) {
      continue;
    }

    // Exclude currency symbols preceding the number: e.g. ₹12.50, $12.50, €12.50, £12.50
    const beforeSlice = text.slice(Math.max(0, matchStart - 4), matchStart).trim();
    if (/[₹$€£]|(?:rs\.?|inr|usd|eur|gbp)\s*$/i.test(beforeSlice)) {
      continue;
    }

    // Exclude if followed by measurement unit or percent: e.g. "12.50 kg", "12.5%"
    const afterMatch = text.slice(matchEnd).trimStart();
    if (UNIT_SUFFIX_REGEX.test(afterMatch)) {
      continue;
    }

    // Exclude if part of a date: e.g. "12.05.2026"
    if (text.slice(matchEnd).startsWith('.') && /\.\d{4}\b/.test(text.slice(matchEnd))) {
      continue;
    }

    matches.push({
      fullMatch,
      separator: '',
      hasVPrefix: false,
      versionDigits,
      start: matchStart,
      end: matchEnd,
    });
  }

  for (const m of matches) {
    const hasDecimal = m.versionDigits.includes('.');
    const severity = m.entity ? 'high' : hasDecimal ? 'medium' : 'low';
    const reason = m.entity
      ? `Structured technical entity with version ("${m.fullMatch}"). Requires clear acoustic articulation without merging entity name and digits.`
      : `Version designation ("${m.fullMatch}"). Decimal components benefit from unambiguous spoken articulation.`;

    risks.push({
      id: `ver-${m.start}`,
      text: m.fullMatch,
      category: 'version',
      severity,
      reason,
      start: m.start,
      end: m.end,
      confidence: 'HIGH',
      ruleMatched: 'TECHNICAL_VERSION',
      investigationRequired: true,
      detectionMethod: 'deterministic',
    });
  }

  return risks;
}
