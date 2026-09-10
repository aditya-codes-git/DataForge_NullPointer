import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const redirectUrl = `${window.location.origin}/account/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMessage('Unable to send password reset email. Please try again.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Password reset instructions have been sent to your email.');
      setIsLoading(false);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

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
          <Link to="/" className="inline-block group">
            <div className="relative h-14 w-14 overflow-hidden transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="SaySure"
                width={56}
                height={56}
                className="object-contain w-full h-full"
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
            Reset Password.
          </h1>
          <p className="mt-2 text-sm text-neutral-600 font-sans">
            Enter your email to receive a secure reset link.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white px-4 sm:px-8 py-8 border border-neutral-200 sm:rounded-none">
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

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2.5"
              role="status"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                disabled={isLoading || Boolean(successMessage)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
              />
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading || Boolean(successMessage)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-mono uppercase tracking-widest font-semibold text-white bg-neutral-950 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed rounded-none cursor-pointer"
              >
                {isLoading ? 'Sending instructions...' : 'Send reset link'}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-600">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
