import React from 'react';
import { ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DocsPage() {
  const sections = [
    {
      id: 'getting-started',
      title: '1. Getting Started',
      content:
        'SaySure acts as an acoustic QA layer between LLM text generation and Text-to-Speech synthesis. It identifies words that look correct in writing but degrade acoustically when rendered into speech.',
    },
    {
      id: 'how-it-works',
      title: '2. How SaySure Works',
      content:
        'When input text is submitted, SaySure executes deterministic regex and contextual detectors to find known pronunciation risks (version numbers, domain terms, identifiers, currencies). If risks are detected, candidate speech-ready phrases are synthesized under identical parameters with Rime TTS.',
    },
    {
      id: 'speech-risks',
      title: '3. Speech Risks & Categories',
      content:
        'SaySure handles 5 distinct risk classes: Domain Terms (e.g. PostgreSQL, Kubernetes), Technical Versions (v16, 3.12), Currencies with localized notation (₹1,25,000 -> one lakh twenty-five thousand rupees), Identifiers (A12B9X7), and Ambiguous tokens requiring human review.',
    },
    {
      id: 'candidates',
      title: '4. Candidate Representations',
      content:
        'Rather than replacing terms arbitrarily, SaySure computes ranked candidate spellings (such as "Postgres cue ell", "Postgres Q L", "PostgreSQL"). Each candidate is tested for letter/digit preservation before being proposed.',
    },
    {
      id: 'fair-comparison',
      title: '5. Fair Acoustic Comparison',
      content:
        'Both RAW written text and candidate audio are synthesized side-by-side using the same Rime model (mistv3), voice (astra), and audio codec (audio/mpeg), allowing audio waveforms to be compared objectively.',
    },
    {
      id: 'verification',
      title: '6. Listener Verification & Memory',
      content:
        'Engineers can submit double-blind preference feedback directly in the Laboratory. Observed preferences seed the provenance evidence store for persistent accuracy.',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
            Documentation
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Developer guides on phonetic risk analysis, candidate scoring, and Rime TTS delivery.
          </p>
        </div>

        <a
          href="https://users.rime.ai/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
        >
          <span>Rime Official Docs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Content Sections */}
      <div className="space-y-6 divide-y divide-neutral-100">
        {sections.map((section) => (
          <section key={section.id} className="pt-6 first:pt-0 space-y-2">
            <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-neutral-950">
              {section.title}
            </h2>
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>

      {/* Action footer */}
      <div className="p-5 bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-mono text-neutral-800">
            Ready to test your voice pipeline?
          </span>
        </div>
        <Link
          to="/dashboard/analyze"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          <span>Open Interactive Laboratory →</span>
        </Link>
      </div>
    </div>
  );
}
