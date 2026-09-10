import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Shield, Settings, AlertTriangle } from 'lucide-react';
import { ProfileSection } from '@/components/account/ProfileSection';
import { SecuritySection } from '@/components/account/SecuritySection';
import { PreferencesSection } from '@/components/account/PreferencesSection';
import { DangerZoneSection } from '@/components/account/DangerZoneSection';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'profile' | 'security' | 'preferences' | 'danger';

export default function DashboardAccountPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = (searchParams.get('tab') as TabType) || 'profile';
  const [activeTab, setActiveTab] = useState<TabType>(tabParam);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings className="w-4 h-4" /> },
    { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle className="w-4 h-4 text-rose-500" /> },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Account
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Manage your SaySure profile identity, sign-in credentials, and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors border ${
              activeTab === item.id
                ? 'border-neutral-950 bg-neutral-950 text-white font-semibold'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Panel */}
      <div className="pt-2 min-h-[400px]">
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
  );
}
