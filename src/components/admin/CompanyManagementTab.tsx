import React, { useState } from 'react';
import { IndustryProfile } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { OnboardCompanyModal } from './OnboardCompanyModal';
import { CompanyLoginModal } from './CompanyLoginModal';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  Award,
  Briefcase,
  Copy,
  Check
} from 'lucide-react';

interface CompanyManagementTabProps {
  companies: IndustryProfile[];
  onRefresh: () => void;
}

export const CompanyManagementTab: React.FC<CompanyManagementTabProps> = ({
  companies,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [loginModalCompany, setLoginModalCompany] = useState<IndustryProfile | null>(null);
  const [quickTempPassword, setQuickTempPassword] = useState<{ id: string; pass: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Metrics
  const totalCompanies = companies.length;
  const platinumCount = companies.filter(c => c.partnershipTier === 'PLATINUM').length;
  const goldCount = companies.filter(c => c.partnershipTier === 'GOLD').length;
  const totalOpportunities = companies.reduce((acc, c) => acc + (c.activeOpportunitiesCount || 0), 0);

  // Filtered companies
  const filteredCompanies = companies.filter(c => {
    const matchesSearch =
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'ALL' || c.partnershipTier === tierFilter;
    const credStatus = c.credentials?.status || 'ACTIVE';
    const matchesStatus = statusFilter === 'ALL' || credStatus === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleQuickReset = (company: IndustryProfile) => {
    const pass = portalRepository.resetCompanyPassword(company.id);
    setQuickTempPassword({ id: company.id, pass });
    onRefresh();
  };

  const handleCopyPass = (id: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteCompany = (company: IndustryProfile) => {
    if (window.confirm(`Are you sure you want to decommission ${company.companyName}? This will revoke all recruiter logins.`)) {
      portalRepository.deleteCompany(company.id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Companies</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalCompanies}</span>
            <span className="text-xs text-slate-500">Corporate Partners</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platinum Tier</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-900">{platinumCount}</span>
            <span className="text-xs text-purple-600 font-medium">Direct Hiring</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gold Tier</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-900">{goldCount}</span>
            <span className="text-xs text-amber-600 font-medium">Verified MOUs</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Opportunities</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-900">{totalOpportunities}</span>
            <span className="text-xs text-emerald-600 font-medium">Positions Open</span>
          </div>
        </div>
      </div>

      {/* Control Header & Filters */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search companies by name, domain, city or contact..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tierFilter}
              onChange={e => setTierFilter(e.target.value)}
              className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Partnership Tiers</option>
              <option value="PLATINUM">Platinum Tier</option>
              <option value="GOLD">Gold Tier</option>
              <option value="PILOT">Pilot Tier</option>
              <option value="STANDARD">Standard Tier</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Login Statuses</option>
              <option value="ACTIVE">Active Logins</option>
              <option value="LOCKED">Locked</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsOnboardOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Onboard New Company
        </button>
      </div>

      {/* Companies List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCompanies.map(company => {
          const creds = company.credentials || {
            loginEmail: company.contactEmail,
            username: company.companyName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16) + '_admin',
            status: 'ACTIVE',
            twoFactorEnabled: true
          };

          return (
            <div
              key={company.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                      {company.companyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{company.companyName}</h3>
                        {company.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Verified
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          company.partnershipTier === 'PLATINUM'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : company.partnershipTier === 'GOLD'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {company.partnershipTier || 'GOLD'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{company.domain} • {company.location}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                    creds.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : creds.status === 'LOCKED'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    Login: {creds.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {company.description || company.tagline}
                </p>

                {/* Recruiter Details & Login Credentials preview */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Login Email: <strong className="text-slate-800 font-mono">{creds.loginEmail}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      User: <strong>{creds.username}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-200/50">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Contact: {company.contactPerson || 'TA Team'} ({company.contactPhone || 'N/A'})
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className={`w-3 h-3 ${creds.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                      2FA: {creds.twoFactorEnabled ? 'Enforced' : 'Off'}
                    </span>
                  </div>

                  {/* Quick password reset display if just generated */}
                  {quickTempPassword && quickTempPassword.id === company.id && (
                    <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-900 font-mono font-bold text-xs">
                        <Key className="w-3.5 h-3.5 text-amber-600" />
                        Temp: {quickTempPassword.pass}
                      </div>
                      <button
                        onClick={() => handleCopyPass(company.id, quickTempPassword.pass)}
                        className="px-2 py-0.5 text-[10px] font-semibold bg-white rounded border border-amber-300 text-amber-800 hover:bg-amber-100 flex items-center gap-1"
                      >
                        {copiedId === company.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedId === company.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Visit Corporate Website"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => handleDeleteCompany(company)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Decommission Corporate Partner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickReset(company)}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
                    title="Quick Temporary Password Reset"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-600" />
                    Reset Pass
                  </button>

                  <button
                    onClick={() => setLoginModalCompany(company)}
                    className="px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Manage Login & Access
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-700">No corporate partners found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or partnership tier filter, or onboard a new company.
          </p>
          <button
            onClick={() => setIsOnboardOpen(true)}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Onboard New Company
          </button>
        </div>
      )}

      {/* Modals */}
      <OnboardCompanyModal
        isOpen={isOnboardOpen}
        onClose={() => setIsOnboardOpen(false)}
        onSuccess={() => onRefresh()}
      />

      <CompanyLoginModal
        isOpen={!!loginModalCompany}
        company={loginModalCompany}
        onClose={() => setLoginModalCompany(null)}
        onUpdated={() => onRefresh()}
      />
    </div>
  );
};
