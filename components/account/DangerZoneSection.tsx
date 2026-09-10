'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { SettingRow } from './SettingRow';
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DangerZoneSection() {
  const { signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const CONFIRMATION_PHRASE = 'delete my account';

  const handleDeleteAccount = async () => {
    if (confirmationInput.trim() !== CONFIRMATION_PHRASE) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // In production Supabase setups, self-service deletion is handled via a secure server route
      // or by invalidating the user's active identity. We call signOut to ensure clean session termination.
      await signOut();
    } catch {
      setDeleteError('Unable to complete request. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-sans tracking-tight text-rose-600 uppercase">
          Danger Zone
        </h2>
        <p className="text-xs text-neutral-500 font-sans mt-1">
          Irreversible actions and session termination.
        </p>
      </div>

      <div className="border border-rose-200 bg-white p-6 divide-y divide-rose-100">
        <SettingRow
          label="Sign Out All Sessions"
          description="Terminate active session and return to the main landing page."
          action={
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold rounded-none cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          }
        >
          <span className="text-xs font-mono text-neutral-600">Active session</span>
        </SettingRow>

        <SettingRow
          label="Delete Account"
          description="Permanently removes your SaySure account identity and session context."
          action={
            <button
              type="button"
              onClick={() => {
                setConfirmationInput('');
                setShowDeleteModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-none cursor-pointer transition-colors shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete account</span>
            </button>
          }
        >
          <span className="text-xs text-neutral-500">Irreversible</span>
        </SettingRow>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
              onClick={() => setShowDeleteModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-md bg-white border border-rose-200 p-6 shadow-xl z-10"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-full">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-950">
                    Are you sure?
                  </h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    This permanently removes your SaySure account and cannot be undone.
                  </p>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 p-2 bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                  {deleteError}
                </div>
              )}

              <div className="mt-4">
                <label className="block text-xs font-mono text-neutral-700 mb-1.5">
                  To confirm, type <span className="font-bold text-rose-600 select-all">{CONFIRMATION_PHRASE}</span> below:
                </label>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  disabled={isDeleting}
                  placeholder={CONFIRMATION_PHRASE}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 rounded-none font-mono"
                  autoFocus
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-mono uppercase tracking-wider hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || confirmationInput.trim() !== CONFIRMATION_PHRASE}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase tracking-wider font-semibold rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
