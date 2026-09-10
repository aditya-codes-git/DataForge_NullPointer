'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { User, Shield, Settings, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ProfileSection } from '@/components/account/ProfileSection';
import { SecuritySection } from '@/components/account/SecuritySection';
import { PreferencesSection } from '@/components/account/PreferencesSection';
import { DangerZoneSection } from '@/components/account/DangerZoneSection';
import { UserAccountDropdown } from '@/components/account/UserAccountDropdown';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'profile' | 'security' | 'preferences' | 'danger';

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'profile';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['profile', 'security', 'preferences', 'danger'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top Header */}
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-105" aria-label="SaySure Home">
              <div className="relative h-16 w-36 flex items-center">
                <Image
                  src="/logo.png"
                  alt="SaySure"
                  width={128}
                  height={48}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
            </Link>
            <span className="text-xs text-neutral-300">|</span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Console</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <UserAccountDropdown />
          </div>
        </div>
      </header>

      {/* Main Settings Container */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Page Title */}
        <div className="mb-8 border-b border-neutral-200 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-neutral-950 uppercase">
            Account
          </h1>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            Manage your SaySure account identity, security credentials, and preferences.
          </p>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex overflow-x-auto pb-3 mb-6 border-b border-neutral-200 gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors border ${
                activeTab === item.id
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop Two-Column Settings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Navigation */}
          <nav className="hidden md:flex md:col-span-3 flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isDanger = item.id === 'danger';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider font-medium text-left transition-colors cursor-pointer ${
                    isActive
                      ? isDanger
                        ? 'bg-rose-50 text-rose-700 font-semibold border-l-2 border-rose-600'
                        : 'bg-neutral-100 text-neutral-950 font-semibold border-l-2 border-neutral-950'
                      : isDanger
                      ? 'text-rose-600 hover:bg-rose-50/50'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Active Content Panel */}
          <div className="md:col-span-9 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'profile' && <ProfileSection />}
                {activeTab === 'security' && <SecuritySection />}
                {activeTab === 'preferences' && <PreferencesSection />}
                {activeTab === 'danger' && <DangerZoneSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-xs font-mono text-neutral-400">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
