async function testLiveEngine() {
  const cases = [
    { name: 'Kubernetes', text: 'Kubernetes is deployed successfully.' },
    { name: 'PostgreSQL v16', text: 'The database uses PostgreSQL v16.' },
    { name: 'SQL', text: 'The query is written in SQL.' },
    { name: 'Identifier', text: 'Your verification code is A12B9X7.' },
    { name: 'Currency', text: 'Your total is ₹1,25,000.' },
    { name: 'Clean text', text: 'Hello, how are you today?' },
    { name: 'Ambiguous XyloQ', text: 'The customer requested a refund for XyloQ.' },
    { name: 'Secret safety', text: 'Use token ghp_1234567890abcdefghijklmnopqrstuvwxyz to authenticate.' }
  ];

  console.log('--- TESTING /api/analyze ---');
  for (const c of cases) {
    const res = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: c.text, domain: 'software' })
    });
    const data = await res.json();
    console.log(`[${c.name}] HTTP ${res.status}: risks=${data.risks?.length}, candidates=${data.candidates?.length}, reviewRequired=${data.reviewRequired}, safetyWarning=${data.safetyWarning ? 'DETECTED' : 'none'}`);
  }

  console.log('\n--- TESTING /api/compare with live Rime ---');
  const compRes = await fetch('http://localhost:3000/api/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'HTTP 429 occurred while connecting to Kubernetes.' })
  });
  const compData = await compRes.json();
  console.log(`[Compare HTTP 429 + K8s] HTTP ${compRes.status}: decision=${compData.decision?.status}, rawAudio=${compData.rawAudio?.available} (${compData.rawAudio?.latencyMs}ms), controlledAudio=${compData.controlledAudio?.available} (${compData.controlledAudio?.latencyMs}ms), evidenceId=${compData.evidenceId}`);

  console.log('\n--- TESTING /api/verify ---');
  const verifyRes = await fetch('http://localhost:3000/api/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      comparisonId: compData.evidenceId,
      preference: 'RAW',
      notes: 'Native Rime handles Kubernetes naturally'
    })
  });
  const verifyData = await verifyRes.json();
  console.log(`[Verify] HTTP ${verifyRes.status}: success=${verifyData.success}, recordedPreference=${verifyData.preference}`);
}

testLiveEngine().catch(console.error);
