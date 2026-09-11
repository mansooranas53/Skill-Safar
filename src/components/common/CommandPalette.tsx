import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import { toast } from '../../lib/toast';
import { SoundFX } from '../../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  Search,
  LayoutDashboard,
  Award,
  ShieldCheck,
  Briefcase,
  FileCheck2,
  FolderGit2,
  BookOpen,
  Sparkles,
  Building2,
  GraduationCap,
  School,
  Lock,
  Zap,
  Volume2,
  VolumeX,
  Share2,
  ArrowRight,
  Database,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onNavigateTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  onOpenPassport?: () => void;
  onOpenDatabaseSync?: () => void;
  onNavigateToMasterAdmin?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Roles' | 'Quick Actions' | 'Opportunities';
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onNavigateTab,
  onSelectTab,
  onOpenPassport,
  onOpenDatabaseSync,
  onNavigateToMasterAdmin
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigateTo = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    else if (onNavigateTab) onNavigateTab(tab);
  };

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      SoundFX.pop();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: CommandItem[] = [
    // Tabs
    {
      id: 'tab-dashboard',
      title: 'Student Dashboard & Readiness',
      subtitle: 'Overview of verified skills, metrics & loop progress',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('dashboard');
        onClose();
        toast.info('Navigated to Dashboard');
      }
    },
    {
      id: 'tab-assessments',
      title: 'Take Skill Assessment',
      subtitle: 'Deterministic testing with instant code execution',
      category: 'Navigation',
      icon: Award,
      badge: 'Hot',
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('assessments');
        onClose();
        toast.info('Opened Skill Assessments');
      }
    },
    {
      id: 'tab-skills',
      title: 'Skill Matrix & Radar Profile',
      subtitle: 'Multi-dimensional taxonomy & gap analysis',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('skills');
        onClose();
      }
    },
    {
      id: 'tab-opportunities',
      title: 'Browse Industry Opportunities',
      subtitle: 'Direct matching for backend, cloud & AI roles',
      category: 'Navigation',
      icon: Briefcase,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('opportunities');
        onClose();
      }
    },
    {
      id: 'tab-applications',
      title: 'Application Pipeline Tracker',
      subtitle: 'View status across shortlisted and interview stages',
      category: 'Navigation',
      icon: FileCheck2,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('applications');
        onClose();
      }
    },
    {
      id: 'tab-portfolio',
      title: 'Verified Student Portfolio',
      subtitle: 'Git repos, live deployments, and credentials',
      category: 'Navigation',
      icon: FolderGit2,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('portfolio');
        onClose();
      }
    },
    {
      id: 'tab-learning',
      title: 'Curated Upskilling Modules',
      subtitle: 'Close identified skill gaps with targeted tracks',
      category: 'Navigation',
      icon: BookOpen,
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('learning');
        onClose();
      }
    },
    {
      id: 'tab-ai',
      title: 'AI Career Advisor & Interview Prep',
      subtitle: 'Ask about career trajectories & simulated questions',
      category: 'Navigation',
      icon: Sparkles,
      badge: 'AI',
      action: () => {
        onSelectRole('STUDENT');
        onNavigateTab('ai-advisor');
        onClose();
      }
    },

    // Roles
    {
      id: 'role-student',
      title: `Switch to Student (${portalRepository.getStudentProfile()?.fullName || 'Student'})`,
      subtitle: 'B.Tech CS • ITS Bangalore',
      category: 'Roles',
      icon: GraduationCap,
      action: () => {
        onSelectRole('STUDENT');
        onClose();
        toast.success('Switched to Student Portal');
      }
    },
    {
      id: 'role-industry',
      title: 'Switch to Industry (CloudScale Tech)',
      subtitle: 'Recruiter & Hiring Lead Dashboard',
      category: 'Roles',
      icon: Building2,
      action: () => {
        onSelectRole('INDUSTRY');
        onClose();
        toast.success('Switched to Industry Portal');
      }
    },
    {
      id: 'role-academician',
      title: 'Switch to Faculty (Prof. Herva Mehta)',
      subtitle: 'Research grants, capstones & sabbaticals',
      category: 'Roles',
      icon: BookOpen,
      action: () => {
        onSelectRole('ACADEMICIAN');
        onClose();
        toast.success('Switched to Faculty Portal');
      }
    },
    {
      id: 'role-institution',
      title: 'Switch to Campus Admin (ITS Bangalore)',
      subtitle: 'Dean Analytics, NIRF reporting & rosters',
      category: 'Roles',
      icon: School,
      action: () => {
        onSelectRole('INSTITUTION_ADMIN');
        onClose();
        toast.success('Switched to Campus Analytics');
      }
    },
    {
      id: 'role-master-admin',
      title: 'Master Operations Backend (/masteradmin)',
      subtitle: 'Central provisioning, tier billing & student records',
      category: 'Roles',
      icon: Lock,
      action: () => {
        if (onNavigateToMasterAdmin) {
          onNavigateToMasterAdmin();
        } else {
          window.location.hash = '/masteradmin';
        }
        onClose();
      }
    },

    // Quick Actions
    {
      id: 'act-database-sync',
      title: 'Database & Cloud Sync Center',
      subtitle: 'Google Cloud Firestore synchronization, external JSON export & backup',
      category: 'Quick Actions',
      icon: Database,
      badge: 'Cloud DB',
      action: () => {
        onClose();
        if (onOpenDatabaseSync) onOpenDatabaseSync();
      }
    },
    {
      id: 'act-passport',
      title: 'Show Verifiable Skill Credential Passport',
      subtitle: 'View cryptographic proof stamp & digital certificate',
      category: 'Quick Actions',
      icon: ShieldCheck,
      badge: 'Proof',
      action: () => {
        onClose();
        if (onOpenPassport) onOpenPassport();
      }
    },
    {
      id: 'act-confetti',
      title: 'Celebrate Milestone (Trigger Confetti)',
      subtitle: 'Visual celebration blast',
      category: 'Quick Actions',
      icon: Sparkles,
      action: () => {
        onClose();
        SoundFX.success();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        toast.success('🎉 Milestone celebrated!');
      }
    },
    {
      id: 'act-toggle-sound',
      title: SoundFX.isEnabled() ? 'Mute UI Sound Feedback' : 'Enable Tactile UI Sound Effects',
      subtitle: 'Synthesized Web Audio clicks and chimes',
      category: 'Quick Actions',
      icon: SoundFX.isEnabled() ? VolumeX : Volume2,
      action: () => {
        const enabled = SoundFX.toggle();
        toast.info(enabled ? '🔊 UI Sound Effects Enabled' : '🔇 UI Sound Effects Muted');
      }
    },
    {
      id: 'act-share',
      title: 'Copy Skill Verification Share Link',
      subtitle: 'Direct URL to candidate proof docket',
      category: 'Quick Actions',
      icon: Share2,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Verification link copied to clipboard!');
        onClose();
      }
    }
  ];

  const filtered = items.filter(
    item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase())) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        SoundFX.click();
        filtered[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
          />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command, page, role, or action..."
                className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                <span>ESC</span>
              </div>
            </div>

            {/* Results list */}
            <div className="max-h-96 overflow-y-auto p-2.5 divide-y divide-slate-100 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium text-slate-600">No commands found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching for "assessment", "recruiter", or "passport"</p>
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        SoundFX.click();
                        item.action();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'bg-slate-800 text-white border-slate-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs sm:text-sm truncate">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  isSelected
                                    ? 'bg-slate-800 text-slate-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <div
                              className={`text-[11px] truncate mt-0.5 font-light ${
                                isSelected ? 'text-slate-300' : 'text-slate-400'
                              }`}
                            >
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'text-slate-400 bg-slate-800' : 'text-slate-400 bg-slate-50'
                          }`}
                        >
                          {item.category}
                        </span>
                        {isSelected && <ArrowRight className="w-4 h-4 text-slate-300" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                    ↑↓
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-600">
                    ↵
                  </kbd>{' '}
                  Select
                </span>
              </div>
              <span className="text-slate-500 font-display">Skill Safar Spotlight</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
