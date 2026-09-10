import { findVersionDetections } from './test-version-detector';
import { formatVersionSpoken } from './test-version-helper';

function generateCandidatesForVersion(det: ReturnType<typeof findVersionDetections>[0]) {
  const { entity, hasVPrefix, versionDigits, fullMatch } = det;
  const spokenVer = formatVersionSpoken(versionDigits);

  // Entity spoken variants
  let entityVariants = [entity];
  if (entity?.toLowerCase() === 'postgresql') {
    entityVariants = ['Postgres cue ell', 'Postgres Q L', 'PostgreSQL'];
  } else if (entity?.toLowerCase() === 'node.js') {
    entityVariants = ['Node dot js'];
  } else if (entity?.toLowerCase() === 'gpt') {
    entityVariants = ['G P T', 'GPT'];
  }

  const candidates: { text: string; reason: string; rank: number }[] = [];

  if (entity) {
    if (entity.toLowerCase() === 'postgresql') {
      // PostgreSQL v16 preservation of existing exact candidate texts
      const verWord = spokenVer.digitByDigit;
      candidates.push({
        text: `Postgres cue ell version ${verWord}`,
        reason: 'Natural spoken words ("cue ell") designed to guide TTS pronunciation.',
        rank: 1,
      });
      candidates.push({
        text: `Postgres Q L version ${verWord}`,
        reason: 'Spoken abbreviation with uppercase letters.',
        rank: 2,
      });
      candidates.push({
        text: `PostgreSQL version ${verWord}`,
        reason: 'Preserves raw entity name while expanding version indicator.',
        rank: 3,
      });
    } else if (entity.toLowerCase() === 'node.js') {
      candidates.push({
        text: `Node dot js ${spokenVer.digitByDigit}`,
        reason: "Disambiguated domain extension 'dot js' for clear spoken delivery while preserving version number.",
        rank: 1,
      });
      candidates.push({
        text: `Node dot js ${versionDigits}`,
        reason: 'Preserves version digits with disambiguated entity.',
        rank: 2,
      });
      candidates.push({
        text: fullMatch,
        reason: 'Raw baseline candidate.',
        rank: 3,
      });
    } else if (hasVPrefix) {
      // e.g. Kubernetes v1.34
      const primaryEntity = entityVariants[0] || entity;
      candidates.push({
        text: `${primaryEntity} version ${spokenVer.digitByDigit}`,
        reason: 'Natural spoken candidate with digit-by-digit version articulation.',
        rank: 1,
      });
      if (spokenVer.grouped !== spokenVer.digitByDigit) {
        candidates.push({
          text: `${primaryEntity} version ${spokenVer.grouped}`,
          reason: 'Natural spoken candidate with grouped version articulation.',
          rank: 2,
        });
      }
      candidates.push({
        text: fullMatch,
        reason: 'Raw baseline candidate.',
        rank: candidates.length + 1,
      });
    } else {
      // e.g. Python 3.12, CUDA 12.6, Ubuntu 24.04, React 19, GPT-5.6
      for (const ent of entityVariants) {
        candidates.push({
          text: `${ent} ${spokenVer.digitByDigit}`,
          reason: 'Natural spoken candidate with digit-by-digit version articulation.',
          rank: candidates.length + 1,
        });
        if (spokenVer.grouped !== spokenVer.digitByDigit && candidates.length < 3) {
          candidates.push({
            text: `${ent} ${spokenVer.grouped}`,
            reason: 'Natural spoken candidate with grouped version articulation.',
            rank: candidates.length + 1,
          });
        }
      }
      if (!candidates.some(c => c.text.toLowerCase() === fullMatch.toLowerCase()) && candidates.length < 3) {
        candidates.push({
          text: fullMatch,
          reason: 'Raw baseline candidate.',
          rank: candidates.length + 1,
        });
      }
    }
  } else {
    // Standalone version (v1.34, v1.34.7, v16)
    candidates.push({
      text: `version ${spokenVer.digitByDigit}`,
      reason: 'Expanded version indicator with digit-by-digit spoken delivery.',
      rank: 1,
    });
    if (spokenVer.grouped !== spokenVer.digitByDigit) {
      candidates.push({
        text: `version ${spokenVer.grouped}`,
        reason: 'Expanded version indicator with grouped spoken delivery.',
        rank: 2,
      });
    }
    candidates.push({
      text: fullMatch,
      reason: 'Raw baseline candidate.',
      rank: candidates.length + 1,
    });
  }

  return candidates.slice(0, 3);
}

const testStrings = [
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
  'deployed Kubernetes v1.34 in u s e a s t one, but the API returned'
];

for (const s of testStrings) {
  const dets = findVersionDetections(s);
  console.log(`\nInput: "${s}"`);
  for (const d of dets) {
    const cands = generateCandidatesForVersion(d);
    console.log(`  Detection [${d.fullMatch}]:`);
    cands.forEach(c => console.log(`    Rank ${c.rank}: "${c.text}" (${c.reason})`));
  }
}
