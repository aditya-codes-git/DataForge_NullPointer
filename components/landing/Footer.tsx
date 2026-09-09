'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Subtitle */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="SaySure Logo"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-base font-bold tracking-tight text-slate-900">SaySure</span>
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <p className="text-xs text-slate-500">
            Voice delivery QA for production TTS.
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-600">
          <a href="#product" className="hover:text-slate-950 transition-colors">
            Product
          </a>
          <a href="#how-it-works" className="hover:text-slate-950 transition-colors">
            How it Works
          </a>
          <a href="#developers" className="hover:text-slate-950 transition-colors">
            Developers
          </a>
          <a href="#architecture" className="hover:text-slate-950 transition-colors">
            Architecture
          </a>
          <Link href="/dashboard" className="hover:text-indigo-600 font-semibold transition-colors">
            Dashboard
          </Link>
          <a
            href="https://users.rime.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-950 transition-colors"
          >
            Rime Docs
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SaySure. Built with Rime TTS.
        </div>
      </div>
    </footer>
  );
}
