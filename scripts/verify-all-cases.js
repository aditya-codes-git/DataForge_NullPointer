const http = require('http');

async function testCase(title, text) {
  console.log(`\n========================================`);
  console.log(`TEST: ${title}`);
  console.log(`INPUT: "${text}"`);
  console.log(`========================================`);

  const start = Date.now();
  const res = await fetch('http://localhost:3000/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();
  const duration = Date.now() - start;

  if (!res.ok) {
    console.error(`FAILED (${res.status}):`, data);
    return false;
  }

  console.log(`Status: HTTP ${res.status} (${duration}ms)`);
  console.log(`Original: "${data.originalText}"`);
  console.log(`Controlled Candidate: "${data.controlledText}"`);
  console.log(`Decision Status: ${data.decision?.status}`);
  console.log(`Decision Summary: ${data.decision?.summary}`);
  console.log(`Decision Reason: ${data.decision?.reason}`);
  console.log(`Review Required: ${data.reviewRequired}`);
  console.log(`Risks Detected (${data.risks.length}):`, data.risks.map(r => `${r.text} (${r.category})`));
  console.log(`Transformations (${data.transformations.length}):`);
  data.transformations.forEach(t => {
    console.log(`  - [${t.action}] "${t.original}" -> "${t.replacement}" (Reason: ${t.reason})`);
  });
  console.log(`Raw Audio Available: ${data.rawAudio?.available} (${data.rawAudio?.latencyMs}ms)`);
  console.log(`Controlled Audio Available: ${data.controlledAudio?.available} (${data.controlledAudio?.latencyMs}ms)`);

  return data;
}

async function runAll() {
  try {
    // 1. Case 1
    const c1 = await testCase(
      'Case 1: Identifier + Indian Rupee',
      'Your verification code is A12B9X7 and your total is ₹1,25,000.'
    );
    if (!c1.controlledText.includes('A one two B nine X seven') || !c1.controlledText.includes('one lakh twenty-five thousand rupees')) {
      throw new Error('Case 1 assertion failed: token expansions missing');
    }

    // 2. Case 2: HTTP 429 + Kubernetes (KUBERNETES REGRESSION CHECK)
    const c2 = await testCase(
      'Case 2: HTTP 429 + Kubernetes (DETECT != CORRECT)',
      'HTTP 429 occurred while connecting to Kubernetes.'
    );
    if (!c2.controlledText.includes('HTTP four two nine')) {
      throw new Error('Case 2 assertion failed: HTTP 429 was not expanded');
    }
    if (!c2.controlledText.includes('Kubernetes')) {
      throw new Error('Case 2 assertion failed: Kubernetes should NOT be rewritten in the candidate');
    }
    if (c2.controlledText.includes('koo-ber-net-eez')) {
      throw new Error('CRITICAL FLAW: Kubernetes was rewritten to koo-ber-net-eez!');
    }
    const k8sTrans = c2.transformations.find(t => t.original === 'Kubernetes');
    if (!k8sTrans || k8sTrans.action !== 'KEEP_RAW') {
      throw new Error('Case 2 assertion failed: Kubernetes transformation action must be KEEP_RAW');
    }
    console.log('>>> VERIFIED: Kubernetes was successfully RETAINED as raw, NOT phoneticized to koo-ber-net-eez!');

    // 3. Case 3: Clean Plain English
    const c3 = await testCase(
      'Case 3: Clean Plain English',
      'Hello, how are you today?'
    );
    if (c3.risks.length !== 0 || c3.decision.status !== 'SAME_AS_RAW') {
      throw new Error('Case 3 assertion failed: Should have 0 risks and SAME_AS_RAW decision');
    }

    // 4. Case 4: Ambiguous term (XyloQ)
    const c4 = await testCase(
      'Case 4: Ambiguous term (XyloQ)',
      'The customer requested a refund for product XyloQ.'
    );
    if (!c4.reviewRequired || c4.decision.status !== 'NEEDS_REVIEW') {
      throw new Error('Case 4 assertion failed: Ambiguous term must trigger NEEDS_REVIEW');
    }

    // 5. Case 5: Pure Kubernetes alone (KEEP_RAW outcome)
    const c5 = await testCase(
      'Case 5: Pure Kubernetes (Isolated KEEP_RAW)',
      'Deploying microservices to Kubernetes cluster.'
    );
    if (c5.decision.status !== 'KEEP_RAW') {
      throw new Error('Case 5 assertion failed: Decision status must be KEEP_RAW');
    }
    if (c5.controlledText !== c5.originalText) {
      throw new Error('Case 5 assertion failed: Candidate should equal original text for KEEP_RAW');
    }
    console.log('>>> VERIFIED: Pure Kubernetes produced KEEP_RAW with "No change recommended"!');

    console.log('\n========================================');
    console.log('ALL 5 END-TO-END ACCEPTANCE CASES PASSED!');
    console.log('========================================\n');
  } catch (err) {
    console.error('\nACCEPTANCE TEST FAILED:', err);
    process.exit(1);
  }
}

runAll();
