import { SpeechRisk, RiskSeverity } from '../schemas';

interface DomainDictEntry {
  term: string;
  category: 'domain_term';
  severity: RiskSeverity;
  reason: string;
  recommendedSpoken: string;
}

const DOMAIN_TERMS_CATALOG: DomainDictEntry[] = [
  {
    term: 'Kubernetes',
    category: 'domain_term',
    severity: 'high',
    reason: 'Specialized technology term often truncated or mispronounced as "ku-ber-neets" instead of "koo-ber-NET-eez".',
    recommendedSpoken: 'koo-ber-net-eez',
  },
  {
    term: 'PostgreSQL',
    category: 'domain_term',
    severity: 'high',
    reason: 'Database name with non-standard hybrid pronunciation ("post-gres-Q-L" or "post-gres").',
    recommendedSpoken: 'Post-gres-Q-L',
  },
  {
    term: 'IPv6',
    category: 'domain_term',
    severity: 'medium',
    reason: 'Network protocol designation combining initialism and version digit ("I-P-V-six").',
    recommendedSpoken: 'I P V six',
  },
  {
    term: 'IPv4',
    category: 'domain_term',
    severity: 'medium',
    reason: 'Network protocol designation combining initialism and version digit ("I-P-V-four").',
    recommendedSpoken: 'I P V four',
  },
  {
    term: 'Neo4j',
    category: 'domain_term',
    severity: 'high',
    reason: 'Graph database name with embedded digit ("neo-four-J").',
    recommendedSpoken: 'neo four J',
  },
  {
    term: 'gRPC',
    category: 'domain_term',
    severity: 'high',
    reason: 'Protocol name blending lowercase initial and uppercase initialism ("G-R-P-C").',
    recommendedSpoken: 'G R P C',
  },
  {
    term: 'Nginx',
    category: 'domain_term',
    severity: 'high',
    reason: 'Web server name pronounced phonetically as "engine-X", completely distinct from spelling.',
    recommendedSpoken: 'engine X',
  },
  {
    term: 'GraphQL',
    category: 'domain_term',
    severity: 'medium',
    reason: 'API technology name combining "graph" and abbreviation "Q-L".',
    recommendedSpoken: 'Graph Q L',
  },
  {
    term: 'PyTorch',
    category: 'domain_term',
    severity: 'medium',
    reason: 'Machine learning framework combining "pie" and "torch".',
    recommendedSpoken: 'pie torch',
  },
  {
    term: 'DevOps',
    category: 'domain_term',
    severity: 'low',
    reason: 'Compound term ("dev-ops").',
    recommendedSpoken: 'dev ops',
  },
];

export function detectDomainTerms(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];

  for (const item of DOMAIN_TERMS_CATALOG) {
    const regex = new RegExp(`\\b${item.term}\\b`, 'gi');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      risks.push({
        id: `domain-${match.index}`,
        text: match[0],
        category: 'domain_term',
        severity: item.severity,
        reason: item.reason,
        start: match.index,
        end: match.index + match[0].length,
        confidence: 'HIGH',
        ruleMatched: `DOMAIN_${item.term.toUpperCase()}`,
      });
    }
  }

  return risks;
}
