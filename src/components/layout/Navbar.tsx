import React, { useState, useEffect, useRef } from 'react';
import { UserRole, PlatformNotification, StudentProfile, PortalUserAccount } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { SoundFX } from '../../lib/soundEffects';
import {
  GraduationCap,
  Building2,
  BookOpen,
  School,
  Bell,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Globe,
  LogOut,
  ShieldCheck,
  Search,
  QrCode,
  Database
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onViewLanding?: () => void;
  onSignOut?: () => void;
  onOpenSpotlight?: () => void;
  onOpenPassport?: () => void;
  onOpenDatabaseSync?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onViewLanding,
  onSignOut,
  onOpenSpotlight,
  onOpenPassport,
  onOpenDatabaseSync
}) => {
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);
  const [student, setStudent] = useState<StudentProfile>(() => portalRepository.getStudentProfile());
  const [currentUser, setCurrentUser] = useState<PortalUserAccount | null>(() => portalRepository.getCurrentUser());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(portalRepository.getNotifications());
    setStudent(portalRepository.getStudentProfile());
    setCurrentUser(portalRepository.getCurrentUser());
    const unsub = portalRepository.subscribe(() => {
      setNotifications(portalRepository.getNotifications());
      setStudent(portalRepository.getStudentProfile());
      setCurrentUser(portalRepository.getCurrentUser());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const studentPersona = student?.fullName
    ? `${student.fullName} (${student.branch ? (student.branch.includes('CS') || student.branch.includes('Computer') ? 'B.Tech CS' : student.branch) : 'B.Tech CS'}, ${student.graduationYear || 2026})`
    : 'Student Portal';

  const industryPersona = currentUser?.role === 'INDUSTRY' && currentUser.name
    ? `${currentUser.organization || 'CloudScale Tech'} (${currentUser.name})`
    : 'CloudScale Tech (Recruiter)';

  const academicianPersona = currentUser?.role === 'ACADEMICIAN' && currentUser.name
    ? `${currentUser.name} (${currentUser.organization || 'Prof. CS'})`
    : 'Prof. Herva Mehta (Prof. CS)';

  const institutionPersona = currentUser?.role === 'INSTITUTION_ADMIN' && currentUser.name
    ? `${currentUser.organization || 'ITS Bangalore'} (${currentUser.name})`
    : 'ITS Bangalore (Dean Analytics)';

  const roleConfigs: Record<UserRole, { label: string; icon: React.ComponentType<{ className?: string }>; persona: string; color: string }> = {
    STUDENT: {
      label: 'Student Portal',
      icon: GraduationCap,
      persona: studentPersona,
      color: 'bg-slate-100 text-slate-900 border-slate-200'
    },
    INDUSTRY: {
      label: 'Industry Portal',
      icon: Building2,
      persona: industryPersona,
      color: 'bg-slate-100 text-slate-900 border-slate-200'
    },
    ACADEMICIAN: {
      label: 'Academician Portal',
      icon: BookOpen,
      persona: academicianPersona,
      color: 'bg-slate-100 text-slate-900 border-slate-200'
    },
    INSTITUTION_ADMIN: {
      label: 'Institution Admin',
      icon: School,
      persona: institutionPersona,
      color: 'bg-slate-100 text-slate-900 border-slate-200'
    },
    SUPER_ADMIN: {
      label: 'Master Admin (HQ Backend)',
      icon: ShieldCheck,
      persona: 'Skill Safar Ops & Sales Team',
      color: 'bg-slate-900 text-white border-slate-900'
    }
  };

  const currentRoleInfo = roleConfigs[currentRole];
  const CurrentIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Ecosystem Label */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg tracking-tight text-slate-900">
                  Skill Safar
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-100 rounded-md">
                  Unified Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block font-light">
                Bridging academic competency with verified industry opportunity
              </p>
            </div>
          </div>

          {/* Right Controls: Role Switcher, Notifications, Reset */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Role Switcher dropdown */}
            <div className="relative" ref={roleRef}>
              <button
                type="button"
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${currentRoleInfo.color} hover:brightness-95`}
              >
                <CurrentIcon className="w-4 h-4 shrink-0" />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold leading-tight">{currentRoleInfo.label}</div>
                  <div className="text-[10px] opacity-75">{currentRoleInfo.persona}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch User Role
                  </div>
                  {(currentRole === 'SUPER_ADMIN'
                    ? (['SUPER_ADMIN', 'STUDENT', 'INDUSTRY', 'ACADEMICIAN', 'INSTITUTION_ADMIN'] as UserRole[])
                    : (['STUDENT', 'INDUSTRY', 'ACADEMICIAN', 'INSTITUTION_ADMIN'] as UserRole[])
                  ).map(role => {
                    const info = roleConfigs[role];
                    const Icon = info.icon;
                    const isActive = currentRole === role;
                    return (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleChange(role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center gap-3 transition-colors hover:bg-slate-50 ${
                          isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${info.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold">{info.label}</div>
                          <div className="text-[11px] text-slate-500 truncate">{info.persona}</div>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-slate-900 shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    {onViewLanding && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onViewLanding();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        <Globe className="w-4 h-4 text-slate-700" />
                        <span>Public Landing Page</span>
                      </button>
                    )}
                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out (Return to Guest View)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Spotlight / Command Palette trigger */}
            {onOpenSpotlight && (
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onOpenSpotlight();
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
                title="Search or Quick Navigation (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden lg:inline">Spotlight</span>
                <kbd className="px-1.5 py-0.2 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Cloud Database Sync Center trigger - internal master admin usage only */}
            {onOpenDatabaseSync && currentRole === 'SUPER_ADMIN' && (
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onOpenDatabaseSync();
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors"
                title="Database & Cloud Sync Center (Internal Master Admin Usage)"
              >
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline font-mono text-[11px]">Cloud DB</span>
              </button>
            )}

            {/* Quick Digital Passport modal button (Student role only) */}
            {currentRole === 'STUDENT' && onOpenPassport && (
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onOpenPassport();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 shadow-2xs transition-all"
                title="View Cryptographically Verified Skill Passport"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                <span>Skill Passport</span>
              </button>
            )}

            {/* Quick Landing Page link on desktop */}
            {onViewLanding && (
              <button
                type="button"
                onClick={onViewLanding}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
                title="View Public Landing Page"
              >
                <Globe className="w-3.5 h-3.5 text-slate-700" />
                <span>Landing</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-slate-900 text-white rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Notifications ({unreadCount} unread)
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => portalRepository.markAllNotificationsAsRead()}
                        className="text-xs text-slate-900 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            portalRepository.markNotificationAsRead(n.id);
                            if (n.actionUrl) {
                              onTabChange(n.actionUrl);
                            }
                            setIsNotifOpen(false);
                          }}
                          className={`p-3.5 text-left cursor-pointer hover:bg-slate-50 transition-colors ${
                            !n.read ? 'bg-slate-100/70' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-slate-900 leading-snug">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-slate-900 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Seed Data Button - only visible in SUPER_ADMIN mode */}
            {currentRole === 'SUPER_ADMIN' && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset portal demo data to fresh default seed?')) {
                    portalRepository.resetToDefaults();
                  }
                }}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                title="Reset sample data (Admin Only)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
