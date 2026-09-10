'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SettingRow } from './SettingRow';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, AlertCircle, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileSection() {
  const { user, userName, userEmail, userAvatar, refreshUser } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullNameInput, setFullNameInput] = useState(userName || '');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const provider = user?.app_metadata?.provider || 'email';
  const isGoogle = provider === 'google';
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  const initials = (userName || userEmail || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleUpdateName = async () => {
    if (!fullNameInput.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullNameInput.trim(),
        },
      });

      if (error) {
        setErrorMessage('Unable to update profile name.');
        setIsLoading(false);
        return;
      }

      await refreshUser();
      setIsEditingName(false);
      setSuccessMessage('Profile updated.');
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setErrorMessage('Unable to update your profile. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-neutral-950 uppercase">
          Profile
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Personal information and account identity.
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
        {/* Avatar Row */}
        <SettingRow
          label="Profile Photo"
          description="Your avatar as displayed across SaySure sessions."
        >
          <div className="flex items-center gap-3">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'Avatar'}
                className="h-12 w-12 rounded-full object-cover border border-neutral-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-semibold font-mono">
                {initials}
              </div>
            )}
            <span className="text-xs text-neutral-500 font-mono">
              {isGoogle ? 'Synced from Google' : 'Default avatar'}
            </span>
          </div>
        </SettingRow>

        {/* Full Name Row */}
        <SettingRow
          label="Full Name"
          description="Your display name used in consultations and reviews."
          action={
            !isEditingName ? (
              <button
                type="button"
                onClick={() => {
                  setFullNameInput(userName || '');
                  setIsEditingName(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            ) : null
          }
        >
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={fullNameInput}
                onChange={(e) => setFullNameInput(e.target.value)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-white border border-neutral-300 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-none w-48"
                placeholder="Full name"
                autoFocus
              />
              <button
                type="button"
                onClick={handleUpdateName}
                disabled={isLoading}
                className="p-1.5 bg-neutral-950 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
                title="Save"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                disabled={isLoading}
                className="p-1.5 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors cursor-pointer"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="font-medium text-neutral-900">{userName || 'Not set'}</span>
          )}
        </SettingRow>

        {/* Email Row */}
        <SettingRow
          label="Email Address"
          description="Used for system notifications and login credentials."
          action={
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                isEmailVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isEmailVerified ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Verification Required</span>
                </>
              )}
            </span>
          }
        >
          <span className="font-mono text-xs text-neutral-900">{userEmail}</span>
        </SettingRow>

        {/* Auth Provider */}
        <SettingRow
          label="Authentication Provider"
          description="Primary identity service connected to your account."
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-900 font-medium capitalize">
            {isGoogle ? (
              <>
                <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </>
            ) : (
              <span>Email &amp; Password</span>
            )}
          </span>
        </SettingRow>

        {/* Timestamps */}
        {user?.created_at && (
          <SettingRow
            label="Account Created"
            description="Date when your SaySure account was registered."
          >
            <span className="font-mono text-xs text-neutral-600">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </SettingRow>
        )}
      </div>
    </div>
  );
}
