import React, { useState, useEffect } from 'react';
import { UserRole, StudentProfile } from './types';
import { portalRepository } from './repositories/mockRepository';
import { Navbar } from './components/layout/Navbar';
import { StudentDashboard } from './components/student/StudentDashboard';
import { SkillAssessmentRunner } from './components/student/SkillAssessmentRunner';
import { SkillProfileView } from './components/student/SkillProfileView';
import { OpportunityDiscovery } from './components/student/OpportunityDiscovery';
import { ApplicationTracker } from './components/student/ApplicationTracker';
import { StudentPortfolioView } from './components/student/StudentPortfolioView';
import { LearningCenter } from './components/student/LearningCenter';
import { AICareerAssistant } from './components/student/AICareerAssistant';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { AcademicianDashboard } from './components/academician/AcademicianDashboard';
import { InstitutionAnalytics } from './components/institution/InstitutionAnalytics';
import { MasterAdminBackend } from './components/admin/MasterAdminBackend';
import { MasterAdminLoginPage } from './components/admin/MasterAdminLoginPage';
import { LandingPage } from './components/landing/LandingPage';
import { ToastContainer } from './components/common/ToastContainer';
import { CommandPalette } from './components/common/CommandPalette';
import { SkillPassportModal } from './components/common/SkillPassportModal';
import { DatabaseSyncModal } from './components/common/DatabaseSyncModal';
import { LiveActivityTicker } from './components/common/LiveActivityTicker';
import { SoundFX } from './lib/soundEffects';
import { toast } from './lib/toast';
import {
  LayoutDashboard,
  Award,
  ShieldCheck,
  Briefcase,
  FileCheck2,
  FolderGit2,
  BookOpen,
  Sparkles,
  Info,
  LogOut
} from 'lucide-react';

