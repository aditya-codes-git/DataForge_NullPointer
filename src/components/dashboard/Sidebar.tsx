import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Mic2,
  Clock,
  FolderGit2,
  BookOpen,
  Settings,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { RimeConfigPublic } from '@/lib/schemas';
import { getClientConfig, getLoadedClientConfig } from '@/lib/config-client';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  isMobileOpen,
  onMobileClose,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user, userName, userEmail, userAvatar } = useAuth();
  const [optimisticPath, setOptimisticPath] = useState<string | null>(null);
  const [rimeConfig, setRimeConfig] = useState<RimeConfigPublic | null>(() => getLoadedClientConfig()?.rime || null);

  useEffect(() => {
    setOptimisticPath(null);
  }, [pathname]);

  useEffect(() => {
    if (!rimeConfig) {
      getClientConfig().then((data) => {
        if (data?.rime) setRimeConfig(data.rime);
      });
    }
  }, [rimeConfig]);

  const currentPath = optimisticPath || pathname;
  const isConnected = rimeConfig?.status === 'connected';

  const navGroups = [
    {
      label: 'Overview',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
        { label: 'Analyze', href: '/dashboard/analyze', icon: Mic2 },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { label: 'History', href: '/dashboard/history', icon: Clock },
        { label: 'Projects', href: '/dashboard/projects', icon: FolderGit2 },
      ],
    },
    {
      label: 'Resources',
      items: [
        { label: 'Documentation', href: '/dashboard/docs', icon: BookOpen },
      ],
    },
  ];

  const bottomItems = [
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Account', href: '/dashboard/account', icon: User },
  ];

  const initials = (userName || userEmail || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white border-r border-neutral-200">
      {/* Top Header with Logo & Collapse Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
          <Link to="/dashboard" className="flex items-center gap-2 group overflow-hidden">
            <div className="relative h-9 w-28 flex items-center">
              <img
                src="/logo.png"
                alt="SaySure"
                className="object-contain h-full w-auto"
              />
            </div>
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 text-neutral-400 hover:text-neutral-900 rounded transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="md:hidden p-1.5 text-neutral-500 hover:text-neutral-900"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="px-3">
              {!isCollapsed && (
                <div className="px-3 mb-1.5 text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = item.exact
                    ? currentPath === item.href
                    : currentPath === item.href || currentPath.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => {
                        setOptimisticPath(item.href);
                        onMobileClose();
                      }}
                      className={`flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide rounded-none transition-colors group relative ${
                        isActive
                          ? 'bg-indigo-50/80 text-indigo-700 font-semibold border-l-2 border-indigo-600'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Area: Settings, Rime status, User Identity */}
      <div className="border-t border-neutral-100 p-3 space-y-3">
        {/* Settings & Account links */}
        <div className="space-y-0.5">
          {bottomItems.map((item) => {
            const isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => {
                  setOptimisticPath(item.href);
                  onMobileClose();
                }}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-mono tracking-wide rounded-none transition-colors group ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-700 font-semibold border-l-2 border-indigo-600'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-neutral-400 group-hover:text-neutral-700'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Subtle Rime Status Row */}
        {!isCollapsed && (
          <div className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-none text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                {isConnected ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                )}
              </span>
              <span className="font-semibold text-neutral-800 truncate">
                {isConnected ? 'Rime Connected' : 'Rime Offline'}
              </span>
            </div>
            {rimeConfig && (
              <div className="mt-1 text-[10px] text-neutral-500 truncate">
                {rimeConfig.model} · {rimeConfig.voice}
              </div>
            )}
          </div>
        )}

        {/* User Account Info */}
        {user && (
          <Link
            to="/dashboard/account"
            onClick={onMobileClose}
            className="flex items-center gap-2.5 p-2 hover:bg-neutral-50 rounded-none transition-colors border border-transparent hover:border-neutral-200"
          >
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'Avatar'}
                className="h-7 w-7 rounded-full object-cover border border-neutral-200 flex-shrink-0"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-semibold font-mono flex-shrink-0">
                {initials}
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-semibold text-neutral-900 truncate leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] text-neutral-500 truncate font-mono leading-tight">
                  {userEmail}
                </span>
              </div>
            )}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-200 ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay & Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-neutral-950/30 backdrop-blur-xs"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-64 h-full z-10"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
