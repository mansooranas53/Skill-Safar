import React, { useState } from 'react';
import { UserRole } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  Sparkles,
  GraduationCap,
  Building2,
  BookOpen,
  School,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (role: UserRole, userDetails?: { name: string; email: string; password?: string; organization?: string }) => void;
  initialMode?: 'signin' | 'signup';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'signin',
  initialRole = 'STUDENT'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');

  if (!isOpen) return null;

  const activeStudent = portalRepository.getStudentProfile();
  const currentStudentName = activeStudent?.fullName || 'Aarav Sharma';
  const currentStudentEmail = activeStudent?.email || 'aarav.sharma@campus.edu';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthenticate(selectedRole, {
      name: name.trim() || (selectedRole === 'STUDENT' ? currentStudentName : selectedRole === 'INDUSTRY' ? 'CloudScale Recruiter' : selectedRole === 'ACADEMICIAN' ? 'Prof. Herva Mehta' : 'Campus Administrator'),
      email: email.trim() || (selectedRole === 'STUDENT' ? currentStudentEmail : selectedRole === 'INDUSTRY' ? 'recruiter@cloudscale.io' : selectedRole === 'ACADEMICIAN' ? 'herva.mehta@its-blr.edu.in' : 'admin@its-blr.edu.in'),
      password: password || 'password123',
      organization: organization.trim() || (selectedRole === 'STUDENT' ? (activeStudent?.institutionName || 'ITS Bangalore') : '')
    });
    onClose();
  };

  const demoAccounts: Array<{
    role: UserRole;
    name: string;
    organization: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    email: string;
  }> = [
    {
      role: 'STUDENT',
      name: currentStudentName,
      organization: `${activeStudent?.institutionName || 'ITS Bangalore'} • B.Tech CS 2026`,
      description: '5 Verified skills, 3 project repos, 91% match with CloudScale',
      icon: GraduationCap,
      accentColor: 'hover:border-slate-400 bg-slate-50/80 text-slate-800',
      email: currentStudentEmail
    },
    {
      role: 'INDUSTRY',
      name: 'CloudScale Technologies',
      organization: 'Cloud Infrastructure Recruiter',
      description: 'Review screened candidates, update stages, post internships',
      icon: Building2,
      accentColor: 'hover:border-slate-400 bg-slate-50/80 text-slate-800',
      email: 'recruiter@cloudscale.io'
    },
    {
      role: 'ACADEMICIAN',
      name: 'Prof. Herva Mehta',
      organization: 'Professor & Head, CS Department',
      description: 'Industry R&D proposals, faculty immersion sabbaticals, FDPs',
      icon: BookOpen,
      accentColor: 'hover:border-slate-400 bg-slate-50/80 text-slate-800',
      email: 'herva.mehta@its-blr.edu.in'
    },
    {
      role: 'INSTITUTION_ADMIN',
      name: 'ITS Bangalore Administration',
      organization: 'Dean of Academic Placement',
      description: 'NIRF/NAAC analytics, department readiness, curriculum gaps',
      icon: School,
      accentColor: 'hover:border-slate-400 bg-slate-50/80 text-slate-800',
      email: 'admin@its-blr.edu.in'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              <ShieldCheck className="w-4 h-4 text-slate-800" />
              Skill Safar &bull; Unified Workspace
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900">
              {mode === 'signin' ? 'Sign in to Skill Safar' : 'Create Free Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-light">
              Select an instant 1-click role profile or enter credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick 1-Click Demo Profiles Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Instant Demo Access
              </span>
              <span className="text-[10px] text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                No password required
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map(demo => {
                const Icon = demo.icon;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => {
                      onAuthenticate(demo.role, {
                        name: demo.name,
                        email: demo.email,
                        organization: demo.organization
                      });
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border border-slate-200 text-left transition-all hover:shadow-xs group flex items-start gap-3 ${demo.accentColor}`}
                  >
                    <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0 group-hover:scale-105 transition-transform border border-slate-100">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-black truncate">
                        {demo.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate font-medium">
                        {demo.organization}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {demo.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-xs font-medium">
              or continue with credentials
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register New Account
            </button>
          </div>

          {/* Role selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Select Your Role / Pillar
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { role: 'STUDENT', label: 'Student', icon: GraduationCap },
                  { role: 'INDUSTRY', label: 'Industry', icon: Building2 },
                  { role: 'ACADEMICIAN', label: 'Faculty', icon: BookOpen },
                  { role: 'INSTITUTION_ADMIN', label: 'Campus Admin', icon: School }
                ] as const
              ).map(item => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white font-bold shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-[11px] block">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name / Institution Representative *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address *
              </label>
              <input
                required
                type="email"
                placeholder={selectedRole === 'STUDENT' ? 'student@campus.edu' : 'work@organization.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {selectedRole === 'STUDENT'
                    ? 'College / University'
                    : selectedRole === 'INDUSTRY'
                    ? 'Company Name'
                    : selectedRole === 'ACADEMICIAN'
                    ? 'University Department'
                    : 'Institution / Campus Name'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Institute of Technology & Science"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Password *
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </form>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl text-center text-xs text-slate-500">
          <span>Protected by Deterministic Access Control & National Accreditation Standards.</span>
        </div>
      </div>
    </div>
  );
};
