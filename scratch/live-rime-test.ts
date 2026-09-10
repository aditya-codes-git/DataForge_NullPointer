import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { analyzeSpeechRisks } from '../src/lib/risk-detector';
import { generateControlledText } from '../src/lib/controlled-text';
import { runFairTtsExperiment } from '../src/lib/tts-runner';
import { getPublicRimeConfig } from '../src/lib/rime';

async function runLiveTest() {
  console.log('=== SAYSURE LIVE RIME SYNTHESIS TEST ===');
  const config = getPublicRimeConfig();
  console.log('Rime Config:', {
    model: config.model,
    voice: config.voice,
    format: config.format,
    language: config.language,
    endpoint: config.endpoint,
    connected: config.connected,
  });

  const testPhrases = [
    'v1.34',
    'Kubernetes v1.34',
    'PostgreSQL v16',
    'Python 3.12',
    'CUDA 12.6',
  ];

  for (const phrase of testPhrases) {
    console.log(`\n----------------------------------------`);
    console.log(`TEST TARGET: "${phrase}"`);
    const risks = analyzeSpeechRisks(phrase);
    console.log('Detected Risks:', risks.map(r => `${r.text} [${r.category}, rule: ${r.ruleMatched}]`));

    const controlled = await generateControlledText(phrase, risks);
    console.log(`Controlled Text: "${controlled.controlledText}"`);
    console.log('Changes:');
    for (const c of controlled.changes) {
      console.log(`  ${c.original} -> "${c.replacement}" [${c.action}]`);
      if (c.candidates) {
        c.candidates.forEach((cand, i) => {
          const t = 'candidateText' in cand ? cand.candidateText : cand.text;
          console.log(`    Candidate ${i + 1}: "${t}"`);
        });
      }
    }

    // Run Fair TTS Experiment with Rime API
    const candidatesForTts = (controlled.changes[0]?.candidates || []).map((cand, idx) => {
      const t = 'candidateText' in cand ? cand.candidateText : cand.text;
      return {
        id: `cand-${idx + 1}`,
        label: `Candidate ${idx + 1}`,
        text: t,
      };
    });

    // If no candidate list, use controlledText
    if (candidatesForTts.length === 0 && controlled.controlledText !== phrase) {
      candidatesForTts.push({
        id: 'cand-1',
        label: 'Controlled Candidate',
        text: controlled.controlledText,
      });
    }

    console.log(`Synthesizing RAW ("${phrase}") and ${candidatesForTts.length} Candidate(s) through Rime...`);
    const experiment = await runFairTtsExperiment(phrase, candidatesForTts);

    console.log(`Rime Experiment Finished in ${experiment.totalSynthesisMs}ms`);
    console.log(`  RAW Audio:`);
    console.log(`    Available: ${experiment.raw.audio.available}`);
    console.log(`    Latency: ${experiment.raw.audio.latencyMs}ms`);
    console.log(`    Format: ${experiment.raw.audio.audioFormat}`);
    console.log(`    Data URI length: ${experiment.raw.audio.dataUri?.length || 0} chars`);
    console.log(`    MIME Type: ${experiment.raw.audio.mimeType}`);

    for (const c of experiment.candidates) {
      console.log(`  ${c.label} ("${c.text}") Audio:`);
      console.log(`    Available: ${c.audio.available}`);
      console.log(`    Latency: ${c.audio.latencyMs}ms`);
      console.log(`    Data URI length: ${c.audio.dataUri?.length || 0} chars`);
      console.log(`    MIME Type: ${c.audio.mimeType}`);
    }
  }
}

runLiveTest().catch(console.error);
