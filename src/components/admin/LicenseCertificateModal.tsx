import React from 'react';
import { InstitutionProfile } from '../../types';
import { X, ShieldCheck, Award, CheckCircle2, Calendar, FileText, Printer, Building2 } from 'lucide-react';

interface LicenseCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: InstitutionProfile;
}

export const LicenseCertificateModal: React.FC<LicenseCertificateModalProps> = ({
  isOpen,
  onClose,
  institution
}) => {
  if (!isOpen) return null;

  const sub = institution.subscription;
  const modules = sub?.modules;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Top Control Bar (Hidden in print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Skill Safar &bull; Institutional SLA & License Provisioning</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-900 border-8 border-slate-100 m-2 rounded-2xl relative">
          {/* Watermark / Seal */}
          <div className="absolute right-8 bottom-8 opacity-5 pointer-events-none select-none">
            <ShieldCheck className="w-72 h-72 text-slate-900" />
          </div>

          <div className="text-center space-y-2 border-b border-slate-200 pb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white mb-2">
              <Building2 className="w-6 h-6 text-slate-200" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Certificate of Enterprise Software Authorization
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
              Institutional Service Provisioning Agreement
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Issued by Skill Safar HQ &bull; Academia–Industry Continuous Competency Infrastructure
            </p>
          </div>

          {/* Certificate Content */}
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="text-slate-600">
              This document certifies that the academic institution designated below has been officially provisioned and authorized to deploy the <span className="font-bold text-slate-900">Skill Safar Institutional Suite</span> under active service terms:
            </p>

            {/* Institution Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Authorized Institution</div>
                <div className="font-bold text-base text-slate-900">{institution.name}</div>
                <div className="text-xs text-slate-600">Campus Code: {institution.code} &bull; {institution.location}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Service Plan Tier</div>
                <div className="font-bold text-base text-slate-900">
                  {sub?.planTier || 'STANDARD'} CAMPUS EDITION
                </div>
                <div className="text-xs text-slate-600">
                  Contract Value: ₹{sub?.contractValueInr ? sub.contractValueInr.toLocaleString('en-IN') : 'N/A'} / {sub?.billingCycle || 'Annual'}
                </div>
              </div>
            </div>

            {/* Quota & Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-medium text-slate-500">Licensed Student Seats</div>
                <div className="text-lg font-black text-slate-900">
                  {sub?.totalStudentSeats ? sub.totalStudentSeats.toLocaleString('en-IN') : institution.totalStudents.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-medium text-slate-500">Service Start Date</div>
                <div className="text-sm font-bold text-slate-900">{sub?.startDate || institution.joinedDate || '2026-01-01'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-medium text-slate-500">Next Renewal Date</div>
                <div className="text-sm font-bold text-slate-900">{sub?.renewalDate || '2026-12-31'}</div>
              </div>
            </div>

            {/* Active Modules Authorized */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Authorized Service Capabilities & Modules:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.skillAssessmentEngine ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.skillAssessmentEngine ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>Deterministic Assessment Engine & Ledger</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.mcpAiCareerAdvisor ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.mcpAiCareerAdvisor ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>MCP AI Grounded Career Assistant</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.industryRecruiterBridge ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.industryRecruiterBridge ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>Industry Recruiter Pipeline & Matching</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.facultyResearchHub ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.facultyResearchHub ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>Faculty Industry R&D & Sabbaticals</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.naacNirfAnalytics ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.naacNirfAnalytics ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>NAAC Criteria 5 & NIRF Placement Analytics</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-2 ${modules?.customBrandingSso ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-50/40 border-slate-200 text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${modules?.customBrandingSso ? 'text-slate-900' : 'text-slate-300'}`} />
                  <span>Single Sign-On (SSO) & Custom Subdomain</span>
                </div>
              </div>
            </div>

            {/* Signatures & Security Stamp */}
            <div className="pt-6 border-t border-slate-200 flex items-end justify-between gap-4 text-xs">
              <div>
                <div className="font-mono text-[11px] text-slate-500">License Verification Hash:</div>
                <div className="font-mono text-[10px] text-slate-800 font-semibold truncate max-w-xs">
                  SHA256: 7f8a92b1ec03...{institution.id.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Assigned Account Manager: {sub?.accountManagerName || 'Skill Safar Operations Lead'}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block border-b border-slate-900 px-6 pb-1 font-semibold text-slate-900">
                  Skill Safar Operations Council
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Authorized Software Dispatch</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
