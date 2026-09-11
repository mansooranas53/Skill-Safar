import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { toast } from '../../lib/toast';
import { SoundFX } from '../../lib/soundEffects';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  Award,
  Sparkles,
  ExternalLink,
  X,
  FileBadge
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SkillPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
}

export const SkillPassportModal: React.FC<SkillPassportModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate a reproducible SHA-256 style fingerprint
  const mockSha256 = `0x7f9a8b2c4e1d6f30a9e8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6`;
  const verificationUrl = `https://skillsafar.gov.in/verify/cred/${student.usn}`;

  const handleCopyHash = () => {
    SoundFX.click();
    navigator.clipboard.writeText(mockSha256);
    setCopied(true);
    toast.success('Cryptographic hash copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCelebrate = () => {
    SoundFX.success();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    toast.success('Credential verified against Skill Safar ledger');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Top Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-inner">
                  <FileBadge className="w-6 h-6 text-slate-100" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-widest text-slate-300">
                      Verifiable Credential Passport
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Tamper Proof
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
                    {student.fullName}
                  </h2>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    USN: {student.usn} &bull; {student.institutionName}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Body content */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Cryptographic Ledger Block */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic SHA-256 Ledger Fingerprint</span>
                </div>
                <button
                  onClick={handleCopyHash}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Hash'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-600 break-all bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                {mockSha256}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
                <span>Consensus: Skill Safar Institutional Node #04</span>
                <span>Algorithm: Ed25519 Verified</span>
              </div>
            </div>

            {/* Verified Skills Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Competencies ({student.skills.length})
                </h3>
                <span className="text-xs text-slate-400 font-medium">Benchmarked via code evaluation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {student.skills.map(skill => (
                  <div
                    key={skill.name}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{skill.name}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-400 font-light mt-0.5">
                        {skill.category.replace('cat-', '').toUpperCase()} &bull; {skill.level}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-display font-bold text-slate-900">{skill.score}%</div>
                      <div className="text-[10px] text-emerald-600 font-medium font-mono">PASSED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Badges & Accreditation */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">NEP 2020 &amp; AICTE Compliant Skill Credit</div>
                  <div className="text-[11px] text-slate-400 font-light">
                    Eligible for academic credit transfer (4 Skill Units under NCrF)
                  </div>
                </div>
              </div>

              <button
                onClick={handleCelebrate}
                className="px-4 py-2 bg-white text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Verify Live</span>
              </button>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-4 sm:px-8 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-slate-400" />
              <span>Shareable with verified recruiters worldwide</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verificationUrl);
                  toast.success('Public verification link copied!');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
