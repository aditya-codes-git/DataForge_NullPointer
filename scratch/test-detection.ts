import { analyzeSpeechRisks } from '../src/lib/risk-detector';
import { generateCandidatesForRisks } from '../src/lib/candidate-generator';

const testCases = [
  'v1.34',
  'Kubernetes v1.34',
  'PostgreSQL v16',
  'Python 3.12',
  'Node.js 22',
  'CUDA 12.6',
  'Ubuntu 24.04',
  'React 19',
  'GPT-5.6',
  'v1.34.7',
  'deployed Kubernetes v1.34 in u s e a s t one, but the API returned',
  '₹12.50',
  '12.50 kg',
  '12.5%',
  '12.05.2026'
];

for (const tc of testCases) {
  const risks = analyzeSpeechRisks(tc);
  const candResult = generateCandidatesForRisks(tc, risks);
  console.log(`\nInput: "${tc}"`);
  console.log(`  Risks:`, risks.map(r => `"${r.text}" (${r.category}, rule: ${r.ruleMatched})`));
  console.log(`  Controlled: "${candResult.primaryControlledText}"`);
  console.log(`  Changes:`, candResult.changes.map(c => `${c.original} -> ${c.replacement} [${c.action}]`));
}
