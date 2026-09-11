import React, { useState } from 'react';
import { IndustryProfile, CompanyAccountCredential } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  RotateCcw,
  Copy,
  Check,
  Building2,
  Mail,
  User,
  AlertTriangle,
  History
} from 'lucide-react';

interface CompanyLoginModalProps {
  company: IndustryProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const CompanyLoginModal: React.FC<CompanyLoginModalProps> = ({
  company,
  isOpen,
  onClose,
  onUpdated
}) => {
  if (!isOpen || !company) return null;

  const currentCreds: CompanyAccountCredential = company.credentials || {
    loginEmail: company.contactEmail,
    username: company.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16) + '_admin',
    status: 'ACTIVE',
    lastLoginAt: 'Never',
    twoFactorEnabled: true
  };

  const [email, setEmail] = useState(currentCreds.loginEmail);
  const [username, setUsername] = useState(currentCreds.username);
  const [status, setStatus] = useState<'ACTIVE' | 'LOCKED' | 'SUSPENDED'>(currentCreds.status);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentCreds.twoFactorEnabled);
  const [tempPassword, setTempPassword] = useState<string | null>(currentCreds.temporaryPassword || null);
  const [copied, setCopied] = useState(false);
  const [sessionsRevokedMessage, setSessionsRevokedMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGeneratePassword = () => {
    const generated = portalRepository.resetCompanyPassword(company.id);
    setTempPassword(generated);
    setSuccessMessage(`Generated temporary one-time password for ${company.companyName}.`);
    if (onUpdated) onUpdated();
  };

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    portalRepository.updateCompanyCredentials(company.id, {
      loginEmail: email.trim(),
      username: username.trim(),
      status,
      twoFactorEnabled,
      temporaryPassword: tempPassword || undefined
    });
    setSuccessMessage('Login credentials & security settings updated successfully.');
    if (onUpdated) onUpdated();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleRevokeSessions = () => {
    portalRepository.logAudit({
      action: 'COMPANY_SESSIONS_REVOKED',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: company.companyName,
      details: `Revoked all active recruiter login tokens and session cookies for ${company.companyName}.`,
      status: 'WARN'
    });
    setSessionsRevokedMessage('All active browser sessions and auth tokens have been invalidated.');
    setTimeout(() => setSessionsRevokedMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Login & Access Management</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-indigo-500/30 text-indigo-200">
                  Company
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">{company.companyName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {sessionsRevokedMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{sessionsRevokedMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
          {/* Account Status Segment */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Account Status</span>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                status === 'ACTIVE'
                  ? 'bg-emerald-100 text-emerald-700'
                  : status === 'LOCKED'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}>
                {status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('ACTIVE')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'ACTIVE'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                Active
              </button>

              <button
                type="button"
                onClick={() => setStatus('LOCKED')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'LOCKED'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                Locked
              </button>

              <button
                type="button"
                onClick={() => setStatus('SUSPENDED')}
                className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  status === 'SUSPENDED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Suspended
              </button>
            </div>
          </div>

          {/* Credentials Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recruiter Admin Credentials
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Login Email / Identifier</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Recruiter Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Last Logged In: <strong className="text-slate-700">{currentCreds.lastLoginAt || 'Never'}</strong>
              </span>
            </div>
          </div>

          {/* Emergency Temporary Password Generator */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  One-Time Emergency Password
                </h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Issue a cryptographically secure temporary password if the company's recruiter is locked out.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Password
              </button>
            </div>

            {tempPassword && (
              <div className="mt-2 p-2.5 bg-white rounded-lg border border-indigo-200 flex items-center justify-between">
                <code className="text-xs font-mono font-bold text-indigo-950 tracking-wider">
                  {tempPassword}
                </code>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          {/* Security Toggles & Session Invalidation */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Enforce Two-Factor Authentication (2FA)
                </label>
                <p className="text-[11px] text-slate-500">Requires authenticator OTP code on every login attempt.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={e => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-medium text-slate-800">Active Recruiter Sessions</span>
                <p className="text-[11px] text-slate-500">Sign out this company from all active devices and browsers.</p>
              </div>
              <button
                type="button"
                onClick={handleRevokeSessions}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              >
                Revoke All Sessions
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              Save Credentials & Access Rules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
