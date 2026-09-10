'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { GoogleButton } from '@/components/auth/GoogleButton';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
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
    setConfirmationNotice(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage('Unable to create your account. Please try again.');
        setIsLoading(false);
        return;
      }

      // If user has an active session immediately -> Redirect directly to /dashboard
      if (data?.session) {
        const destination =
          callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
            ? callbackUrl
            : '/dashboard';
        router.push(destination);
        router.refresh();
        return;
      }

      // If email confirmation is required by Supabase
      if (data?.user && !data.session) {
        setConfirmationNotice('Check your email to confirm your account.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
    } catch {
      setErrorMessage('Unable to create your account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white px-4 sm:px-8 py-8 border border-neutral-200 sm:rounded-none">
      {/* Google OAuth Button */}
      <div>
        <GoogleButton
          callbackUrl={callbackUrl}
          onError={(msg) => setErrorMessage(msg)}
        />
      </div>

      {/* Minimal Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-mono">
          <span className="bg-white px-3 text-neutral-400">OR</span>
        </div>
      </div>

      {/* Error Message Notice */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      {/* Confirmation Notice */}
      {confirmationNotice && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5"
          role="status"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{confirmationNotice}</span>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1.5"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            disabled={isLoading}
            placeholder="Jane Doe"
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            disabled={isLoading}
            placeholder="name@company.com"
            className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isLoading}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              disabled={isLoading}
              placeholder="Repeat your password"
              className="w-full px-3.5 py-2.5 pr-10 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-mono uppercase tracking-widest font-semibold text-white bg-neutral-950 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed rounded-none cursor-pointer"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </motion.button>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-600">
        <span>Already have an account? </span>
        <Link
          href={callbackUrl !== '/dashboard' ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login'}
          className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Anchor Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center"
        >
          <Link href="/" className="inline-block group">
            <div className="relative h-14 w-14 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="SaySure"
                width={56}
                height={56}
                className="object-contain w-full h-full"
                priority
              />
            </div>
          </Link>
        </motion.div>

        {/* Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-neutral-950 uppercase">
            Create your account.
          </h1>
          <p className="mt-2 text-sm text-neutral-600 font-sans">
            Start testing what your users actually hear.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Suspense fallback={<div className="p-8 text-center text-xs font-mono text-neutral-400">Loading...</div>}>
          <SignupForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
