import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { GoogleButton } from '@/components/auth/GoogleButton';

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (urlError === 'auth_callback_failed') {
      setErrorMessage('Google sign-in could not be completed. Please try again.');
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage('Email or password is incorrect.');
        setIsLoading(false);
        return;
      }

      // Successful login -> Redirect directly to /dashboard (or safe callbackUrl)
      const destination =
        callbackUrl.startsWith('/') && !callbackUrl.startsWith('//')
          ? callbackUrl
          : '/dashboard';
      navigate(destination);
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
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-neutral-600 font-sans">
            Sign in to continue to SaySure.
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

          {/* Email / Password Form */}
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
                disabled={isLoading}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-sm placeholder-neutral-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-colors rounded-none disabled:bg-neutral-50 disabled:text-neutral-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-mono uppercase tracking-wider text-neutral-700 font-semibold"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-neutral-500 hover:text-indigo-600 transition-colors font-mono"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  disabled={isLoading}
                  placeholder="••••••••"
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
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-mono uppercase tracking-widest font-semibold text-white bg-neutral-950 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed rounded-none cursor-pointer"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-neutral-100 text-center text-xs text-neutral-600">
            <span>Don't have an account? </span>
            <Link
              to={callbackUrl !== '/dashboard' ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/signup'}
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Create one
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
