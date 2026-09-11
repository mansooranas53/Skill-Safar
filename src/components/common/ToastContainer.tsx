import React, { useEffect, useState } from 'react';
import { toast, ToastMessage } from '../../lib/toast';
import { SoundFX } from '../../lib/soundEffects';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsub = toast.subscribe(newToasts => {
      if (newToasts.length > toasts.length) {
        // A new toast arrived
        SoundFX.pop();
      }
      setToasts(newToasts);
    });
    return unsub;
  }, [toasts.length]);

  return (
    <aside
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      <AnimatePresence>
        {toasts.map(t => {
          const isSuccess = t.type === 'success';
          const isWarning = t.type === 'warning';
          const isError = t.type === 'error';

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-start gap-3 relative overflow-hidden group"
            >
              {/* Subtle top indicator bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  isSuccess
                    ? 'bg-emerald-400'
                    : isWarning
                    ? 'bg-amber-400'
                    : isError
                    ? 'bg-rose-400'
                    : 'bg-indigo-400'
                }`}
              />

              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-indigo-400" />}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="font-semibold text-sm text-white tracking-tight">{t.title}</div>
                {t.description && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-light">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => toast.dismiss(t.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};
