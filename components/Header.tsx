'use client';

import React from 'react';
import { ExternalLink, LogOut, User as UserIcon } from 'lucide-react';
import { RimeConfigPublic } from '@/lib/schemas';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserAccountDropdown } from '@/components/account/UserAccountDropdown';

interface HeaderProps {
  rimeConfig: RimeConfigPublic | null;
}

export function Header({ rimeConfig }: HeaderProps) {
  const isConnected = rimeConfig?.status === 'connected';
  const { user, userName, userAvatar, signOut } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        {/* Brand Anchor: Logo only, scaled up */}
        <div className="flex items-center">
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
        </div>

        {/* Actions, Status, and User Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Observable Rime Status Badge */}
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              {isConnected ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              )}
            </span>
            <span className="font-medium text-slate-700">
              {isConnected ? 'Rime Connected' : 'Rime Offline'}
            </span>
          </div>

          <a
            href="https://users.rime.ai/docs"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 lg:flex"
          >
            <span>Docs</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Authenticated User Account Dropdown */}
          {user && (
            <div className="pl-3 border-l border-slate-200">
              <UserAccountDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
