'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand Anchor */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SaySure Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-neutral-950 font-sans">
              SaySure
            </span>
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-mono text-xs text-neutral-500">
            Voice delivery QA for production TTS.
          </span>
        </div>

        {/* Minimal Links */}
        <nav className="flex flex-wrap items-center gap-8 font-mono text-xs uppercase tracking-widest text-neutral-500">
          <a href="#story" className="hover:text-neutral-950 transition-colors">
            Process
          </a>
          <a href="#specimen" className="hover:text-neutral-950 transition-colors">
            Specimen
          </a>
          <a href="#interactive" className="hover:text-neutral-950 transition-colors">
            Laboratory
          </a>
          <a href="#developers" className="hover:text-neutral-950 transition-colors">
            Developers
          </a>
          <Link href="/dashboard" className="text-neutral-950 font-bold hover:text-indigo-600 transition-colors">
            Dashboard
          </Link>
          <a
            href="https://users.rime.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-neutral-950 transition-colors"
          >
            Rime Docs
          </a>
        </nav>

        {/* Copyright */}
        <div className="font-mono text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} SAYSURE.
        </div>
      </div>
    </footer>
  );
}
