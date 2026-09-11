import React, { useState } from 'react';
import { UserRole } from '../../types';
import { AuthModal } from './AuthModal';
import { CommandPalette } from '../common/CommandPalette';
import { SoundFX } from '../../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Building2,
  BookOpen,
  School,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  Compass,
  Lock,
  Terminal,
  Play,
  CheckCircle2,
  QrCode,
  Search,
  Check,
  Volume2,
  VolumeX,
  Copy
} from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
  onAuthenticate: (role: UserRole, userDetails?: { name: string; email: string }) => void;
  onNavigateToMasterAdmin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onAuthenticate,
  onNavigateToMasterAdmin
}) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>('STUDENT');
  const [simulatedGapBridged, setSimulatedGapBridged] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(SoundFX.isEnabled());

  // Interactive Showcase State
  const [showcaseTab, setShowcaseTab] = useState<'match' | 'terminal' | 'credential'>('match');
  const [isTerminalRunning, setIsTerminalRunning] = useState(false);
  const [terminalCompleted, setTerminalCompleted] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ python -m pytest tests/test_distributed_backend.py -v',
    '============================= test session starts =============================',
    'platform linux -- Python 3.12.2, pytest-8.1.1, pluggy-1.4.0',
    'rootdir: /workspace/student-submission/aanal_nathvani',
    'collected 3 items',
    '',
    'tests/test_backend.py::test_connection_pool_scale PASSED              [ 33%]',
    'tests/test_backend.py::test_idempotent_task_dispatch PASSED           [ 66%]',
    'tests/test_backend.py::test_failover_recovery_latency PASSED          [100%]',
    '',
    '============================== 3 passed in 0.42s ==============================',
    '✓ Deterministic Execution Verified. SHA-256: 0x7f9a8b2c4e1d6f30a9e8b7c6d5e4'
  ]);

  const openAuth = (mode: 'signin' | 'signup', role: UserRole = 'STUDENT') => {
    SoundFX.click();
    setAuthMode(mode);
    setAuthInitialRole(role);
    setIsAuthOpen(true);
  };

  const handleSimulateGap = () => {
    if (!simulatedGapBridged) {
      SoundFX.success();
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
      setSimulatedGapBridged(true);
    } else {
      SoundFX.click();
      setSimulatedGapBridged(false);
    }
  };

  const handleRunTerminal = () => {
    SoundFX.click();
    setIsTerminalRunning(true);
    setTerminalCompleted(false);
    setTerminalLogs(['$ python -m pytest tests/test_distributed_backend.py -v', 'Booting sandbox container...']);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        'Running 3 deterministic test suites with strict CPU limit...',
        'tests/test_backend.py::test_connection_pool_scale PASSED              [ 33%]'
      ]);
    }, 450);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        'tests/test_backend.py::test_idempotent_task_dispatch PASSED           [ 66%]',
        'tests/test_backend.py::test_failover_recovery_latency PASSED          [100%]'
      ]);
    }, 900);

    setTimeout(() => {
      setIsTerminalRunning(false);
      setTerminalCompleted(true);
      setTerminalLogs(prev => [
        ...prev,
        '============================== 3 passed in 0.38s ==============================',
        '✓ Deterministic Execution Verified. Ledger hash: 0x7f9a8b2c4e1d6f30a9e8b7c6d5e4'
      ]);
      SoundFX.success();
      confetti({
        particleCount: 75,
        spread: 55,
        origin: { y: 0.65 }
      });
    }, 1300);
  };

  const steps = [
    {
      num: '01',
      title: 'Assess Skills',
      subtitle: 'Objective Verification',
      desc: 'Take hands-on, practical assessments. Code runs and evidence are verified on a tamper-proof ledger.'
    },
    {
      num: '02',
      title: 'Spot the Gaps',
      subtitle: 'Market Demand',
      desc: 'Algorithms benchmark your verified abilities directly against what real tech employers are hiring for.'
    },
    {
      num: '03',
      title: 'Targeted Upskilling',
      subtitle: 'Curated Modules',
      desc: 'Close missing competencies with precision learning tracks instead of generic, overwhelming courses.'
    },
    {
      num: '04',
      title: 'Direct Placement',
      subtitle: 'Explainable Matching',
      desc: 'Get matched to verified internships and opportunities with 100% transparent criteria.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5 text-slate-200" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-slate-900">
                  Skill Safar
                </span>
                <span className="ml-2.5 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-l border-slate-200 pl-2.5 hidden sm:inline-block">
                  Academia &bull; Industry
                </span>
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
                How It Works
              </a>
              <a href="#portals" className="hover:text-slate-900 transition-colors">
                Ecosystem
              </a>
              <a href="#simulator" className="hover:text-slate-900 transition-colors">
                Interactive Engine
              </a>
            </nav>

            {/* Quick Actions & Spotlight Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  setIsSpotlightOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
                title="Open Spotlight Search (⌘K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.2 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-500">
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={() => {
                  const enabled = SoundFX.toggle();
                  setSoundEnabled(enabled);
                }}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                title={soundEnabled ? 'UI Sound Effects On (Click to Mute)' : 'UI Sound Effects Muted (Click to Enable)'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                type="button"
                onClick={() => openAuth('signin')}
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-xl transition-colors"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onSelectRole('STUDENT');
                }}
                className="px-4 sm:px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2"
              >
                <span>Launch Demo</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-radial from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold tracking-wide mb-6 border border-slate-200/60">
              <Sparkles className="w-3.5 h-3.5 text-slate-700" />
              <span>Skill Verification &bull; Explainable Matching &bull; Joint R&amp;D</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              The verifiable path from <br className="hidden sm:block" />
              <span className="font-editorial italic font-normal text-slate-800">campus learning</span> to{' '}
              <span className="text-slate-900">industry leadership</span>
            </h1>

            {/* Clean Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto">
              Skill Safar connects students, tech recruiters, faculty researchers, and university leaders through continuous skill proof, transparent matching, and co-funded R&amp;D.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onSelectRole('STUDENT');
                }}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-2.5"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Enter as Student (Aanal)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onSelectRole('INDUSTRY');
                }}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-sm font-semibold shadow-2xs hover:border-slate-400 transition-all flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>Hire Talent (CloudScale)</span>
              </button>
            </div>

            {/* Quick role links */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
              <span>Or explore other roles:</span>
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onSelectRole('ACADEMICIAN');
                }}
                className="text-slate-700 hover:text-slate-950 underline underline-offset-4"
              >
                Faculty Portal
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => {
                  SoundFX.click();
                  onSelectRole('INSTITUTION_ADMIN');
                }}
                className="text-slate-700 hover:text-slate-950 underline underline-offset-4"
              >
                Campus Analytics
              </button>
            </div>
          </div>

          {/* Interactive Multi-Tab Showcase Sandbox */}
          <div id="simulator" className="mt-16 max-w-4xl mx-auto">
            {/* Tab switch bar */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setShowcaseTab('match');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    showcaseTab === 'match'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Explainable Match Fit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setShowcaseTab('terminal');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    showcaseTab === 'terminal'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Code Sandbox &amp; Ledger</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    SoundFX.click();
                    setShowcaseTab('credential');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                    showcaseTab === 'credential'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verifiable Credential</span>
                </button>
              </div>
            </div>

            {/* Card Content Based on Selected Tab */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden">
              {showcaseTab === 'match' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        <Cpu className="w-4 h-4 text-slate-700" />
                        Live Transparent Match Engine
                      </div>
                      <h2 className="text-xl font-display font-bold text-slate-900">
                        Aanal Nathvani &times; CloudScale Technologies
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Distributed Systems Backend Intern &bull; Bangalore
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-200">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Overall Match Fit
                        </div>
                        <div className="text-3xl font-display font-black text-slate-900 transition-all">
                          {simulatedGapBridged ? '98%' : '91%'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown pill row */}
                  <div className="py-6 border-b border-slate-100 grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500">Skills (60%)</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">
                        {simulatedGapBridged ? '58 / 60' : '52 / 60'}
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500">Academic Fit (20%)</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">20 / 20</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500">Preferences (20%)</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">20 / 20</div>
                    </div>
                  </div>

                  {/* Interactive trigger */}
                  <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">Verified:</span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                        Python (85%)
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
                        SQL (82%)
                      </span>
                      {simulatedGapBridged ? (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold">
                          ✓ Docker &amp; Containers (+7%)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
                          Gap: Docker
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateGap}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                        simulatedGapBridged
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{simulatedGapBridged ? 'Reset Simulator' : 'Simulate Closing Docker Gap (98%)'}</span>
                    </button>
                  </div>
                </div>
              )}

              {showcaseTab === 'terminal' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Deterministic Code Test Runner
                      </div>
                      <h3 className="text-lg font-display font-bold text-slate-900 mt-0.5">
                        Sandboxed pytest verification
                      </h3>
                    </div>

                    <button
                      type="button"
                      disabled={isTerminalRunning}
                      onClick={handleRunTerminal}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isTerminalRunning ? 'Executing Test Suite...' : 'Re-run Test Suite'}</span>
                    </button>
                  </div>

                  {/* Terminal Window */}
                  <div className="bg-slate-950 rounded-2xl p-4 sm:p-5 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span>sandbox@skill-safar-runtime: ~/runner</span>
                    </div>

                    <div className="space-y-1 leading-relaxed">
                      {terminalLogs.map((line, idx) => (
                        <div
                          key={idx}
                          className={
                            line.includes('PASSED')
                              ? 'text-emerald-400'
                              : line.includes('✓')
                              ? 'text-emerald-300 font-bold'
                              : line.startsWith('$')
                              ? 'text-slate-300'
                              : 'text-slate-400'
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {showcaseTab === 'credential' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        Tamper-Proof Ledger Proof
                      </div>
                      <h3 className="text-xl font-display font-bold text-slate-900">
                        Aanal Nathvani &bull; Verified B.Tech CS Docket
                      </h3>
                      <p className="text-xs text-slate-500">
                        Cryptographically signed by ITS Bangalore &amp; Skill Safar Root Key
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid on Chain</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-medium text-slate-500">USN ID</div>
                      <div className="font-mono text-xs font-bold text-slate-900 mt-1">1ITS22CS014</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-medium text-slate-500">Verified Units</div>
                      <div className="text-xs font-bold text-slate-900 mt-1">4 Skills &bull; NCrF Aligned</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="text-[11px] font-medium text-slate-500">Consensus Node</div>
                      <div className="text-xs font-bold text-slate-900 mt-1">ITS Bangalore #04</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-slate-400">Deterministic SHA-256 Ledger Stamp</div>
                      <div className="font-mono text-xs text-emerald-400 truncate mt-0.5 select-all">
                        0x7f9a8b2c4e1d6f30a9e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        SoundFX.click();
                        navigator.clipboard.writeText('0x7f9a8b2c4e1d6f30a9e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6');
                        confetti({ particleCount: 50, spread: 45, origin: { y: 0.6 } });
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 border border-slate-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Proof</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Portals (Clean & Clear) */}
      <section id="portals" className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Unified Stakeholder Ecosystem
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Designed for every partner in the journey
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Clear, dedicated workspaces tailored to each role with real-time synchronized data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 border border-slate-200">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  Students &amp; Graduates
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                  Benchmark your capabilities with micro-assessments, pinpoint the exact skills employers demand, and apply with verifiable proof.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('STUDENT')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Industry Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 border border-slate-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  Industry &amp; Recruiters
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                  Cut through resume noise. Hire candidates ranked objectively by verified code proof and manage candidates across hiring stages.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('INDUSTRY')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Industry Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Academician Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 border border-slate-200">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  Faculty &amp; Researchers
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                  Partner with tech enterprises on applied research grants, 6-week faculty immersion sabbaticals, and faculty development programs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('ACADEMICIAN')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Faculty Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Institution Admin Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6 border border-slate-200">
                  <School className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                  Campus Leadership &amp; Analytics
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6 font-light">
                  Track departmental placement readiness, monitor skill trends, and generate evidence-based reports for accreditation (NIRF &amp; NAAC).
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectRole('INSTITUTION_ADMIN')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Campus Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (Simple 4 Steps) */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              The Skill Safar Journey
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Four simple steps to verified placement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(step => (
              <div key={step.num} className="space-y-3">
                <span className="font-display text-4xl font-extrabold text-slate-300 block">
                  {step.num}
                </span>
                <h3 className="text-lg font-display font-bold text-slate-900">
                  {step.title}
                </h3>
                <div className="text-xs font-semibold text-slate-700">
                  {step.subtitle}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Impact Bar */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-extrabold text-white">95%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Placement Retention</div>
            </div>
            <div>
              <div className="text-4xl font-display font-extrabold text-white">3.2&times;</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Hiring Velocity</div>
            </div>
            <div>
              <div className="text-4xl font-display font-extrabold text-white">18+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Domain Taxonomies</div>
            </div>
            <div>
              <div className="text-4xl font-display font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Transparent Matching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-white text-center border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-slate-900">
            Ready to explore Skill Safar?
          </h2>
          <p className="mt-3 text-slate-600 font-light text-base">
            Test the live platform instantly with pre-loaded profiles or sign in to your workspace.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onSelectRole('STUDENT')}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <span>Explore Live Platform</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => openAuth('signin')}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="bg-slate-50 border-t border-slate-200/80 py-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-slate-900 text-sm">
            <Compass className="w-4 h-4 text-slate-800" />
            <span>Skill Safar</span>
            <span className="font-normal text-slate-400 text-xs ml-2">
              &copy; 2026 Skill Safar. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 font-medium flex-wrap">
            <span>NEP 2020 Aligned</span>
            <span>AICTE Guideline Compliant</span>
            <span>Deterministic Scoring</span>
            <span className="text-slate-300">|</span>
            <a
              href="/masteradmin"
              onClick={e => {
                e.preventDefault();
                if (onNavigateToMasterAdmin) {
                  onNavigateToMasterAdmin();
                } else {
                  window.history.pushState(null, '', '/masteradmin');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }
              }}
              className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 font-mono text-[11px]"
              title="Dedicated Operations Portal"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span>/masteradmin</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        initialRole={authInitialRole}
        onAuthenticate={(role, userDetails) => {
          onAuthenticate(role, userDetails);
          setIsAuthOpen(false);
        }}
      />

      {/* Global Command Palette / Spotlight */}
      <CommandPalette
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        currentRole="STUDENT"
        onSelectRole={onSelectRole}
      />
    </div>
  );
};
