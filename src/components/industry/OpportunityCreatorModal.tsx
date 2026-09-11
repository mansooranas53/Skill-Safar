import React, { useState } from 'react';
import { OpportunityType } from '../../types';
import { OpportunityService } from '../../services/portalServices';
import { X, Plus, Sparkles } from 'lucide-react';

interface OpportunityCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunityCreated?: () => void;
}

export const OpportunityCreatorModal: React.FC<OpportunityCreatorModalProps> = ({
  isOpen,
  onClose,
  onOpportunityCreated
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('Internship');
  const [domain, setDomain] = useState('Backend Engineering');
  const [location, setLocation] = useState('Bangalore, India');
  const [isRemote, setIsRemote] = useState(false);
  const [duration, setDuration] = useState('6 Months');
  const [stipend, setStipend] = useState('₹40,000 / month');
  const [requiredSkills, setRequiredSkills] = useState('Python, SQL & PostgreSQL, Git & Version Control');
  const [preferredSkills, setPreferredSkills] = useState('Docker & Containers, REST API Design');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    OpportunityService.create({
      industryId: 'ind-01',
      companyName: 'CloudScale Technologies',
      title,
      opportunityType: type,
      domain,
      location,
      isRemote,
      duration,
      stipendOrSalary: stipend,
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      eligibility: {
        degree: ['B.Tech', 'B.E.', 'MCA'],
        branches: ['Computer Science & Engineering', 'Information Technology'],
        minGraduationYear: 2025,
        maxGraduationYear: 2027,
        minCgpa: 7.5,
        minExperienceYears: 0
      },
      description: description || 'Exciting engineering role working with cutting-edge production systems.',
      responsibilities: [
        'Design, build, and deploy production microservices',
        'Participate in architecture reviews and automated CI/CD testing'
      ],
      perks: ['Pre-Placement Offer (PPO) Conversion', 'Mentorship from Staff Engineers', 'Learning Allowance'],
      applicationDeadline: deadline,
      status: status
    });

    if (onOpportunityCreated) {
      onOpportunityCreated();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Industry Recruitment Portal
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Publish New Industry Opportunity
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Opportunity Title *
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Distributed Systems Backend Intern"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Opportunity Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as OpportunityType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Internship">Internship</option>
                <option value="Job">Full-time Job</option>
                <option value="Live Project">Live Project</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Training">Industrial Training</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRemote}
                  onChange={e => setIsRemote(e.target.checked)}
                  className="rounded-sm text-emerald-600 focus:ring-emerald-500"
                />
                <span>Remote Allowed</span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Stipend / Salary</label>
              <input
                type="text"
                value={stipend}
                onChange={e => setStipend(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Required Skills (Comma-separated, used by deterministic matching) *
              </label>
              <input
                required
                type="text"
                value={requiredSkills}
                onChange={e => setRequiredSkills(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred / Nice-to-Have Skills
              </label>
              <input
                type="text"
                value={preferredSkills}
                onChange={e => setPreferredSkills(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Role Description</label>
              <textarea
                rows={3}
                placeholder="Overview of day-to-day engineering tasks and team context..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Initial Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="PUBLISHED">Published (Open to Applicants)</option>
                <option value="DRAFT">Draft (Unlisted)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Publish Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
