'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SettingRow } from './SettingRow';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecuritySection() {
  const { user } = useAuth();
  const provider = user?.app_metadata?.provider || 'email';
  const isGoogle = provider === 'google';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage('Unable to update your password. Please try again.');
        setIsLoading(false);
        return;
      }

      setPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password updated.');
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Security
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Authentication credentials and account security controls.
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

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <div className="border border-neutral-200 bg-white p-6 divide-y divide-neutral-100">
        {/* Method */}
        <SettingRow
          label="Authentication Method"
          description="The primary security mechanism securing your account."
        >
          {isGoogle ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Managed through Google</span>
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-800">Email &amp; Password</span>
          )}
        </SettingRow>

        {/* Change password or Google info */}
        {isGoogle ? (
          <div className="py-5 text-xs text-neutral-600 leading-relaxed">
            Your account is secured through Google OAuth. Password management and two-factor authentication are governed directly by your Google security preferences.
          </div>
        ) : (
          <div className="py-6">
            <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-neutral-900 mb-1">
              Change Password
            </h4>
            <p className="text-xs text-neutral-500 mb-4 font-sans">
              Enter a new secure password of at least 6 characters.
            </p>

            <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-sm">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-none disabled:bg-neutral-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide' : 'Show'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 text-neutral-900 text-xs placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-none disabled:bg-neutral-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-neutral-950 text-white text-xs font-mono uppercase tracking-widest font-semibold hover:bg-indigo-600 transition-colors shadow-xs rounded-none cursor-pointer disabled:opacity-60"
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
