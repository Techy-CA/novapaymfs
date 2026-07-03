import React, { useState } from 'react';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { loginWithEmail, resetPassword } from '../../services/authService';
import toast from 'react-hot-toast';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [forgotMode, setForgotMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Welcome back!');
      onLogin();
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Try again later.'
        : err.message || 'Login failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Enter your email address.'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
      setForgotMode(false);
    } catch {
      setError('Could not send reset email. Check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e8edf8 50%, #f0f2f7 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <Zap size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">NovaPay MFI OS</h1>
          <p className="text-sm text-slate-500 mt-1">Digital Microfinance Platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-7">
          <h2 className="text-base font-bold text-slate-900 mb-1">
            {forgotMode ? 'Reset Password' : 'Sign in to your account'}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {forgotMode ? 'Enter your email to receive a reset link.' : 'Enter your credentials to continue.'}
          </p>

          <form onSubmit={forgotMode ? handleForgot : handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@novapay.in"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200
                    text-slate-900 placeholder-slate-400
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15
                    transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            {!forgotMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl border border-slate-200
                      text-slate-900 placeholder-slate-400
                      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15
                      transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
                <AlertCircle size={13} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold
                text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                shadow-sm hover:shadow-md"
              style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {forgotMode ? 'Send Reset Email' : 'Sign In'}
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-5 text-center">
            {forgotMode ? (
              <button
                onClick={() => { setForgotMode(false); setError(''); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ← Back to Sign In
              </button>
            ) : (
              <button
                onClick={() => { setForgotMode(true); setError(''); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot password?
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          NovaPay MFI OS · Secure Login · v2.0.0
        </p>
      </div>
    </div>
  );
};
