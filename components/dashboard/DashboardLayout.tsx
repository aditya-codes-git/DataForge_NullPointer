'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { UserAccountDropdown } from '@/components/account/UserAccountDropdown';
import { Menu, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Workspace Column */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isCollapsed ? 'md:pl-16' : 'md:pl-60'
        }`}
      >
        {/* Compact Workspace Header */}
        <header className="h-16 border-b border-neutral-200 bg-white sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
          {/* Left: Mobile hamburger & breadcrumb / brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-950 focus:outline-none"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="md:hidden flex items-center">
              <div className="relative h-8 w-24 flex items-center">
                <Image
                  src="/logo.png"
                  alt="SaySure"
                  width={96}
                  height={32}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right: Quick actions and account dropdown */}
          <div className="flex items-center gap-4">
            <a
              href="https://users.rime.ai/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <span>Rime API</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="border-l border-neutral-200 pl-4">
              <UserAccountDropdown />
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
