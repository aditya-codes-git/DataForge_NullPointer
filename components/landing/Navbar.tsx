'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userName, userAvatar, signOut, loading } = useAuth();

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
          ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 py-1.5 shadow-2xs'
          : 'bg-white/60 backdrop-blur-xs border-b border-neutral-100 py-1.5 sm:py-2'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Anchor: SaySure Icon */}
        <Link href="/" className="flex items-center group">
          <div className="relative h-20 w-20 overflow-hidden transition-transform duration-200 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="SaySure"
              width={80}
              height={80}
              className="object-contain w-full h-full"
              priority
            />
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

        {/* Auth-Aware Action CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {!loading && user ? (
            <>
              {/* Logged in: Launch Console + User avatar/name + Sign out */}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950 border-b-2 border-neutral-950 pb-0.5 hover:text-indigo-600 hover:border-indigo-600 transition-all"
              >
                <span>Launch Console</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>

              <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName || 'User avatar'}
                    className="h-7 w-7 rounded-full object-cover border border-neutral-300"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700">
                    <UserIcon className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="text-xs font-mono text-neutral-700 max-w-[120px] truncate" title={userName || ''}>
                  {userName}
                </span>

                <button
                  type="button"
                  onClick={signOut}
                  className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Logged out: Sign in + Launch Console */}
              <Link
                href="/login"
                className="text-xs font-mono uppercase tracking-wider text-neutral-600 hover:text-neutral-950 transition-colors"
              >
                Sign in
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-semibold text-neutral-950 border-b-2 border-neutral-950 pb-0.5 hover:text-indigo-600 hover:border-indigo-600 transition-all"
              >
                <span>Launch Console</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
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

              <div className="pt-4 border-t border-neutral-100 flex flex-col gap-3">
                {!loading && user ? (
                  <>
                    <div className="flex items-center gap-3 py-1">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName || 'User avatar'}
                          className="h-8 w-8 rounded-full object-cover border border-neutral-300"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-700">
                          <UserIcon className="h-4 w-4" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-neutral-900 lowercase font-mono">
                          {userName}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono lowercase">
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-neutral-950 py-3 text-xs uppercase tracking-wider font-mono text-white"
                    >
                      <span>Launch Console</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-neutral-300 py-2.5 text-xs uppercase tracking-wider font-mono text-neutral-700 hover:bg-neutral-50 hover:text-rose-600"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center py-2.5 text-xs uppercase tracking-wider font-mono text-neutral-800 border border-neutral-300"
                    >
                      Sign in
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-neutral-950 py-3 text-xs uppercase tracking-wider font-mono text-white"
                    >
                      <span>Launch Console</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
