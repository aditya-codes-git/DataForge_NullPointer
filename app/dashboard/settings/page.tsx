'use client';

import React, { useState, useEffect } from 'react';
import { SettingRow } from '@/components/account/SettingRow';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardSettingsPage() {
  const [expandRimeConfig, setExpandRimeConfig] = useState(true);
  const [defaultLocale, setDefaultLocale] = useState('en-US');
  const [defaultDomain, setDefaultDomain] = useState('general');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem('saysure_pref_rime_config');
    if (savedConfig !== null) setExpandRimeConfig(savedConfig === 'true');

    const savedLocale = localStorage.getItem('saysure_pref_default_locale');
    if (savedLocale) setDefaultLocale(savedLocale);

    const savedDomain = localStorage.getItem('saysure_pref_default_domain');
    if (savedDomain) setDefaultDomain(savedDomain);
  }, []);

  const handleUpdate = (key: string, value: string) => {
    localStorage.setItem(key, value);
    setSuccessMessage('Settings updated.');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Workspace Settings
        </h1>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Configure laboratory defaults, analysis rules, and display parameters.
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
        {/* Default Domain Context */}
        <SettingRow
          label="Default Analysis Domain"
          description="Context used to evaluate technical vocabulary in the absence of explicit metadata."
          action={
            <select
              value={defaultDomain}
              onChange={(e) => {
                setDefaultDomain(e.target.value);
                handleUpdate('saysure_pref_default_domain', e.target.value);
              }}
              className="px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-indigo-600 font-mono rounded-none"
            >
              <option value="general">General Software</option>
              <option value="fintech">Fintech &amp; Banking</option>
              <option value="healthcare">Healthcare &amp; Pharma</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          }
        >
          <span className="text-xs font-mono text-neutral-700 capitalize">{defaultDomain}</span>
        </SettingRow>

        {/* Default Locale */}
        <SettingRow
          label="Default Language / Locale"
          description="Acoustic phonetic dictionary and numbering format dialect."
          action={
            <select
              value={defaultLocale}
              onChange={(e) => {
                setDefaultLocale(e.target.value);
                handleUpdate('saysure_pref_default_locale', e.target.value);
              }}
              className="px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-indigo-600 font-mono rounded-none"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-IN">English (India - Lakhs/Crores)</option>
              <option value="en-GB">English (United Kingdom)</option>
            </select>
          }
        >
          <span className="text-xs font-mono text-neutral-700">{defaultLocale}</span>
        </SettingRow>

        {/* Rime Config Visibility */}
        <SettingRow
          label="Rime TTS Parameters Card"
          description="Display the verified acoustic model, voice, and sample rate footer card on the analyzer."
          action={
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expandRimeConfig}
                onChange={(e) => {
                  setExpandRimeConfig(e.target.checked);
                  handleUpdate('saysure_pref_rime_config', String(e.target.checked));
                }}
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
      </div>
    </div>
  );
}
