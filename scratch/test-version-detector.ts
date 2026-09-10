// Prototype for detectVersions
import { SpeechRisk } from '../src/lib/schemas';

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
  'webpack', 'vite', 'rollup', 'eslint', 'prettier', 'tailwind', 'bootstrap'
]);

// Non-entity common words that should never be treated as entities even if capitalized at start of sentence
const EXCLUDED_PRECEDING_WORDS = new Set([
  'page', 'chapter', 'section', 'part', 'step', 'table', 'figure', 'item', 'row',
  'column', 'room', 'level', 'floor', 'gate', 'flight', 'track', 'line', 'case',
  'rule', 'test', 'question', 'answer', 'day', 'month', 'year', 'week', 'hour',
  'minute', 'second', 'time', 'grade', 'class', 'group', 'model', 'type', 'size',
  'in', 'at', 'on', 'to', 'for', 'with', 'from', 'by', 'about', 'over', 'after',
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'is', 'was', 'are', 'were'
]);

// Measurement unit suffixes that indicate numeric measurements, NOT versions
const UNIT_SUFFIX_REGEX = /^(?:kg|g|mg|m|cm|mm|km|s|ms|h|min|hz|khz|mhz|ghz|gb|mb|kb|tb|px|rem|em|%|percent|degrees?|c|f|k|v|w|a|ma|l|ml)\b/i;

export interface VersionDetection {
  fullMatch: string;
  entity?: string;
  hasVPrefix: boolean;
  versionDigits: string;
  start: number;
  end: number;
}

export function findVersionDetections(text: string): VersionDetection[] {
  const detections: VersionDetection[] = [];

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

    // Check what follows the version digits
    const afterMatch = text.slice(matchEnd).trimStart();
    if (UNIT_SUFFIX_REGEX.test(afterMatch)) {
      // Followed by measurement unit -> not a software version!
      continue;
    }

    // Check if what looks like version is actually part of a date (e.g. "12.05.2026")
    if (text.slice(matchEnd).startsWith('.') && /\.\d{4}\b/.test(text.slice(matchEnd))) {
      continue;
    }

    // Check preceding entity:
    const lowerEntity = rawEntity.toLowerCase();
    if (EXCLUDED_PRECEDING_WORDS.has(lowerEntity)) {
      continue;
    }

    const isKnownTech = KNOWN_TECH_ENTITIES.has(lowerEntity) || KNOWN_TECH_ENTITIES.has(lowerEntity.replace(/\.js$/, ''));
    const isDecimal = versionDigits.includes('.');
    const isHyphenated = separator === '-';

    // Criteria to qualify as ENTITY + VERSION:
    // 1. Explicit 'v' prefix: e.g. "Kubernetes v1.34", "App v2.0", "PostgreSQL v16"
    // 2. Known tech entity with decimal version or integer version: e.g. "Python 3.12", "CUDA 12.6", "Ubuntu 24.04", "Node.js 22", "React 19"
    // 3. Hyphenated with tech entity/acronym: e.g. "GPT-5.6", "GPT-4"
    // 4. Any capitalized word followed by 'v' version: e.g. "MyTool v1.2"
    let qualifies = false;
    if (vPrefix) {
      // With explicit 'v', any preceding word (except excluded words) qualifies
      qualifies = true;
    } else if (isKnownTech) {
      // Known tech entity followed by number
      if (isDecimal || /^\d{1,3}$/.test(versionDigits)) {
        qualifies = true;
      }
    } else if (isHyphenated && isDecimal && /^[A-Z0-9]{2,}$/.test(rawEntity)) {
      qualifies = true;
    }

    if (qualifies) {
      detections.push({
        fullMatch,
        entity: rawEntity,
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
    const alreadyCovered = detections.some(d => matchStart >= d.start && matchEnd <= d.end);
    if (alreadyCovered) {
      continue;
    }

    // Check what follows
    const afterMatch = text.slice(matchEnd).trimStart();
    if (UNIT_SUFFIX_REGEX.test(afterMatch)) {
      continue;
    }

    detections.push({
      fullMatch,
      hasVPrefix: true,
      versionDigits,
      start: matchStart,
      end: matchEnd,
    });
  }

  return detections;
}

// Test cases
const tests = [
  'v1.34',
  'v1.34.7',
  'v16',
  'Kubernetes v1.34',
  'PostgreSQL v16',
  'Python 3.12',
  'Node.js 22',
  'CUDA 12.6',
  'Ubuntu 24.04',
  'React 19',
  'GPT-5.6',
  'deployed Kubernetes v1.34 in u s e a s t one, but the API returned',
  'The database uses PostgreSQL v16.',
  '₹12.50',
  '12.50 kg',
  '12.5%',
  '12.05.2026',
  'I have 3 apples',
  'See Page 12 for details',
  'Step 4 of 10'
];

for (const t of tests) {
  const res = findVersionDetections(t);
  console.log(`"${t}" ->`, res.map(r => `[${r.fullMatch}: entity="${r.entity}", vPrefix=${r.hasVPrefix}, ver="${r.versionDigits}"]`));
}
