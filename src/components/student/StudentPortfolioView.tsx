import React, { useState } from 'react';
import { StudentProfile, ProjectItem, CertificationItem } from '../../types';
import { portalRepository } from '../../repositories/mockRepository';
import {
  FolderGit2,
  Award,
  FileText,
  ExternalLink,
  Plus,
  CheckCircle2,
  FileCheck,
  Check
} from 'lucide-react';

interface StudentPortfolioViewProps {
  student: StudentProfile;
}

export const StudentPortfolioView: React.FC<StudentPortfolioViewProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'resumes'>('projects');
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddCert, setShowAddCert] = useState(false);

  // Form states
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectSkills, setNewProjectSkills] = useState('');
  const [newProjectGithub, setNewProjectGithub] = useState('');

  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertId, setNewCertId] = useState('');
  const [newCertSkills, setNewCertSkills] = useState('');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle) return;

    const proj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDesc,
      technologies: newProjectTech.split(',').map(s => s.trim()).filter(Boolean),
      skillsDemonstrated: newProjectSkills.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl: newProjectGithub,
      completedDate: new Date().toISOString().split('T')[0]
    };

    portalRepository.updateStudentProfile({
      projects: [proj, ...student.projects]
    });

    setShowAddProject(false);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setNewProjectSkills('');
    setNewProjectGithub('');
  };

  const handleCreateCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle) return;

    const cert: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: newCertTitle,
      issuer: newCertIssuer || 'Industry Authority',
      credentialId: newCertId,
      issueDate: new Date().toISOString().split('T')[0],
      skillsCertified: newCertSkills.split(',').map(s => s.trim()).filter(Boolean)
    };

    portalRepository.updateStudentProfile({
      certifications: [cert, ...student.certifications]
    });

    setShowAddCert(false);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertId('');
    setNewCertSkills('');
  };

  const setDefaultResume = (resumeId: string) => {
    const updated = student.resumes.map(r => ({
      ...r,
      isDefault: r.id === resumeId
    }));
    portalRepository.updateStudentProfile({
      resumes: updated,
      selectedResumeId: resumeId
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4 text-slate-800" />
            Digital Employability Portfolio
          </div>
          <h2 className="text-xl font-bold text-slate-900">Project & Certification Evidence Ledger</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Tangible real-world proof of capability: public repositories, enterprise credentials, and verified resumes used during automated recruitment matching.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddProject(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
          <button
            onClick={() => setShowAddCert(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Certificate
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'projects'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Featured Projects ({student.projects.length})
        </button>
        <button
          onClick={() => setActiveTab('certifications')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'certifications'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Verified Certifications ({student.certifications.length})
        </button>
        <button
          onClick={() => setActiveTab('resumes')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'resumes'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Resume Documents ({student.resumes.length})
        </button>
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.projects.map(proj => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
                      <FolderGit2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                      <span className="text-[11px] text-slate-400">Completed: {proj.completedDate}</span>
                    </div>
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
                      title="GitHub Repository"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mt-2 mb-4">
                  {proj.description}
                </p>

                {/* Tech & Skills badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold self-center">Competencies:</span>
                    {proj.skillsDemonstrated.map(s => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.certifications.map(cert => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{cert.title}</h4>
                      <p className="text-xs text-slate-500">{cert.issuer} • Issued {cert.issueDate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                    Verified
                  </span>
                </div>

                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-slate-500 my-2">
                    Credential ID: {cert.credentialId}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cert.skillsCertified.map(s => (
                    <span key={s} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumes Tab */}
      {activeTab === 'resumes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {student.resumes.map(res => (
            <div
              key={res.id}
              className={`bg-white rounded-2xl p-6 border transition-all ${
                res.isDefault ? 'border-slate-900 shadow-xs' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{res.fileName}</h4>
                    <span className="text-[11px] text-slate-400">{res.fileSize} • Uploaded {res.uploadedAt}</span>
                  </div>
                </div>
                {res.isDefault ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-white rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Default
                  </span>
                ) : (
                  <button
                    onClick={() => setDefaultResume(res.id)}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                  >
                    Set as Default
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed">
                {res.summary}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  AI Extracted Competencies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {res.extractedSkills.map(s => (
                    <span key={s} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateProject}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900">Add Project Evidence</h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Project Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Microservice Telemetry Collector"
                value={newProjectTitle}
                onChange={e => setNewProjectTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Key technical accomplishments, architecture, and outcomes..."
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Technologies (comma-separated)</label>
              <input
                type="text"
                placeholder="Python, Docker, Redis, FastAPI"
                value={newProjectTech}
                onChange={e => setNewProjectTech(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Demonstrated Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="Python, REST API Design, Docker & Containers"
                value={newProjectSkills}
                onChange={e => setNewProjectSkills(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">GitHub / Code URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={newProjectGithub}
                onChange={e => setNewProjectGithub(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Certificate Modal */}
      {showAddCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <form
            onSubmit={handleCreateCert}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900">Add Verified Certification</h3>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Certificate Title</label>
              <input
                required
                type="text"
                placeholder="e.g. AWS Certified Solutions Architect Associate"
                value={newCertTitle}
                onChange={e => setNewCertTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Issuer / Organization</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services / Coursera"
                value={newCertIssuer}
                onChange={e => setNewCertIssuer(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Credential ID (Optional)</label>
              <input
                type="text"
                placeholder="e.g. AWS-SAA-884920"
                value={newCertId}
                onChange={e => setNewCertId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Certified Skills (comma-separated)</label>
              <input
                type="text"
                placeholder="Cloud Infrastructure (AWS/GCP), Docker & Containers"
                value={newCertSkills}
                onChange={e => setNewCertSkills(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddCert(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Certificate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
