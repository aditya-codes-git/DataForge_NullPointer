import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Landing } from '@/pages/Landing';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { AuthCallback } from '@/pages/AuthCallback';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import DashboardOverviewPage from '@/pages/dashboard/Overview';
import AnalyzePage from '@/pages/dashboard/Analyze';
import HistoryPage from '@/pages/dashboard/History';
import ProjectsPage from '@/pages/dashboard/Projects';
import DocsPage from '@/pages/dashboard/Docs';
import DashboardSettingsPage from '@/pages/dashboard/Settings';
import DashboardAccountPage from '@/pages/dashboard/Account';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Marketing & Auth */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Authenticated Dashboard Workspace */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverviewPage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
          <Route path="account" element={<DashboardAccountPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
