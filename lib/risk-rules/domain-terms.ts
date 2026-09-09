import { SpeechRisk, RiskSeverity } from '../schemas';

interface DomainDictEntry {
  pattern: RegExp;
  category: 'domain_term';
  severity: RiskSeverity;
  reason: string;
  ruleName: string;
}

const DOMAIN_TERMS_CATALOG: DomainDictEntry[] = [
  // Structured Technical Expressions (TERM + VERSION / TERM + NUMBER)
  {
    pattern: /\bPostgreSQL(?:\s+v\d+(?:\.\d+)*)?\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Structured technical phrase with version. Neither representation has been verified as clearly superior; requires listener confirmation.',
    ruleName: 'DOMAIN_POSTGRESQL',
  },
  {
    pattern: /\bPython\s+\d+(?:\.\d+)+\b/gi,
    category: 'domain_term',
    severity: 'low',
    reason: 'Structured technical phrase with decimal version; investigate whether native Rime pronunciation is natural.',
    ruleName: 'DOMAIN_PYTHON_VERSION',
  },
  {
    pattern: /\bNode\.js(?:\s+\d+)?\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Structured technical entity with dot notation and version; investigate spoken clarity.',
    ruleName: 'DOMAIN_NODEJS',
  },
  {
    pattern: /\bHTTP\/[1-3](?:\.[0-9])?\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Protocol designation combining slash separator and version number.',
    ruleName: 'DOMAIN_HTTP_VERSION',
  },
  {
    pattern: /\bGPT-[0-9](?:\.[0-9])?\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Model identifier combining acronym and version number.',
    ruleName: 'DOMAIN_GPT_VERSION',
  },

  // Technical Domain Vocabulary
  {
    pattern: /\bKubernetes\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Domain vocabulary with potential pronunciation sensitivity; investigated against native Rime synthesis.',
    ruleName: 'DOMAIN_KUBERNETES',
  },
  {
    pattern: /\bIPv6\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Network protocol designation combining initialism and version digit ("I-P-V-six").',
    ruleName: 'DOMAIN_IPV6',
  },
  {
    pattern: /\bIPv4\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Network protocol designation combining initialism and version digit ("I-P-V-four").',
    ruleName: 'DOMAIN_IPV4',
  },
  {
    pattern: /\bNeo4j\b/gi,
    category: 'domain_term',
    severity: 'high',
    reason: 'Graph database name with embedded digit ("neo-four-J").',
    ruleName: 'DOMAIN_NEO4J',
  },
  {
    pattern: /\bgRPC\b/gi,
    category: 'domain_term',
    severity: 'high',
    reason: 'Protocol name blending lowercase initial and uppercase initialism ("G-R-P-C").',
    ruleName: 'DOMAIN_GRPC',
  },
  {
    pattern: /\bNginx\b/gi,
    category: 'domain_term',
    severity: 'high',
    reason: 'Web server name pronounced phonetically as "engine-X", completely distinct from spelling.',
    ruleName: 'DOMAIN_NGINX',
  },
  {
    pattern: /\bGraphQL\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'API technology name combining "graph" and abbreviation "Q-L".',
    ruleName: 'DOMAIN_GRAPHQL',
  },
  {
    pattern: /\bPyTorch\b/gi,
    category: 'domain_term',
    severity: 'medium',
    reason: 'Machine learning framework combining "pie" and "torch".',
    ruleName: 'DOMAIN_PYTORCH',
  },
  {
    pattern: /\bDevOps\b/gi,
    category: 'domain_term',
    severity: 'low',
    reason: 'Compound term ("dev-ops").',
    ruleName: 'DOMAIN_DEVOPS',
  },
];

export function detectDomainTerms(text: string): SpeechRisk[] {
  const risks: SpeechRisk[] = [];

  for (const item of DOMAIN_TERMS_CATALOG) {
    // Reset regex index before execution
    item.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = item.pattern.exec(text)) !== null) {
      risks.push({
        id: `domain-${match.index}`,
        text: match[0],
        category: 'domain_term',
        severity: item.severity,
        reason: item.reason,
        start: match.index,
        end: match.index + match[0].length,
        confidence: 'HIGH',
        ruleMatched: item.ruleName,
      });
    }
  }

  return risks;
}
