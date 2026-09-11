import React, { useState } from 'react';
import { IndustryProfile } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { X, Building2, Mail, Phone, Globe, MapPin, Key, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

interface OnboardCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (company: IndustryProfile) => void;
}

export const OnboardCompanyModal: React.FC<OnboardCompanyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [domain, setDomain] = useState('Cloud Infrastructure & SaaS');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('Bangalore, India');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [partnershipTier, setPartnershipTier] = useState<'PLATINUM' | 'GOLD' | 'PILOT' | 'STANDARD'>('GOLD');
  const [mouSigned, setMouSigned] = useState(true);
  const [initialPassword, setInitialPassword] = useState('Recruiter@2026');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setError('Please provide a valid official corporate email.');
      return;
    }

    try {
      const username = companyName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16) + '_admin';
      const created = portalRepository.onboardCompany({
        companyName: companyName.trim(),
        domain,
        tagline: tagline.trim() || `Next-generation ${domain} leader`,
        description: description.trim() || `${companyName} collaborates with partner institutions for campus hiring and specialized technical internships.`,
        website: website.trim() || `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        location: location.trim() || 'Bangalore, India',
        contactEmail: contactEmail.trim(),
        contactPerson: contactPerson.trim() || 'Talent Acquisition Head',
        contactPhone: contactPhone.trim() || '+91 98765 00000',
        isVerified: true,
        partnershipTier,
        mouSigned,
        credentials: {
          loginEmail: contactEmail.trim(),
          username,
          status: 'ACTIVE',
          lastLoginAt: 'Never',
          twoFactorEnabled,
          temporaryPassword: initialPassword
        }
      });

      if (onSuccess) onSuccess(created);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to onboard company.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Onboard Corporate Partner</h2>
              <p className="text-xs text-indigo-200 mt-0.5">Provision enterprise company tenant, credentials & hiring bridge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Company Profile */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Company Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Robotics India"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Industry Sector / Domain</label>
                <select
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="Cloud Infrastructure & SaaS">Cloud Infrastructure & SaaS</option>
                  <option value="Financial Technology & Security">Financial Technology & Security</option>
                  <option value="Healthcare & Data Science">Healthcare & Data Science</option>
                  <option value="AI & Autonomous Systems">AI & Autonomous Systems</option>
                  <option value="Semiconductors & Embedded IoT">Semiconductors & Embedded IoT</option>
                  <option value="Aerospace & Defense Tech">Aerospace & Defense Tech</option>
                  <option value="E-Commerce & Supply Chain">E-Commerce & Supply Chain</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Website URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Headquarters / Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, India"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Brief Description / Mission</label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Core technology focus, product lines, and internship domains..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 2: Contact & Partnership Tier */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Partnership & Point of Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Partnership Tier</label>
                <select
                  value={partnershipTier}
                  onChange={e => setPartnershipTier(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="PLATINUM">Platinum Tier (Direct Campus Hiring & Joint Labs)</option>
                  <option value="GOLD">Gold Tier (Verified Opportunities & Pre-Screened Talent)</option>
                  <option value="PILOT">Pilot Tier (90-Day Assessment Trial)</option>
                  <option value="STANDARD">Standard Tier (Standard Job Board Access)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="mouCheckbox"
                  checked={mouSigned}
                  onChange={e => setMouSigned(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="mouCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer">
                  MOU & Data Privacy Agreement Signed
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Initial Recruiter Login Account */}
          <div className="space-y-3 pt-2 border-t border-slate-100 bg-slate-50 p-4 rounded-xl border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              Recruiter Admin Account & Initial Login
            </h3>
            <p className="text-xs text-slate-500">
              Master Admin generates the primary enterprise recruiter login. You can manage or rotate these credentials at any time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Initial Temporary Password</label>
                <input
                  type="text"
                  value={initialPassword}
                  onChange={e => setInitialPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono bg-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="twoFactorCheckbox"
                  checked={twoFactorEnabled}
                  onChange={e => setTwoFactorEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="twoFactorCheckbox" className="text-xs font-medium text-slate-700 cursor-pointer flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Enforce Two-Factor Authentication (2FA)
                </label>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Onboard & Activate Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
