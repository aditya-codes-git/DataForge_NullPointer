'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, Mic2, Plus, Sparkles, AudioWaveform } from 'lucide-react';

export default function ProjectsPage() {
  const defaultWorkflows = [
    {
      id: 'default-tts',
      name: 'Default Voice Agent QA',
      description: 'Standard speech-risk testing on technical vocabulary and Indian numbering values with Rime Astra.',
      voice: 'Astra (mistv3)',
      activeRules: 'Domain terms, identifiers, currencies',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
            Projects
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Organize speech checks by application, domain context, or voice workflow.
          </p>
        </div>

        <Link
          href="/dashboard/analyze"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-indigo-600 text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span>Launch Analyzer</span>
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {defaultWorkflows.map((project) => (
          <div
            key={project.id}
            className="p-6 border border-neutral-200 bg-white space-y-4 hover:border-neutral-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-sans text-neutral-950">
                    {project.name}
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Active Workspace
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                Live
              </span>
            </div>

            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              {project.description}
            </p>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-1.5">
                <AudioWaveform className="w-3.5 h-3.5 text-neutral-400" />
                <span>{project.voice}</span>
              </div>
              <Link
                href="/dashboard/analyze"
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Inspect →
              </Link>
            </div>
          </div>
        ))}

        {/* Empty project affordance */}
        <div className="p-6 border border-dashed border-neutral-300 bg-neutral-50/40 flex flex-col justify-center items-center text-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <Plus className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold font-sans text-neutral-800">
            Create Custom Project
          </h4>
          <p className="text-[11px] text-neutral-500 max-w-xs font-sans">
            Group test suites for multi-lingual pipelines or domain-specific voicebots.
          </p>
          <span className="text-[10px] font-mono uppercase text-neutral-400 pt-1">
            Coming with team workspaces
          </span>
        </div>
      </div>
    </div>
  );
}
