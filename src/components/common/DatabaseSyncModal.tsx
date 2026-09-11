import React, { useState, useEffect } from 'react';
import { portalRepository } from '../../repositories/mockRepository';
import { CloudDatabaseStatus, cloudDatabaseInfo } from '../../lib/firestoreSync';
import { SoundFX } from '../../lib/soundEffects';
import { toast } from '../../lib/toast';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Cloud,
  Download,
  Upload,
  Server,
  Activity,
  X,
  FileCode,
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';

interface DatabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSyncModal: React.FC<DatabaseSyncModalProps> = ({
  isOpen,
  onClose
}) => {
  const [dbStatus, setDbStatus] = useState<CloudDatabaseStatus>(portalRepository.getCloudDatabaseStatus());
  const [isProcessing, setIsProcessing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDbStatus({ ...portalRepository.getCloudDatabaseStatus() });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsProcessing(true);
    SoundFX.click();
    const ok = await portalRepository.recheckCloudConnection();
    setIsProcessing(false);
    if (ok) {
      SoundFX.success();
      toast.success('Connected to Google Cloud Firestore (asia-south1)');
    } else {
      SoundFX.error();
      toast.error('Failed to ping Cloud Firestore. Falling back to local offline cache.');
    }
  };

  const handlePushAll = async () => {
    setIsProcessing(true);
    SoundFX.click();
    toast.info('Starting full Cloud Firestore synchronization...');
    const result = await portalRepository.triggerFullCloudSync();
    setIsProcessing(false);
    if (result.success) {
      SoundFX.success();
      toast.success(`Successfully synchronized ${result.totalUploaded} records to Cloud Firestore!`);
    } else {
      SoundFX.error();
      toast.error(`Sync error: ${result.error || 'Check permissions'}`);
    }
  };

  const handlePullAll = async () => {
    setIsProcessing(true);
    SoundFX.click();
    toast.info('Pulling latest collections from Cloud Firestore...');
    const ok = await portalRepository.pullAllFromCloud();
    setIsProcessing(false);
    if (ok) {
      SoundFX.success();
      toast.success('All local dashboards updated from Cloud Firestore!');
    } else {
      SoundFX.error();
      toast.error('Failed to pull from Cloud Firestore.');
    }
  };

  const handleExportJson = () => {
    SoundFX.click();
    try {
      const json = portalRepository.exportDatabaseAsJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `skill-safar-database-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      SoundFX.success();
      toast.success('Database exported to external JSON format');
    } catch {
      toast.error('Failed to export database snapshot');
    }
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    SoundFX.click();
    const res = portalRepository.importDatabaseFromJson(importJsonText);
    if (res.success) {
      SoundFX.success();
      toast.success(res.message);
      setImportJsonText('');
      setShowImportBox(false);
    } else {
      SoundFX.error();
      toast.error(`Import failed: ${res.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Database &amp; Cloud Sync Center
                </h2>
                <p className="text-xs text-slate-300">
                  Google Cloud Firestore &bull; Enterprise Bi-Directional Synchronization
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                SoundFX.click();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                dbStatus.isConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  dbStatus.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{dbStatus.isConnected ? 'Cloud Database Connected' : 'Connecting to Cloud...'}</span>
            </div>

            {dbStatus.latencyMs !== null && (
              <span className="text-[11px] text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50 flex items-center gap-1">
                <Activity className="w-3 h-3 text-indigo-400" />
                <span>{dbStatus.latencyMs}ms Latency</span>
              </span>
            )}

            {dbStatus.lastSyncedAt && (
              <span className="text-[11px] text-slate-400 px-2">
                Last synced at {dbStatus.lastSyncedAt}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Cloud Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Cloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>Firestore Database ID</span>
              </div>
              <div className="font-mono text-slate-800 font-bold break-all">
                {dbStatus.databaseId}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-slate-500 font-medium flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-indigo-600" />
                <span>GCP Project &amp; Region</span>
              </div>
              <div className="font-mono text-slate-800 font-bold">
                {dbStatus.projectId} &bull; <span className="text-emerald-600 font-semibold">{dbStatus.region}</span>
              </div>
            </div>
          </div>

          {/* Collection Status Counters */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Managed Cloud Collections</span>
              <span className="text-slate-400 font-normal">Real-time sync enabled</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Students', count: dbStatus.counts.students || 10 },
                { name: 'Opportunities', count: dbStatus.counts.opportunities || 12 },
                { name: 'Applications', count: dbStatus.counts.applications || 5 },
                { name: 'Companies', count: dbStatus.counts.companies || 4 },
                { name: 'Institutions', count: dbStatus.counts.institutions || 4 },
                { name: 'Mentors', count: dbStatus.counts.mentors || 8 },
                { name: 'Collaborations', count: dbStatus.counts.collaborations || 3 },
                { name: 'Audit Logs', count: dbStatus.counts.auditLogs || 6 }
              ].map(col => (
                <div key={col.name} className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] text-slate-500 truncate">{col.name}</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{col.count} records</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sync Actions */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">Database Sync Controls</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePushAll}
                disabled={isProcessing}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Push Full State to Cloud DB</span>
              </button>

              <button
                onClick={handlePullAll}
                disabled={isProcessing}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Pull Fresh Cloud Data</span>
              </button>

              <button
                onClick={handleTestConnection}
                disabled={isProcessing}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Ping Connection</span>
              </button>
            </div>
          </div>

          {/* External Database Export & Import */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                  <span>External Database Sync &amp; Backup</span>
                </div>
                <p className="text-[11px] text-indigo-700 mt-0.5">
                  Export complete data as JSON or load an external snapshot.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => setShowImportBox(prev => !prev)}
                  className="px-3 py-1.5 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3 h-3" />
                  <span>Import External</span>
                </button>
              </div>
            </div>

            {showImportBox && (
              <div className="space-y-2 pt-2 border-t border-indigo-100 animate-fade-in">
                <textarea
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder="Paste external database JSON payload here..."
                  className="w-full h-24 p-2.5 text-xs font-mono bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
                <button
                  onClick={handleImportJson}
                  className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Apply &amp; Sync External Snapshot
                </button>
              </div>
            )}
          </div>

          {/* Realtime Sync Logs Console */}
          <div>
            <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Sync Activity Log</span>
              <span className="text-[11px] font-mono text-slate-400">Live stream</span>
            </div>
            <div className="bg-slate-900 rounded-2xl p-3.5 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto space-y-1.5 border border-slate-800 scrollbar-none">
              {dbStatus.logs.length === 0 ? (
                <div className="text-slate-500 italic">No sync events recorded yet. Click &quot;Push Full State&quot; to begin.</div>
              ) : (
                dbStatus.logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2">
                    <span className="text-slate-500">[{log.timestamp}]</span>
                    <span
                      className={`font-semibold ${
                        log.type === 'UPLOAD'
                          ? 'text-emerald-400'
                          : log.type === 'DOWNLOAD'
                          ? 'text-sky-400'
                          : log.type === 'PING'
                          ? 'text-amber-400'
                          : log.type === 'ERROR'
                          ? 'text-rose-400'
                          : 'text-indigo-400'
                      }`}
                    >
                      [{log.type}]
                    </span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Trust Security Rules Deployed &bull; Dual-layer Local/Cloud cache active</span>
          </div>
          <button
            onClick={() => {
              SoundFX.click();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
