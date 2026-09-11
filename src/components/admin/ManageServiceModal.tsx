import React, { useState } from 'react';
import { InstitutionProfile, ServiceTier, ServiceModuleConfig } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Users,
  Calendar,
  Save,
  Sliders,
  DollarSign
} from 'lucide-react';

interface ManageServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionProfile;
  onUpdated: () => void;
}

export const ManageServiceModal: React.FC<ManageServiceModalProps> = ({
  isOpen,
  onClose,
  institution,
  onUpdated
}) => {
  if (!isOpen) return null;

  const sub = institution.subscription;
  const [tier, setTier] = useState<ServiceTier>(sub?.planTier || 'STANDARD');
  const [seats, setSeats] = useState<number>(sub?.totalStudentSeats || institution.totalStudents || 2500);
  const [contractValue, setContractValue] = useState<number>(sub?.contractValueInr || 850000);
  const [billingCycle, setBillingCycle] = useState<'Annual' | 'Quarterly' | 'Multi-Year (3 Years)' | '90-Day Pilot'>(
    sub?.billingCycle || 'Annual'
  );
  const [modules, setModules] = useState<ServiceModuleConfig>({
    skillAssessmentEngine: sub?.modules?.skillAssessmentEngine ?? true,
    mcpAiCareerAdvisor: sub?.modules?.mcpAiCareerAdvisor ?? true,
    industryRecruiterBridge: sub?.modules?.industryRecruiterBridge ?? true,
    facultyResearchHub: sub?.modules?.facultyResearchHub ?? (tier === 'PROFESSIONAL' || tier === 'ENTERPRISE'),
    naacNirfAnalytics: sub?.modules?.naacNirfAnalytics ?? (tier === 'PROFESSIONAL' || tier === 'ENTERPRISE'),
    customBrandingSso: sub?.modules?.customBrandingSso ?? (tier === 'ENTERPRISE')
  });

  const handleTierSelect = (selectedTier: ServiceTier) => {
    setTier(selectedTier);
    if (selectedTier === 'PILOT') {
      setContractValue(150000);
      setBillingCycle('90-Day Pilot');
      setModules({
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: false,
        naacNirfAnalytics: false,
        customBrandingSso: false
      });
    } else if (selectedTier === 'STANDARD') {
      setContractValue(450000);
      setBillingCycle('Annual');
      setModules({
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: true,
        naacNirfAnalytics: false,
        customBrandingSso: false
      });
    } else if (selectedTier === 'PROFESSIONAL') {
      setContractValue(850000);
      setBillingCycle('Annual');
      setModules({
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: true,
        naacNirfAnalytics: true,
        customBrandingSso: false
      });
    } else if (selectedTier === 'ENTERPRISE') {
      setContractValue(1850000);
      setBillingCycle('Annual');
      setModules({
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: true,
        naacNirfAnalytics: true,
        customBrandingSso: true
      });
    }
  };

  const handleToggleModule = (key: keyof ServiceModuleConfig) => {
    setModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    portalRepository.assignServiceToInstitute(
      institution.id,
      tier,
      modules,
      Number(seats),
      Number(contractValue),
      billingCycle
    );
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              <Sliders className="w-4 h-4 text-slate-900" />
              <span>Skill Safar Service Assignment</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Manage Services &bull; {institution.code}
            </h3>
            <p className="text-xs text-slate-500">{institution.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Service Plan Tier Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-900" />
              <span>Select Service Package Tier</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['PILOT', 'STANDARD', 'PROFESSIONAL', 'ENTERPRISE'] as ServiceTier[]).map(t => {
                const isSelected = tier === t;
                const badges: Record<ServiceTier, string> = {
                  PILOT: '90-Day Validation • ₹1.5L',
                  STANDARD: 'Core Skills • ₹4.5L/yr',
                  PROFESSIONAL: 'Most Popular • ₹8.5L/yr',
                  ENTERPRISE: 'Full Campus MoU • ₹18.5L/yr'
                };
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTierSelect(t)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className={`text-[10px] mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {badges[t]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Seat Quotas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Annual Contract Value (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                step="10000"
                value={contractValue}
                onChange={e => setContractValue(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Billing Cycle
              </label>
              <select
                value={billingCycle}
                onChange={e => setBillingCycle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Annual">Annual (Prepaid)</option>
                <option value="Quarterly">Quarterly Tranche</option>
                <option value="Multi-Year (3 Years)">Multi-Year (3-Year Institutional MoU)</option>
                <option value="90-Day Pilot">90-Day Pilot Evaluation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Licensed Student Seat Quota
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={seats}
                onChange={e => setSeats(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Contract Renewal Term
              </label>
              <div className="px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium">
                Auto-extends 365 days from activation
              </div>
            </div>
          </div>

          {/* Individual Module Feature Gates */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Modular Capabilities Enabled
              </label>
              <span className="text-[10px] text-slate-500">Click to toggle specific modules</span>
            </div>

            <div className="space-y-2">
              {[
                {
                  key: 'skillAssessmentEngine' as const,
                  title: 'Skill Assessment Engine & Proof Ledger',
                  desc: 'Timed evaluations, verified competency scoring, and deterministic evidence generation.'
                },
                {
                  key: 'mcpAiCareerAdvisor' as const,
                  title: 'MCP AI Grounded Career Assistant',
                  desc: 'Interactive generative advising with syllabus gap mapping.'
                },
                {
                  key: 'industryRecruiterBridge' as const,
                  title: 'Industry Recruiter Discovery & Job Matcher',
                  desc: 'Corporate hiring pipelines, screening filters, and verified student applications.'
                },
                {
                  key: 'facultyResearchHub' as const,
                  title: 'Faculty Industry R&D & Summer Sabbaticals',
                  desc: 'Joint university-corporate grants, FDP programs, and consultancy postings.'
                },
                {
                  key: 'naacNirfAnalytics' as const,
                  title: 'NAAC Criteria 5 & NIRF Placement Analytics',
                  desc: 'Automated accreditation documentation, department readiness, and exportable reports.'
                },
                {
                  key: 'customBrandingSso' as const,
                  title: 'Campus Single Sign-On (SAML/OAuth) & Subdomain',
                  desc: 'Custom university portal address with institutional active directory synchronization.'
                }
              ].map(m => {
                const isEnabled = modules[m.key];
                return (
                  <div
                    key={m.key}
                    onClick={() => handleToggleModule(m.key)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isEnabled
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => {}} // Handled by container onClick
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500 leading-snug">{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Service Provisioning</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
