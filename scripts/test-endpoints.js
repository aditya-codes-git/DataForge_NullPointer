async function runTests() {
  const cases = [
    {
      id: 'CASE 1',
      text: 'Your verification code is A12B9X7 and your total is ₹1,25,000.',
    },
    {
      id: 'CASE 2',
      text: 'HTTP 429 occurred while connecting to Kubernetes.',
    },
    {
      id: 'CASE 3',
      text: 'Hello, how are you today?',
    },
    {
      id: 'CASE 4',
      text: 'The customer requested a refund for product XyloQ.',
    },
  ];

  for (const c of cases) {
    console.log(`\n================== TESTING ${c.id} ==================`);
    console.log(`Input: "${c.text}"`);

    const res = await fetch('http://localhost:3000/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: c.text }),
    });

    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Controlled Text:', data.controlledText);
    console.log('Risks Detected:', data.risks.map((r) => `${r.text} (${r.category})`));
    console.log('Changes Applied:', data.changes.map((ch) => `${ch.original} -> "${ch.replacement}"`));
    console.log('Review Required:', data.reviewRequired);
    console.log('Raw Audio Available:', data.rawAudio?.available, data.rawAudio?.error || '');
    console.log('Controlled Audio Available:', data.controlledAudio?.available, data.controlledAudio?.error || '');
    console.log('Timing:', data.timing);
  }
}

runTests().catch(console.error);
