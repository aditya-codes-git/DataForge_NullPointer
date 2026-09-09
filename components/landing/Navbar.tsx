'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 py-3 shadow-2xs'
          : 'bg-white/60 backdrop-blur-xs border-b border-neutral-100 py-3 sm:py-3.5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Anchor: Substantially larger and visually stronger */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative h-10 w-10 overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="SaySure Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-neutral-950 font-sans leading-none">
              SaySure
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mt-1">
              Voice Delivery QA
            </span>
          </div>
        </Link>

        {/* Minimal Editorial Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-9">
          <a
            href="#story"
            className="text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            The Process
          </a>
          <a
            href="#specimen"
            className="text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            Specimen
          </a>
          <a
            href="#interactive"
            className="text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            Laboratory
          </a>
          <a
            href="#developers"
            className="text-xs uppercase tracking-widest font-mono text-neutral-500 hover:text-neutral-950 transition-colors"
          >
            Developers
          </a>
        </nav>

        {/* Minimal Action CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950 border-b-2 border-neutral-950 pb-0.5 hover:text-indigo-600 hover:border-indigo-600 transition-all"
          >
            <span>Launch Console</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral-700 hover:text-neutral-950 transition-colors"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-b border-neutral-200 bg-white px-6 pt-4 pb-8"
          >
            <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-widest">
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-600 hover:text-neutral-950"
              >
                The Process
              </a>
              <a
                href="#specimen"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-600 hover:text-neutral-950"
              >
                Specimen
              </a>
              <a
                href="#interactive"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-600 hover:text-neutral-950"
              >
                Laboratory
              </a>
              <a
                href="#developers"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-neutral-600 hover:text-neutral-950"
              >
                Developers
              </a>
              <div className="pt-4 border-t border-neutral-100">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-neutral-950 py-3 text-xs uppercase tracking-wider font-mono text-white"
                >
                  <span>Launch Console</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
