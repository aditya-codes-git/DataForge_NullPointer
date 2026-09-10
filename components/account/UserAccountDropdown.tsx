'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function UserAccountDropdown() {
  const { user, userName, userEmail, userAvatar, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const initials = (userName || userEmail || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 cursor-pointer"
      >
        {userAvatar ? (
          <img
            src={userAvatar}
            alt={userName || 'User avatar'}
            className="h-8 w-8 rounded-full object-cover border border-slate-300"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold font-mono">
            {initials}
          </div>
        )}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-medium text-slate-900 max-w-[120px] truncate leading-tight">
            {userName}
          </span>
          <span className="text-[10px] text-slate-500 max-w-[120px] truncate leading-tight">
            {userEmail}
          </span>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="menu"
            className="absolute right-0 mt-2 w-64 rounded-none bg-white border border-neutral-200 shadow-lg py-1 z-50 focus:outline-none"
          >
            {/* Header info */}
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-3">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || 'Avatar'}
                  className="h-9 w-9 rounded-full object-cover border border-neutral-200"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold font-mono">
                  {initials}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-neutral-900 truncate">
                  {userName}
                </span>
                <span className="text-[11px] text-neutral-500 truncate font-mono">
                  {userEmail}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 transition-colors"
              >
                <UserIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span>Profile</span>
              </Link>

              <Link
                href="/account?tab=security"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 transition-colors"
              >
                <Shield className="h-3.5 w-3.5 text-neutral-400" />
                <span>Security</span>
              </Link>

              <Link
                href="/account?tab=preferences"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 hover:text-indigo-600 transition-colors"
              >
                <Settings className="h-3.5 w-3.5 text-neutral-400" />
                <span>Preferences</span>
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-neutral-100 py-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  signOut();
                }}
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-600 hover:text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
