import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

const SCRATCH_DIR = path.join(process.cwd(), 'scratch');
if (!existsSync(SCRATCH_DIR)) {
  mkdirSync(SCRATCH_DIR, { recursive: true });
}

async function testSynthesis() {
  console.log('=== LIVE RIME SYNTHESIS VERIFICATION ===\n');

  // First check /api/analyze on the full sentence to get the controlled sentence
  const sentence = 'The deployment is running on PostgreSQL v16 with gRPC over HTTP/2.';
  console.log('Step 0: Analyzing sentence:', sentence);
  const analyzeRes = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: sentence }),
  });
  const analyzeData = await analyzeRes.json();
  const controlledSentence = analyzeData.controlledText || 'The deployment is running on Postgres cue ell version sixteen with gee are pee see over HTTP/2.';
  console.log('Controlled Sentence:', controlledSentence);
  console.log('Detected Risks:', analyzeData.risks?.map((r: any) => `${r.text} (${r.category})`));

  const testCases = [
    { name: '1_postgresql_raw', text: 'PostgreSQL' },
    { name: '2_postgres_cue_ell', text: 'Postgres cue ell' },
    { name: '3_postgres_q_l', text: 'Postgres Q L' },
    { name: '4_postgresql_v16_spoken', text: 'PostgreSQL version sixteen' },
    { name: '5_postgres_cue_ell_v16', text: 'Postgres cue ell version sixteen' },
    { name: '6_full_sentence_raw', text: sentence },
    { name: '7_full_sentence_controlled', text: controlledSentence },
  ];

  const results: any[] = [];

  for (const tc of testCases) {
    console.log(`\nSynthesizing Case [${tc.name}]: "${tc.text}"...`);
    const start = Date.now();
    try {
      const res = await fetch('http://localhost:3000/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: tc.text,
          voice: 'astra',
          model: 'mistv3',
        }),
      });

      const latencyMs = Date.now() - start;
      if (!res.ok) {
        const errText = await res.text();
        console.error(`  FAIL HTTP ${res.status}:`, errText);
        results.push({ name: tc.name, text: tc.text, status: res.status, error: errText, latencyMs });
        continue;
      }

      const contentType = res.headers.get('content-type');
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(SCRATCH_DIR, `${tc.name}.mp3`);
      writeFileSync(filePath, buffer);

      console.log(`  SUCCESS HTTP 200: ${buffer.length} bytes, type: ${contentType}, latency: ${latencyMs}ms`);
      console.log(`  Saved: ${filePath}`);
      results.push({
        name: tc.name,
        text: tc.text,
        status: 200,
        bytes: buffer.length,
        contentType,
        latencyMs,
        filePath,
      });
    } catch (err: any) {
      console.error(`  ERROR:`, err.message);
      results.push({ name: tc.name, text: tc.text, error: err.message });
    }
  }

  console.log('\n=== SYNTHESIS SUMMARY ===');
  console.table(results.map(r => ({
    Case: r.name,
    Status: r.status,
    Bytes: r.bytes,
    Latency: `${r.latencyMs}ms`,
    Text: r.text ? (r.text.length > 35 ? r.text.slice(0, 32) + '...' : r.text) : '',
  })));

  writeFileSync(path.join(SCRATCH_DIR, 'live_rime_results.json'), JSON.stringify(results, null, 2));
}

testSynthesis().catch(console.error);
