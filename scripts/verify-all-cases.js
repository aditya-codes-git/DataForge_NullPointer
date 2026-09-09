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
  console.log(`Item-Level Transformations (${data.transformations.length}):`);
  data.transformations.forEach(t => {
    console.log(`  - [${t.action}] "${t.original}" -> "${t.replacement}" (Reason: ${t.reason})`);
  });
  console.log(`Raw Audio Available: ${data.rawAudio?.available} (${data.rawAudio?.latencyMs}ms)`);
  console.log(`Controlled Audio Available: ${data.controlledAudio?.available} (${data.controlledAudio?.latencyMs}ms)`);

  return data;
}

async function runAll() {
  try {
    // 1. Case 1: HTTP 429 + Kubernetes (Regression Case 1)
    const c1 = await testCase(
      'Case 1: HTTP 429 + Kubernetes',
      'HTTP 429 occurred while connecting to Kubernetes.'
    );
    if (!c1.controlledText.includes('HTTP four two nine')) {
      throw new Error('Case 1 failed: HTTP 429 was not expanded');
    }
    if (!c1.controlledText.includes('Kubernetes') || c1.controlledText.includes('koo-ber-net-eez')) {
      throw new Error('Case 1 failed: Kubernetes should NOT be phoneticized');
    }
    const k8sTrans = c1.transformations.find(t => t.original === 'Kubernetes');
    if (!k8sTrans || k8sTrans.action !== 'KEEP_RAW') {
      throw new Error('Case 1 failed: Kubernetes action must be KEEP_RAW');
    }
    console.log('>>> VERIFIED: Kubernetes retained raw without koo-ber-net-eez!');

    // 2. Case 2: PostgreSQL v16 (Regression Case 2)
    const c2 = await testCase(
      'Case 2: PostgreSQL v16 Migration (Structured Expression)',
      'Your PostgreSQL v16 migration completed successfully.'
    );
    if (!c2.controlledText.includes('PostgreSQL') || !c2.controlledText.includes('16')) {
      throw new Error('Case 2 failed: PostgreSQL or version 16 corrupted');
    }
    if (!c2.reviewRequired || c2.decision.status !== 'NEEDS_REVIEW') {
      throw new Error('Case 2 failed: PostgreSQL v16 must trigger NEEDS_REVIEW');
    }
    console.log('>>> VERIFIED: PostgreSQL v16 handled as structured technical phrase without mangling!');

    // 3. Case 3: Indian Currency ₹1,25,000 (Regression Case 3)
    const c3 = await testCase(
      'Case 3: Indian Currency (Locale & Denomination Awareness)',
      'Your total is ₹1,25,000.'
    );
    if (!c3.controlledText.includes('one lakh twenty-five thousand rupees')) {
      throw new Error('Case 3 failed: Lakh denomination missing');
    }
    const currTrans = c3.transformations.find(t => t.category === 'currency');
    if (!currTrans.reason.includes('locale')) {
      throw new Error('Case 3 failed: Currency reason should reflect potential locale/pronunciation awareness');
    }
    console.log('>>> VERIFIED: ₹1,25,000 converted with mathematical preservation and locale awareness!');

    // 4. Case 4: Code A12B9X7 (Regression Case 4)
    const c4 = await testCase(
      'Case 4: Alphanumeric Identifier A12B9X7',
      'Your verification code is A12B9X7.'
    );
    if (!c4.controlledText.includes('A one two B nine X seven')) {
      throw new Error('Case 4 failed: Identifier was not spelled digit-by-digit');
    }
    console.log('>>> VERIFIED: A12B9X7 accurately spelled digit-by-digit!');

    // 5. Case 5: Ambiguous XyloQ (Regression Case 5)
    const c5 = await testCase(
      'Case 5: Ambiguous token XyloQ',
      'The customer requested a refund for XyloQ.'
    );
    if (!c5.reviewRequired || c5.decision.status !== 'NEEDS_REVIEW') {
      throw new Error('Case 5 failed: XyloQ must trigger NEEDS_REVIEW');
    }
    console.log('>>> VERIFIED: XyloQ flagged as NEEDS_REVIEW without blind guessing!');

    // 6. Case 6: Clean speech (Regression Case 6)
    const c6 = await testCase(
      'Case 6: Clean speech',
      'Hello, how are you today?'
    );
    if (c6.risks.length !== 0 || c6.decision.status !== 'SAME_AS_RAW') {
      throw new Error('Case 6 failed: Clean sentence must produce 0 risks and SAME_AS_RAW');
    }
    console.log('>>> VERIFIED: Clean speech preserved as SAME_AS_RAW!');

    // 7. Case 7: Python 3.12 on Node.js 22 (Regression Case 7)
    const c7 = await testCase(
      'Case 7: Python 3.12 on Node.js 22 (Multi-Entity Technical Expressions)',
      'Python 3.12 is installed on Node.js 22.'
    );
    if (!c7.controlledText.includes('Python 3.12')) {
      throw new Error('Case 7 failed: Python 3.12 must be preserved');
    }
    if (!c7.controlledText.includes('Node dot js 22')) {
      throw new Error('Case 7 failed: Node.js 22 should be safely articulated');
    }
    console.log('>>> VERIFIED: Python 3.12 preserved and Node.js 22 safely articulated!');

    // 8. Case 8: IPv6 support (Regression Case 8)
    const c8 = await testCase(
      'Case 8: IPv6 Protocol Designation',
      'IPv6 support is enabled.'
    );
    if (!c8.controlledText.includes('I P V six')) {
      throw new Error('Case 8 failed: IPv6 should be articulated as I P V six');
    }
    console.log('>>> VERIFIED: IPv6 separated into clear initialism + version digit!');

    console.log('\n======================================================');
    console.log('ALL 8 REAL-WORLD REGRESSION CASES SUCCESSFULLY PASSED!');
    console.log('======================================================\n');
  } catch (err) {
    console.error('\nACCEPTANCE TEST FAILED:', err);
    process.exit(1);
  }
}

runAll();