const checkIsMasterAdminUrl = (): boolean => {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();
  return (
    path === '/masteradmin' ||
    path === '/masteradmin/' ||
    path.startsWith('/masteradmin') ||
    hash === '#/masteradmin' ||
    hash === '#masteradmin' ||
    hash.startsWith('#/masteradmin') ||
    search.includes('masteradmin')
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('STUDENT');
  const [studentTab, setStudentTab] = useState<string>('dashboard');
  const [student, setStudent] = useState<StudentProfile>(portalRepository.getStudentProfile());

  const [isMasterAdminRoute, setIsMasterAdminRoute] = useState<boolean>(checkIsMasterAdminUrl);
  const [isMasterAdminAuth, setIsMasterAdminAuth] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('ss_master_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Spotlight & Passport & Database Sync Modals
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isDatabaseSyncOpen, setIsDatabaseSyncOpen] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        SoundFX.click();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const unsub = portalRepository.subscribe(() => {
      setStudent(portalRepository.getStudentProfile());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsMasterAdminRoute(checkIsMasterAdminUrl());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToMasterAdmin = () => {
    try {
      window.history.pushState(null, '', '/masteradmin');
    } catch {
      window.location.hash = '/masteradmin';
    }
    setIsMasterAdminRoute(true);
  };

  const handleMasterAdminLoginSuccess = () => {
    try {
      sessionStorage.setItem('ss_master_admin_auth', 'true');
    } catch {}
    setIsMasterAdminAuth(true);
  };

  const exitMasterAdmin = () => {
    try {
      sessionStorage.removeItem('ss_master_admin_auth');
    } catch {}
    setIsMasterAdminAuth(false);
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsMasterAdminRoute(false);
  };

  const handleSelectRoleFromLanding = (role: UserRole) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    const existing = portalRepository.getCurrentUser();
    if (!existing || existing.role !== role) {
      const activeStudent = portalRepository.getStudentProfile();
      portalRepository.authenticateUser({
        name: role === 'STUDENT' ? (activeStudent?.fullName || 'Aarav Sharma') : role === 'INDUSTRY' ? 'CloudScale Recruiter' : role === 'ACADEMICIAN' ? 'Prof. Herva Mehta' : 'Campus Administrator',
        email: role === 'STUDENT' ? (activeStudent?.email || 'aarav.sharma@campus.edu') : 'recruiter@cloudscale.io',
        role
      });
    }
  };

  const handleAuthenticate = (role: UserRole, userDetails?: { name?: string; email?: string; password?: string; organization?: string }) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
    if (userDetails?.email || userDetails?.name) {
      portalRepository.authenticateUser({
        name: userDetails.name,
        email: userDetails.email || (role === 'STUDENT' ? 'aarav.sharma@campus.edu' : 'user@campus.edu'),
        password: userDetails.password,
        role,
        organization: userDetails.organization
      });
    }
  };

  // 1. DIRECT ROUTE: /masteradmin
  if (isMasterAdminRoute) {
    if (!isMasterAdminAuth) {
      return (
        <MasterAdminLoginPage
          onLoginSuccess={handleMasterAdminLoginSuccess}
          onReturnToPortal={exitMasterAdmin}
        />
      );
    }

    // Authenticated Master Admin HQ View
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 antialiased">
        <header className="bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs">
              SS
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm font-display text-white">
                  Skill Safar &bull; Master Operations HQ
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Authenticated: admin
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Direct URL: <span className="text-slate-300 font-semibold">/masteradmin</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                // Switch into campus view to test what partner see
                setIsMasterAdminRoute(false);
                setIsAuthenticated(true);
                setCurrentRole('INSTITUTION_ADMIN');
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs transition-colors"
            >
              <span>View Campus Portal</span>
            </button>

            <button
              onClick={exitMasterAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-200 border border-slate-800 hover:border-rose-900 text-xs font-semibold transition-colors"
              title="Sign out of Master Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <MasterAdminBackend
            onNavigateToInstituteView={instId => {
              portalRepository.setActiveInstitutionId(instId);
              setIsMasterAdminRoute(false);
              setIsAuthenticated(true);
              setCurrentRole('INSTITUTION_ADMIN');
            }}
            onSignOut={exitMasterAdmin}
            onExitToPortal={exitMasterAdmin}
          />
        </main>
      </div>
    );
  }

  // 2. PUBLIC LANDING VIEW
  if (!isAuthenticated) {
    return (
      <LandingPage
        onSelectRole={handleSelectRoleFromLanding}
        onAuthenticate={handleAuthenticate}
        onNavigateToMasterAdmin={navigateToMasterAdmin}
      />
    );
  }

  const studentNavigationTabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assessments', icon: Award },
    { id: 'skills', label: 'Skill Profile', icon: ShieldCheck, badge: `${student.skills.length}` },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileCheck2 },
    { id: 'portfolio', label: 'Portfolio', icon: FolderGit2 },
    { id: 'learning', label: 'Learning Center', icon: BookOpen },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles, highlight: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased">
      {/* Universal Top Navigation & Role Switcher */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={role => {
          SoundFX.click();
          setCurrentRole(role);
        }}
        activeTab={studentTab}
        onTabChange={tab => {
          SoundFX.click();
          setStudentTab(tab);
        }}
        onViewLanding={() => {
          SoundFX.click();
          setIsAuthenticated(false);
        }}
        onSignOut={() => {
          SoundFX.click();
          portalRepository.signOutUser();
          setIsAuthenticated(false);
        }}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
      />

      {/* Dynamic Live Activity Ticker */}
      <LiveActivityTicker />

      {/* Role Banner / Context Header for Student */}
      {currentRole === 'STUDENT' && (
        <div className="bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-3 scrollbar-none">
              {studentNavigationTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = studentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      SoundFX.click();
                      setStudentTab(tab.id);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white font-medium shadow-2xs'
                        : tab.highlight
                        ? 'bg-slate-100 text-slate-900 hover:bg-slate-200 font-medium border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-normal'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Student Views */}
        {currentRole === 'STUDENT' && (
          <>
            {studentTab === 'dashboard' && (
              <StudentDashboard
                student={student}
                onNavigateTab={tab => setStudentTab(tab)}
              />
            )}
            {studentTab === 'assessments' && (
              <SkillAssessmentRunner
                student={student}
                onAssessmentCompleted={() => {
                  setStudent(portalRepository.getStudentProfile());
                }}
              />
            )}
            {studentTab === 'skills' && (
              <SkillProfileView
                student={student}
                onNavigateToLearning={() => setStudentTab('learning')}
                onNavigateToAssessment={() => setStudentTab('assessments')}
              />
            )}
            {studentTab === 'opportunities' && (
              <OpportunityDiscovery
                student={student}
                onNavigateToApplications={() => setStudentTab('applications')}
              />
            )}
            {studentTab === 'applications' && (
              <ApplicationTracker
                studentId={student.id}
                onNavigateToOpportunities={() => setStudentTab('opportunities')}
              />
            )}
            {studentTab === 'portfolio' && (
              <StudentPortfolioView student={student} />
            )}
            {studentTab === 'learning' && (
              <LearningCenter
                student={student}
                onNavigateToAssessment={() => setStudentTab('assessments')}
              />
            )}
            {studentTab === 'ai-advisor' && (
              <AICareerAssistant student={student} />
            )}
          </>
        )}

        {/* Industry View */}
        {currentRole === 'INDUSTRY' && (
          <IndustryDashboard />
        )}

        {/* Academician View */}
        {currentRole === 'ACADEMICIAN' && (
          <AcademicianDashboard />
        )}

        {/* Institution Admin View */}
        {currentRole === 'INSTITUTION_ADMIN' && (
          <InstitutionAnalytics onOpenMasterAdmin={navigateToMasterAdmin} />
        )}

        {/* Master Admin / Internal SaaS Operations Backend */}
        {currentRole === 'SUPER_ADMIN' && (
          <MasterAdminBackend
            onNavigateToInstituteView={instId => {
              portalRepository.setActiveInstitutionId(instId);
              setCurrentRole('INSTITUTION_ADMIN');
            }}
            onSignOut={exitMasterAdmin}
            onExitToPortal={exitMasterAdmin}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Skill Safar</span>
            <span>•</span>
            <span>Deterministic Scoring Engine</span>
            <span>•</span>
            <span>MCP Protocol Layer</span>
          </div>
          <div className="text-slate-400">
            Compliant with Domain Models, Repositories, & Architectural Security Rules
          </div>
        </div>
      </footer>

      {/* Global Animated Toast Feedback Notifications */}
      <ToastContainer />

      {/* Global Command Palette / Spotlight Search (⌘K) */}
      <CommandPalette
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        currentRole={currentRole}
        onSelectRole={role => setCurrentRole(role)}
        onSelectTab={tab => setStudentTab(tab)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenDatabaseSync={() => setIsDatabaseSyncOpen(true)}
      />

      {/* Verifiable Skill Passport Modal */}
      <SkillPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        student={student}
      />

      {/* Cloud Database & External Database Sync Center */}
      <DatabaseSyncModal
        isOpen={isDatabaseSyncOpen}
        onClose={() => setIsDatabaseSyncOpen(false)}
      />
    </div>
  );
}
