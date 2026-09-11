import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

interface MasterAdminLoginPageProps {
  onLoginSuccess: () => void;
  onReturnToPortal: () => void;
}

export const MasterAdminLoginPage: React.FC<MasterAdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToPortal
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      if (trimmedUser === 'admin' && trimmedPass === 'admin') {
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('Authentication failed. Invalid username or password. (Required: admin / admin)');
      }
    }, 350);
  };

  const handleAutofillDemo = () => {
    setUsername('admin');
    setPassword('admin');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between antialiased selection:bg-slate-700 selection:text-white">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center font-bold text-sm shadow-xs">
            SS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-base tracking-tight">
                Skill Safar
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-800 text-slate-300 rounded border border-slate-700">
                HQ Operations
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Institutional SaaS Gateway &bull; Direct Endpoint: <span className="font-mono text-slate-300 font-semibold">/masteradmin</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnToPortal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Main Portal</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header visual */}
          <div className="p-8 pb-6 border-b border-slate-800/80 text-center relative bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white text-slate-950 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-9 h-9 text-slate-950" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2 border border-slate-700">
              <Lock className="w-3 h-3 text-slate-300" />
              <span>Restricted Administrative Access</span>
            </div>

            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Master Admin Console
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Authenticate with your system credentials to manage partner colleges, SaaS licenses, and SLA tiers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {errorMessage && (
              <div className="p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Quick credentials banner */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <KeyRound className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Required Credentials
                  </div>
                  <div className="text-xs font-mono font-medium text-slate-200">
                    user: <span className="font-bold text-white">admin</span> &bull; pass: <span className="font-bold text-white">admin</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Auto-fill
              </button>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Administrator Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all font-mono"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Master Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Master Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onReturnToPortal}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Skill Safar Student &amp; Partner Portal</span>
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="px-8 py-3.5 bg-slate-900 border-t border-slate-800 text-center text-[11px] text-slate-500">
            Dedicated administrator route for authorized operations personnel only.
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>Skill Safar &bull; Enterprise Institutional Management Infrastructure</div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Multi-Campus Session Enforcer Live</span>
        </div>
      </footer>
    </div>
  );
};
