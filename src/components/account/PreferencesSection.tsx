'use client';

import React, { useState, useEffect } from 'react';
import { SettingRow } from './SettingRow';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function PreferencesSection() {
  const [expandRimeConfig, setExpandRimeConfig] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('saysure_pref_rime_config');
    if (saved !== null) {
      setExpandRimeConfig(saved === 'true');
    }
  }, []);

  const handleToggleRimeConfig = (val: boolean) => {
    setExpandRimeConfig(val);
    localStorage.setItem('saysure_pref_rime_config', String(val));
    setSuccessMessage('Preference saved.');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Preferences
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Customize laboratory layout and verification defaults.
        </p>
      </div>

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      <div className="border border-neutral-200 bg-white p-6 divide-y divide-neutral-100">
        <SettingRow
          label="Laboratory Configuration Panel"
          description="Display the verified Rime acoustic model parameters footer card on the QA dashboard."
          action={
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expandRimeConfig}
                onChange={(e) => handleToggleRimeConfig(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          }
        >
          <span className="text-xs font-mono text-neutral-700">
            {expandRimeConfig ? 'Visible' : 'Hidden'}
          </span>
        </SettingRow>

        <SettingRow
          label="Color Scheme"
          description="SaySure is curated for a high-contrast editorial light aesthetic."
        >
          <span className="text-xs font-mono text-neutral-700">Light (Editorial)</span>
        </SettingRow>
      </div>
    </div>
  );
}
