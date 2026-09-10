import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export const metadata = {
  title: 'SaySure',
  description: 'SaySure Voice Delivery & Pronunciation QA Workspace.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
