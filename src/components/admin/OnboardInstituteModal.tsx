import React, { useState } from 'react';
import { InstitutionProfile, ServiceTier, ServiceModuleConfig } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  X,
  Building2,
  CheckCircle2,
  Layers,
  Sparkles,
  Users,
  Plus,
  School,
  FileCheck
} from 'lucide-react';

interface OnboardInstituteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newInst: InstitutionProfile) => void;
}

const COMMON_DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Data Science & Artificial Intelligence',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology & Bioinformatics',
  'Robotics & Automation',
  'Master of Computer Applications (MCA)'
];

export const OnboardInstituteModal: React.FC<OnboardInstituteModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('Karnataka');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [naacGrade, setNaacGrade] = useState('A+');
  const [nirfRank, setNirfRank] = useState<number | ''>(25);
  const [totalStudents, setTotalStudents] = useState<number>(3000);
  const [placedPercentage, setPlacedPercentage] = useState<number>(82);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([
    'Computer Science & Engineering',
    'Information Technology',
    'Data Science & Artificial Intelligence'
  ]);
  const [customDeptInput, setCustomDeptInput] = useState('');

  // Service package setup
  const [tier, setTier] = useState<ServiceTier>('PROFESSIONAL');
  const [contractValue, setContractValue] = useState<number>(850000);
  const [billingCycle, setBillingCycle] = useState<'Annual' | 'Quarterly' | 'Multi-Year (3 Years)' | '90-Day Pilot'>(
    'Annual'
  );
  const [totalSeats, setTotalSeats] = useState<number>(3500);

  if (!isOpen) return null;

  const handleToggleDept = (dept: string) => {
    if (selectedDepts.includes(dept)) {
      if (selectedDepts.length > 1) {
        setSelectedDepts(selectedDepts.filter(d => d !== dept));
      }
    } else {
      setSelectedDepts([...selectedDepts, dept]);
    }
  };

  const handleAddCustomDept = () => {
    if (customDeptInput.trim() && !selectedDepts.includes(customDeptInput.trim())) {
      setSelectedDepts([...selectedDepts, customDeptInput.trim()]);
      setCustomDeptInput('');
    }
  };

  const handleTierSelect = (selectedTier: ServiceTier) => {
    setTier(selectedTier);
    if (selectedTier === 'PILOT') {
      setContractValue(150000);
      setBillingCycle('90-Day Pilot');
      setTotalSeats(1500);
    } else if (selectedTier === 'STANDARD') {
      setContractValue(450000);
      setBillingCycle('Annual');
      setTotalSeats(2500);
    } else if (selectedTier === 'PROFESSIONAL') {
      setContractValue(850000);
      setBillingCycle('Annual');
      setTotalSeats(4000);
    } else if (selectedTier === 'ENTERPRISE') {
      setContractValue(1850000);
      setBillingCycle('Annual');
      setTotalSeats(8000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !location) return;

    const moduleDefaults: ServiceModuleConfig = {
      skillAssessmentEngine: true,
      mcpAiCareerAdvisor: true,
      industryRecruiterBridge: true,
      facultyResearchHub: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
      naacNirfAnalytics: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
      customBrandingSso: tier === 'ENTERPRISE'
    };

    const newInstData: Omit<InstitutionProfile, 'id' | 'joinedDate'> = {
      name,
      code: code.toUpperCase(),
      location,
      state,
      contactPerson: contactPerson || 'Dean of Placement & Corporate Relations',
      contactEmail: contactEmail || `contact@${code.toLowerCase()}.edu.in`,
      contactPhone: contactPhone || '+91 80 2345 6789',
      naacGrade,
      nirfRank: typeof nirfRank === 'number' ? nirfRank : undefined,
      totalStudents: Number(totalStudents) || 3000,
      placedPercentage: Number(placedPercentage) || 80,
      departments: selectedDepts,
      status: 'ACTIVE',
      subscription: {
        planTier: tier,
        contractValueInr: Number(contractValue),
        billingCycle,
        startDate: new Date().toISOString().split('T')[0],
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalStudentSeats: Number(totalSeats),
        allocatedStudentSeats: Number(totalStudents),
        accountManagerName: 'Skill Safar Enterprise Partner',
        accountManagerEmail: 'enterprise@skillsafar.internal',
        contractStatus: 'Active',
        modules: moduleDefaults,
        lastInvoiceNumber: `INV-${Date.now().toString().slice(-6)}`
      }
    };

    const created = portalRepository.createInstitution(newInstData);
    onCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
              <School className="w-4 h-4 text-slate-900" />
              <span>Skill Safar Institutional Onboarding</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Provision New Partner Institute
            </h3>
            <p className="text-xs text-slate-500">
              Enroll college campus, allocate student licenses, and assign service package.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Section 1: Institution Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-900" />
              <span>1. Institutional Identity & Accreditation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Full Institution Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Birla Institute of Advanced Technology"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Campus Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BIAT-PUNE"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Campus City & Location <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  NAAC Grade
                </label>
                <select
                  value={naacGrade}
                  onChange={e => setNaacGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="A++">A++ (Accredited)</option>
                  <option value="A+">A+ (Accredited)</option>
                  <option value="A">A (Accredited)</option>
                  <option value="B++">B++</option>
                  <option value="Autonomous">Autonomous University</option>
                  <option value="In-Process">Accreditation In-Process</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  NIRF Engineering Rank
                </label>
                <input
                  type="number"
                  placeholder="e.g. 28"
                  value={nirfRank}
                  onChange={e => setNirfRank(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact & Key Personnel */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-900" />
              <span>2. Dean / Placement Director Contact</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Contact Person / Dean
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Satish Kumar (Director)"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="dean.placements@campus.edu.in"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Academic Departments */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Covered Academic Departments ({selectedDepts.length})
              </h4>
              <span className="text-[10px] text-slate-500">Select participating departments</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {COMMON_DEPARTMENTS.map(d => {
                const isSelected = selectedDepts.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleToggleDept(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add other department..."
                value={customDeptInput}
                onChange={e => setCustomDeptInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomDept();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                type="button"
                onClick={handleAddCustomDept}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded-lg"
              >
                Add
              </button>
            </div>
          </div>

          {/* Section 4: Service Package & Pricing */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-900" />
              <span>4. Service Package Tier & Licensing</span>
            </h4>

            {/* Plan Tier selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['PILOT', 'STANDARD', 'PROFESSIONAL', 'ENTERPRISE'] as ServiceTier[]).map(t => {
                const isSelected = tier === t;
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
                    <div className="text-xs font-bold">{t}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      {t === 'PILOT' ? '₹1.5L (90D)' : t === 'STANDARD' ? '₹4.5L/yr' : t === 'PROFESSIONAL' ? '₹8.5L/yr' : '₹18.5L/yr'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contract Value (INR ₹)</label>
                <input
                  type="number"
                  value={contractValue}
                  onChange={e => setContractValue(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Billing Term</label>
                <select
                  value={billingCycle}
                  onChange={e => setBillingCycle(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800"
                >
                  <option value="Annual">Annual Prepaid</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Multi-Year (3 Years)">Multi-Year (3 Years)</option>
                  <option value="90-Day Pilot">90-Day Pilot</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Student License Seats</label>
                <input
                  type="number"
                  value={totalSeats}
                  onChange={e => setTotalSeats(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900"
                  required
                />
              </div>
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
              <FileCheck className="w-3.5 h-3.5" />
              <span>Complete Provisioning & Onboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
