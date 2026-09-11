import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types';
import { ApplicationService } from '../../services/portalServices';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Building2,
  Briefcase,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ApplicationTrackerProps {
  studentId: string;
  onNavigateToOpportunities?: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  studentId,
  onNavigateToOpportunities
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const applications = ApplicationService.getForStudent(studentId);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SELECTED':
        return { label: 'Offer / Selected', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'INTERVIEW':
        return { label: 'Interview Scheduled', color: 'bg-slate-900 text-white border-slate-900', icon: Calendar };
      case 'SHORTLISTED':
        return { label: 'Shortlisted', color: 'bg-slate-100 text-slate-900 border-slate-300 font-semibold', icon: Sparkles };
      case 'UNDER_REVIEW':
        return { label: 'Under Review', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock };
      case 'REJECTED':
        return { label: 'Declined', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle };
      default:
        return { label: 'Applied', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: FileText };
    }
  };

  const stages: ApplicationStatus[] = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4 text-slate-800" />
            Recruitment Lifecycle Tracker
          </div>
          <h2 className="text-xl font-bold text-slate-900">Active Applications & Recruiter Feedback</h2>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time state transitions through the validated recruitment state machine.
          </p>
        </div>
        {onNavigateToOpportunities && (
          <button
            onClick={onNavigateToOpportunities}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs shrink-0"
          >
            Explore More Openings
          </button>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Discover matched opportunities tailored to your verified competencies and submit your first application.
          </p>
          {onNavigateToOpportunities && (
            <button
              onClick={onNavigateToOpportunities}
              className="mt-4 px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Browse Opportunities
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Applications ({applications.length})
            </h3>
            {applications.map(app => {
              const statusInfo = getStatusBadge(app.status);
              const Icon = statusInfo.icon;
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-100 border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-slate-900 text-sm leading-snug">
                      {app.opportunityTitle}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${statusInfo.color}`}>
                      <Icon className="w-3 h-3" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{app.companyName}</span>
                    <span className="font-bold text-slate-900">{app.matchScore}% Match</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-2">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details & Timeline view */}
          {selectedApp && (
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              {/* Card top */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    {selectedApp.opportunityType}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedApp.opportunityTitle}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">
                    {selectedApp.companyName}
                  </p>
                  <div className="text-xs text-slate-400 mt-1">
                    Application ID: <span className="font-mono">{selectedApp.id}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 text-slate-900 font-bold text-sm rounded-xl">
                    {selectedApp.matchScore}% Match Score
                  </div>
                  {selectedApp.interviewDate && (
                    <div className="mt-2 text-xs font-semibold text-white bg-slate-900 p-2 rounded-lg border border-slate-900 text-left">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-200" />
                        <span>Interview Scheduled:</span>
                      </div>
                      <div className="font-mono mt-0.5 text-slate-200">{new Date(selectedApp.interviewDate).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* State Machine Visualizer */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Stage Progress
                </h4>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {stages.map((stageName, idx) => {
                    const currentStageIdx = stages.indexOf(selectedApp.status);
                    const isPassed = currentStageIdx >= idx;
                    const isCurrent = selectedApp.status === stageName;
                    return (
                      <div
                        key={stageName}
                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                          isCurrent
                            ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold opacity-75">
                          Step 0{idx + 1}
                        </div>
                        <div className="truncate mt-0.5">
                          {stageName.replace('_', ' ')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cover Note */}
              {selectedApp.coverNote && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                  <div className="font-bold text-slate-900 mb-1">Applicant Statement:</div>
                  <p className="italic leading-relaxed">{selectedApp.coverNote}</p>
                </div>
              )}

              {/* Audit History Log */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Verified Audit Timeline
                </h4>
                <div className="space-y-3">
                  {selectedApp.statusHistory.map((hist, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                    >
                      <div className="p-1.5 bg-white rounded-lg border border-slate-200 text-slate-800 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">
                            {hist.status.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(hist.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {hist.note && (
                          <p className="text-slate-600 mt-1 leading-relaxed">{hist.note}</p>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">
                          Audited by: {hist.changedBy}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
