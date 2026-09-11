import React, { useState } from 'react';
import { InstitutionProfile, InstitutionLoginCredential } from '../../types';
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
  School,
  Mail,
  User,
  Globe,
  AlertTriangle,
  History
} from 'lucide-react';

interface InstitutionLoginModalProps {
  institution: InstitutionProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const InstitutionLoginModal: React.FC<InstitutionLoginModalProps> = ({
  institution,
  isOpen,
  onClose,
  onUpdated
}) => {
  if (!isOpen || !institution) return null;

  const currentCreds: InstitutionLoginCredential = institution.loginCredentials || {
    adminEmail: institution.contactEmail || `admin@${institution.code.toLowerCase()}.edu.in`,
    adminUsername: `${institution.code.toLowerCase()}_admin`,
    status: 'ACTIVE',
    lastLoginAt: '2026-09-09 18:00',
    ssoDomain: (institution.contactEmail || '').split('@')[1] || `${institution.code.toLowerCase()}.edu.in`,
    twoFactorEnforced: true,
    activeSessionsCount: 2
  };

  const [adminEmail, setAdminEmail] = useState(currentCreds.adminEmail);
  const [adminUsername, setAdminUsername] = useState(currentCreds.adminUsername);
  const [status, setStatus] = useState<'ACTIVE' | 'LOCKED' | 'SUSPENDED'>(currentCreds.status);
  const [ssoDomain, setSsoDomain] = useState(currentCreds.ssoDomain || '');
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(currentCreds.twoFactorEnforced);
  const [tempPassword, setTempPassword] = useState<string | null>(currentCreds.temporaryPassword || null);
  const [copied, setCopied] = useState(false);
  const [sessionsRevokedMessage, setSessionsRevokedMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGeneratePassword = () => {
    const generated = portalRepository.resetInstitutionPassword(institution.id);
    setTempPassword(generated);
    setSuccessMessage(`Generated temporary campus admin password for ${institution.name}.`);
    if (onUpdated) onUpdated();
  };

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    portalRepository.updateInstitutionCredentials(institution.id, {
      adminEmail: adminEmail.trim(),
      adminUsername: adminUsername.trim(),
      status,
      ssoDomain: ssoDomain.trim() || undefined,
      twoFactorEnforced,
      temporaryPassword: tempPassword || undefined
    });
    setSuccessMessage('Campus admin credentials and SSO constraints saved.');
    if (onUpdated) onUpdated();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleRevokeSessions = () => {
    portalRepository.logAudit({
      action: 'INSTITUTE_SESSIONS_REVOKED',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: institution.name,
      details: `Revoked all active campus admin and coordinator sessions for ${institution.name}.`,
      status: 'WARN'
    });
    setSessionsRevokedMessage('All active coordinator and campus sessions have been invalidated.');
    setTimeout(() => setSessionsRevokedMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Campus Admin Login & SSO</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-indigo-500/30 text-indigo-200">
                  {institution.code}
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5 truncate max-w-sm">{institution.name}</p>
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

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Status buttons */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Institution Access Status</span>
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

          {/* Credentials */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Campus Master Administrator Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Admin Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Campus Admin Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={e => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Allowed SSO Domain Whitelist</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={ssoDomain}
                  onChange={e => setSsoDomain(e.target.value)}
                  placeholder="e.g. its-blr.edu.in"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Only email addresses ending in this domain can authenticate via Google/Microsoft SSO for this campus.
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Last Campus Login: <strong className="text-slate-700">{currentCreds.lastLoginAt || 'Never'}</strong>
              </span>
              <span>
                Active Sessions: <strong className="text-slate-700">{currentCreds.activeSessionsCount ?? 1}</strong>
              </span>
            </div>
          </div>

          {/* Emergency Temporary Password Generator */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  One-Time Campus Admin Password
                </h4>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Generate an emergency temporary bypass password for the Placement Director or Dean.
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

          {/* Security & Sessions */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Mandate Campus Admin 2FA
                </label>
                <p className="text-[11px] text-slate-500">Requires multi-factor verification for all institutional administrators.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnforced}
                onChange={e => setTwoFactorEnforced(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-medium text-slate-800">Campus Active Sessions</span>
                <p className="text-[11px] text-slate-500">Terminate all active faculty and coordinator sessions.</p>
              </div>
              <button
                type="button"
                onClick={handleRevokeSessions}
                className="px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
              >
                Revoke Campus Sessions
              </button>
            </div>
          </div>

          {/* Footer */}
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
              Save Campus Security
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
