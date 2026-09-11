import React, { useState, useEffect } from 'react';
import {
  InstitutionProfile,
  IndustryProfile,
  ManagedStudent,
  ManagedMentor,
  SystemAuditLog,
  ServiceTier,
  ServicePlanCatalogItem
} from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { OnboardInstituteModal } from './OnboardInstituteModal';
import { ManageServiceModal } from './ManageServiceModal';
import { LicenseCertificateModal } from './LicenseCertificateModal';
import { CompanyManagementTab } from './CompanyManagementTab';
import { StudentManagementTab } from './StudentManagementTab';
import { MentorManagementTab } from './MentorManagementTab';
import { InstitutionDetailModal } from './InstitutionDetailModal';
import { InstitutionLoginModal } from './InstitutionLoginModal';
import {
  Building2,
  School,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  Sliders,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ExternalLink,
  Power,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Trash2,
  Lock,
  Mail,
  Phone,
  LogOut,
  Briefcase,
  GraduationCap,
  Key,
  Database
} from 'lucide-react';

interface MasterAdminBackendProps {
  onNavigateToInstituteView?: (institutionId: string) => void;
  onSignOut?: () => void;
  onExitToPortal?: () => void;
}

export const MasterAdminBackend: React.FC<MasterAdminBackendProps> = ({
  onNavigateToInstituteView,
  onSignOut,
  onExitToPortal
}) => {
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [cloudDb, setCloudDb] = useState(portalRepository.getCloudDatabaseStatus());
  const [companies, setCompanies] = useState<IndustryProfile[]>([]);
  const [managedStudents, setManagedStudents] = useState<ManagedStudent[]>([]);
  const [managedMentors, setManagedMentors] = useState<ManagedMentor[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([]);
  const [servicePlans, setServicePlans] = useState<ServicePlanCatalogItem[]>([]);
  const [activeTab, setActiveTab] = useState<
    'institutes' | 'companies' | 'students' | 'mentors' | 'services' | 'pipeline' | 'audit'
  >('institutes');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [managingInst, setManagingInst] = useState<InstitutionProfile | null>(null);
  const [certificateInst, setCertificateInst] = useState<InstitutionProfile | null>(null);
  const [deepManageInst, setDeepManageInst] = useState<InstitutionProfile | null>(null);
  const [loginModalInst, setLoginModalInst] = useState<InstitutionProfile | null>(null);

  // System feature toggles
  const [aiAdvisorEnabled, setAiAdvisorEnabled] = useState(true);
  const [strictScoringMode, setStrictScoringMode] = useState(true);
  const [publicRecruiterDiscovery, setPublicRecruiterDiscovery] = useState(true);

  const refreshData = () => {
    setInstitutions(portalRepository.getInstitutions());
    setCompanies(portalRepository.getIndustries());
    setManagedStudents(portalRepository.getManagedStudents());
    setManagedMentors(portalRepository.getManagedMentors());
    setAuditLogs(portalRepository.getAuditLogs());
    setServicePlans(portalRepository.getServicePlans());
    setCloudDb({ ...portalRepository.getCloudDatabaseStatus() });
  };

  useEffect(() => {
    refreshData();
    portalRepository.recheckCloudConnection().then(() => {
      setCloudDb({ ...portalRepository.getCloudDatabaseStatus() });
    });
    const unsub = portalRepository.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, []);

  // Quick stats calculations
  const totalInstitutes = institutions.length;
  const activeInstitutes = institutions.filter(i => i.status === 'ACTIVE').length;
  const totalLicensedSeats = institutions.reduce(
    (acc, curr) => acc + (curr.subscription?.totalStudentSeats || curr.totalStudents || 0),
    0
  );
  const totalAnnualContractValue = institutions.reduce(
    (acc, curr) => acc + (curr.subscription?.contractValueInr || 0),
    0
  );
  const avgPlacementRate = institutions.length
    ? Math.round(institutions.reduce((acc, curr) => acc + curr.placedPercentage, 0) / institutions.length)
    : 85;

  // Filtered institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.contactPerson && inst.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier =
      tierFilter === 'ALL' || inst.subscription?.planTier === tierFilter;

    const matchesStatus =
      statusFilter === 'ALL' || inst.status === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  const handleToggleStatus = (id: string, name: string) => {
    portalRepository.toggleInstituteStatus(id);
  };

  const handleDeleteInstitute = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to decommission and delete ${name}? This will remove all campus records.`)) {
      portalRepository.deleteInstitution(id);
    }
  };

  const handleOpenManageServiceFromTier = (planTier: ServiceTier) => {
    if (institutions.length > 0) {
      setManagingInst(institutions[0]);
    } else {
      setIsOnboardModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top HQ Operator Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
            <ShieldCheck className="w-7 h-7 text-slate-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-display font-bold text-slate-900">
                Skill Safar HQ &bull; Master Operations & Sales Backend
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-slate-900 text-white rounded-md">
                Master Admin Portal
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Internal Service Gateway Live
              </span>
              <span
                className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-md flex items-center gap-1.5"
                title={`Cloud Firestore: ${cloudDb.projectId} in ${cloudDb.region} (Database: ${cloudDb.databaseId})`}
              >
                <Database className="w-3 h-3 text-indigo-600" />
                <span>Cloud Database: {cloudDb.region} &bull; {cloudDb.projectId}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${cloudDb.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Institutional SaaS Provisioning, Package Licensing, Multi-Campus Tenant Management & SLA Enforcement
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => setIsOnboardModalOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Institute</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo institutions and audit logs to factory defaults?')) {
                portalRepository.resetToDefaults();
              }
            }}
            title="Reset repository to seed defaults"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200 text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-xl transition-colors border border-slate-200 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5"
              title="Sign out of Master Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Enrolled Partner Institutes</span>
            <Building2 className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalInstitutes}</span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              {activeInstitutes} Active &bull; {totalInstitutes - activeInstitutes} Trial
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Campuses using Skill Safar services</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Licensed Student Capacity</span>
            <Users className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{totalLicensedSeats.toLocaleString('en-IN')}</span>
            <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
              Total Seats
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Assigned across collegiate departments</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Annual Recurring Contract Value</span>
            <TrendingUp className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              ₹{(totalAnnualContractValue / 100000).toFixed(1)}L
            </span>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              +100% Retained
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Contracted institutional licensing</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Platform Placement Index</span>
            <Award className="w-4 h-4 text-slate-700" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{avgPlacementRate}%</span>
            <span className="text-xs text-slate-800 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
              Multi-Campus Avg
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Benchmark across verified students</p>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto">
        {[
          { id: 'institutes', label: 'Institutions & Subscriptions', icon: Building2, count: institutions.length },
          { id: 'companies', label: 'Companies & Recruiters', icon: Briefcase, count: companies.length },
          { id: 'students', label: 'Students Roster', icon: GraduationCap, count: managedStudents.length },
          { id: 'mentors', label: 'Mentors & Faculty', icon: Users, count: managedMentors.length },
          { id: 'services', label: 'Service Packages & Catalog', icon: Layers, count: servicePlans.length },
          { id: 'pipeline', label: 'Commercial Revenue & Leads', icon: DollarSign },
          { id: 'audit', label: 'Backend Audit Trail & Controls', icon: Activity, count: auditLogs.length }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Institutes & Subscriptions */}
      {activeTab === 'institutes' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search institute name, code, or city..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium shrink-0">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Service Tiers</option>
                <option value="ENTERPRISE">Enterprise Tier</option>
                <option value="PROFESSIONAL">Professional Tier</option>
                <option value="STANDARD">Standard Tier</option>
                <option value="PILOT">Pilot Tier</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
              </select>

              {(searchQuery || tierFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTierFilter('ALL');
                    setStatusFilter('ALL');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline px-1 shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Institutes Grid / List */}
          <div className="space-y-3">
            {filteredInstitutions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No partner institutes found</h3>
                <p className="text-xs text-slate-500">
                  Try adjusting your search query or onboard a new institute to assign services.
                </p>
                <button
                  onClick={() => setIsOnboardModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
                >
                  Onboard Institute Now
                </button>
              </div>
            ) : (
              filteredInstitutions.map(inst => {
                const sub = inst.subscription;
                const modules = sub?.modules;
                const activeModuleCount = modules
                  ? Object.values(modules).filter(Boolean).length
                  : 0;

                const tierColors: Record<ServiceTier, string> = {
                  ENTERPRISE: 'bg-slate-900 text-white border-slate-900',
                  PROFESSIONAL: 'bg-slate-100 text-slate-900 border-slate-300',
                  STANDARD: 'bg-slate-100 text-slate-700 border-slate-200',
                  PILOT: 'bg-amber-50 text-amber-900 border-amber-200'
                };

                const isSuspended = inst.status === 'SUSPENDED';

                return (
                  <div
                    key={inst.id}
                    className={`bg-white rounded-2xl p-6 border transition-all shadow-xs ${
                      isSuspended
                        ? 'border-rose-200 bg-rose-50/20 opacity-80'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Left: Identity & Contact */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-900 border border-slate-200 font-mono">
                            {inst.code}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                              tierColors[sub?.planTier || 'STANDARD']
                            }`}
                          >
                            {sub?.planTier || 'STANDARD'} PACKAGE
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              inst.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : inst.status === 'TRIAL'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-rose-50 text-rose-800 border border-rose-200'
                            }`}
                          >
                            {inst.status || 'ACTIVE'}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            NAAC {inst.naacGrade} {inst.nirfRank ? `• NIRF #${inst.nirfRank}` : ''}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-slate-900 truncate">
                            {inst.name}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-0.5 flex-wrap">
                            <span>{inst.location}</span>
                            <span>&bull;</span>
                            <span>{inst.departments.length} Academic Departments</span>
                            {inst.contactPerson && (
                              <>
                                <span>&bull;</span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-slate-400" />
                                  {inst.contactPerson}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Active Service Modules Chips */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                            Services ({activeModuleCount}/6):
                          </span>
                          {modules?.skillAssessmentEngine && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              Assessments
                            </span>
                          )}
                          {modules?.mcpAiCareerAdvisor && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              MCP AI Advisor
                            </span>
                          )}
                          {modules?.industryRecruiterBridge && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              Industry Bridge
                            </span>
                          )}
                          {modules?.facultyResearchHub && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              Faculty R&D
                            </span>
                          )}
                          {modules?.naacNirfAnalytics && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              NAAC/NIRF Engine
                            </span>
                          )}
                          {modules?.customBrandingSso && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-700 border border-slate-200">
                              SSO & Domain
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Quota & Contract Stats */}
                      <div className="flex items-center gap-3 shrink-0 border-y lg:border-y-0 lg:border-x border-slate-100 py-3 lg:py-0 lg:px-6">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-28">
                          <div className="text-[10px] text-slate-500 font-medium">Licensed Seats</div>
                          <div className="text-base font-black text-slate-900">
                            {sub?.totalStudentSeats ? sub.totalStudentSeats.toLocaleString('en-IN') : inst.totalStudents.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {inst.totalStudents.toLocaleString('en-IN')} Enrolled
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-28">
                          <div className="text-[10px] text-slate-500 font-medium">Annual Contract</div>
                          <div className="text-base font-black text-slate-900">
                            ₹{sub?.contractValueInr ? (sub.contractValueInr / 100000).toFixed(2) + 'L' : 'Custom'}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {sub?.billingCycle || 'Annual'}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                        {/* Deep Manage (Students, Mentors, Profile, Security) */}
                        <button
                          onClick={() => setDeepManageInst(inst)}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          title="Deeply manage institution students, mentors, credentials & profile"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Deep Manage</span>
                        </button>

                        {/* Campus Admin Login & SSO */}
                        <button
                          onClick={() => setLoginModalInst(inst)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 transition-colors"
                          title="Campus Login Credentials, SSO Domain & Password Reset"
                        >
                          <Key className="w-4 h-4" />
                        </button>

                        {/* Assign / Edit Service */}
                        <button
                          onClick={() => setManagingInst(inst)}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                          title="Assign or customize services"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Assign Services</span>
                        </button>

                        {/* View Live Campus Dashboard / Impersonate */}
                        <button
                          onClick={() => {
                            portalRepository.setActiveInstitutionId(inst.id);
                            if (onNavigateToInstituteView) {
                              onNavigateToInstituteView(inst.id);
                            }
                          }}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center gap-1.5"
                          title="View live campus analytics as Institution Dean"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">View Campus</span>
                        </button>

                        {/* SLA Certificate */}
                        <button
                          onClick={() => setCertificateInst(inst)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors"
                          title="View SLA & Software License Certificate"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Toggle Active / Suspended */}
                        <button
                          onClick={() => handleToggleStatus(inst.id, inst.name)}
                          className={`p-2 rounded-xl border transition-colors ${
                            isSuspended
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={isSuspended ? 'Reactivate Service' : 'Suspend Service Access'}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Delete / Decommission */}
                        <button
                          onClick={() => handleDeleteInstitute(inst.id, inst.name)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 transition-colors"
                          title="Decommission & delete this institute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB: Companies & Corporate Recruiters */}
      {activeTab === 'companies' && (
        <CompanyManagementTab companies={companies} onRefresh={refreshData} />
      )}

      {/* TAB: Students Roster & Credentials */}
      {activeTab === 'students' && (
        <StudentManagementTab
          students={managedStudents}
          institutions={institutions}
          onRefresh={refreshData}
        />
      )}

      {/* TAB: Mentors & Faculty Advisors */}
      {activeTab === 'mentors' && (
        <MentorManagementTab
          mentors={managedMentors}
          institutions={institutions}
          onRefresh={refreshData}
        />
      )}

      {/* TAB 2: Service Packages & Commercial Catalog */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Skill Safar Institutional Service Packages
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Our team offers 4 standardized tiers to colleges, universities, and polytechnic institutes. Each package includes deterministic scoring and automated verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {servicePlans.map(plan => {
                return (
                  <div
                    key={plan.tier}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      plan.popularBadge
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                        : 'bg-white text-slate-900 border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            plan.popularBadge
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {plan.tier} TIER
                        </span>
                        {plan.popularBadge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                            Most Sold
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-base font-bold leading-tight">{plan.name}</h4>
                        <p
                          className={`text-xs mt-1 ${
                            plan.popularBadge ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {plan.tagline}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/20">
                        <div className="text-2xl font-black">
                          ₹{(plan.annualPriceInr / 100000).toFixed(2)} Lakhs
                        </div>
                        <div
                          className={`text-[11px] ${
                            plan.popularBadge ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {plan.tier === 'PILOT' ? 'One-time 90-day pilot' : 'per campus / year'}
                        </div>
                        <div
                          className={`text-xs font-semibold mt-1 ${
                            plan.popularBadge ? 'text-slate-200' : 'text-slate-700'
                          }`}
                        >
                          {plan.recommendedStudents}
                        </div>
                      </div>

                      {/* Included features */}
                      <div className="space-y-1.5 pt-2">
                        <div
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            plan.popularBadge ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          Features Included:
                        </div>
                        {plan.modulesIncluded.map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2
                              className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                plan.popularBadge ? 'text-emerald-400' : 'text-slate-900'
                              }`}
                            />
                            <span
                              className={plan.popularBadge ? 'text-slate-200' : 'text-slate-700'}
                            >
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-200/20">
                      <button
                        onClick={() => handleOpenManageServiceFromTier(plan.tier)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          plan.popularBadge
                            ? 'bg-white hover:bg-slate-100 text-slate-900'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Assign to Institute</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modular Capability Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Complete Modular Capabilities Reference (Individual Assignability)
            </h3>
            <p className="text-xs text-slate-500">
              Our team can toggle any of these 6 micro-modules independently for each institution under the "Assign Services" console.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  <span>Deterministic Skill Assessment Engine</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Timed technical exams with code analysis, algorithmic scoring, and multi-source evidence linking.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-slate-900" />
                  <span>MCP AI Grounded Career Advisor</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Explainable career recommendations grounded in university curriculum and corporate opportunity taxonomy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-900" />
                  <span>Direct Industry Recruiter Bridge</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Screening console for corporate partners to source pre-vetted interns, apprentices, and full-time hires.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-slate-900" />
                  <span>Faculty Industry R&D & Sabbaticals</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Match senior faculty with industry joint-research grants, summer fellowships, and sponsored FDP workshops.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-slate-900" />
                  <span>NAAC Criteria 5 & NIRF Placement Analytics</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  One-click generation of placement readiness benchmarks, department index metrics, and audit documentation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-900" />
                  <span>Campus SSO & Whitelabeled Portal</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Single Sign-on integration via SAML 2.0 / OAuth2 with institutional active directories and custom DNS subdomain.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Commercial Revenue & Leads */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Institutional License Revenue & Contract Expiries
              </h3>
              <p className="text-xs text-slate-500">
                Current active billings under management by the Skill Safar sales team.
              </p>

              <div className="space-y-3">
                {institutions.map(inst => {
                  const sub = inst.subscription;
                  return (
                    <div
                      key={inst.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                        <div className="text-slate-500">
                          {sub?.planTier || 'STANDARD'} &bull; ₹{sub?.contractValueInr ? sub.contractValueInr.toLocaleString('en-IN') : '0'} &bull; Term: {sub?.billingCycle || 'Annual'}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">Renewal Date</div>
                          <div className="text-slate-500">{sub?.renewalDate || '2026-12-31'}</div>
                        </div>

                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase tracking-wider text-[10px]">
                          {sub?.contractStatus || 'Active'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales Pipeline & Lead CRM */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">Prospect Inquiries</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  In Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Colleges requesting demonstrations or MoUs with our sales team.
              </p>

              <div className="space-y-3">
                {[
                  {
                    name: 'Delhi Technological University',
                    lead: 'Dr. Alok Verma (TPO)',
                    interest: 'Enterprise MoU • 6,000 Students',
                    status: 'MoU Review'
                  },
                  {
                    name: 'Coimbatore Institute of Tech',
                    lead: 'Prof. S. Natarajan',
                    interest: 'Professional Suite • 3,200 Students',
                    status: 'Pilot Demo'
                  },
                  {
                    name: 'Symbiosis Institute of Tech',
                    lead: 'Dr. Kavita Shah (Dean)',
                    interest: 'Standard Campus • 2,400 Students',
                    status: 'Proposal Sent'
                  }
                ].map((lead, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{lead.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded">
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">{lead.lead}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{lead.interest}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsOnboardModalOpen(true)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Onboard Prospect Campus</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Global Audit Trail & System Controls */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Global System Feature Switches */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Master Platform Feature Gates & System Operations
            </h3>
            <p className="text-xs text-slate-500">
              Manage platform-wide configurations that affect all connected campuses and corporate portals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">MCP AI Career Advisor</div>
                  <div className="text-[11px] text-slate-500">Global generative engine endpoint</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAiAdvisorEnabled(!aiAdvisorEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    aiAdvisorEnabled ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      aiAdvisorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">Strict Scoring Proof</div>
                  <div className="text-[11px] text-slate-500">Enforce deterministic evidence</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStrictScoringMode(!strictScoringMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    strictScoringMode ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      strictScoringMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">Corporate Discovery</div>
                  <div className="text-[11px] text-slate-500">Recruiter candidate browsing</div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicRecruiterDiscovery(!publicRecruiterDiscovery)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    publicRecruiterDiscovery ? 'bg-slate-900' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      publicRecruiterDiscovery ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Administrative Provisioning & Audit Log
                </h3>
                <p className="text-xs text-slate-500">
                  Immutable chronological record of all service assignments, tier upgrades, and tenant lifecycle actions.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 pr-4">Timestamp</th>
                    <th className="py-2.5 px-4">Action</th>
                    <th className="py-2.5 px-4">Target Institute</th>
                    <th className="py-2.5 px-4">Details</th>
                    <th className="py-2.5 pl-4">Operator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {log.targetInstituteName || 'System Platform'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-md">
                        {log.details}
                      </td>
                      <td className="py-3 pl-4 text-slate-500 whitespace-nowrap">
                        {log.performedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isOnboardModalOpen && (
        <OnboardInstituteModal
          isOpen={isOnboardModalOpen}
          onClose={() => setIsOnboardModalOpen(false)}
          onCreated={newInst => {
            refreshData();
          }}
        />
      )}

      {managingInst && (
        <ManageServiceModal
          isOpen={!!managingInst}
          onClose={() => setManagingInst(null)}
          institution={managingInst}
          onUpdated={() => {
            refreshData();
          }}
        />
      )}

      {certificateInst && (
        <LicenseCertificateModal
          isOpen={!!certificateInst}
          onClose={() => setCertificateInst(null)}
          institution={certificateInst}
        />
      )}

      {deepManageInst && (
        <InstitutionDetailModal
          isOpen={!!deepManageInst}
          onClose={() => setDeepManageInst(null)}
          institution={deepManageInst}
          onUpdated={() => {
            refreshData();
          }}
        />
      )}

      {loginModalInst && (
        <InstitutionLoginModal
          isOpen={!!loginModalInst}
          onClose={() => setLoginModalInst(null)}
          institution={loginModalInst}
          onUpdated={() => {
            refreshData();
          }}
        />
      )}
    </div>
  );
};
