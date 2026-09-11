/**
 * Academia–Industry Collaboration Portal
 * Repository Layer (Mock In-Memory + LocalStorage Persistence)
 * 
 * Complies with Repository Pattern isolating data access from UI and services.
 */

import {
  StudentProfile,
  IndustryProfile,
  AcademicianProfile,
  InstitutionProfile,
  Opportunity,
  Application,
  AssessmentQuestion,
  LearningProgram,
  FacultyCollaboration,
  PlatformNotification,
  ApplicationStatus,
  SkillScore,
  ProficiencyLevel,
  OpportunityStatus,
  SystemAuditLog,
  ServiceTier,
  ServiceModuleConfig,
  ServicePlanCatalogItem,
  CompanyAccountCredential,
  InstitutionLoginCredential,
  ManagedStudent,
  ManagedMentor,
  UserRole,
  PortalUserAccount
} from '../types';

import {
  SEED_STUDENT,
  SEED_INDUSTRIES,
  SEED_OPPORTUNITIES,
  SEED_APPLICATIONS,
  SEED_ASSESSMENT_QUESTIONS,
  SEED_LEARNING_PROGRAMS,
  SEED_ACADEMICIANS,
  SEED_INSTITUTIONS,
  SEED_FACULTY_COLLABORATIONS,
  SEED_NOTIFICATIONS,
  SEED_SKILL_CATEGORIES,
  SEED_SKILL_DEFINITIONS,
  SEED_AUDIT_LOGS,
  SEED_SERVICE_PLANS
} from '../data/seedData';

import {
  SEED_MANAGED_STUDENTS,
  SEED_MANAGED_MENTORS,
  getDefaultCompanyCredentials,
  getDefaultInstitutionCredentials
} from '../data/seedAdminData';

import { getFullStudentProfile } from '../data/studentProfiles';

import { canTransitionApplication, canTransitionOpportunity } from '../domain/stateMachines';
import {
  syncDocToFirestore,
  verifyCloudDatabaseConnection,
  cloudDatabaseInfo,
  pushAllToFirestore,
  fetchCollectionFromFirestore,
  setupRealtimeSync,
  exportExternalDatabaseSnapshot
} from '../lib/firestoreSync';

const STORAGE_KEYS = {
  STUDENT: 'aicp_student_profile_v1',
  OPPORTUNITIES: 'aicp_opportunities_v1',
  APPLICATIONS: 'aicp_applications_v1',
  LEARNING: 'aicp_learning_programs_v1',
  NOTIFICATIONS: 'aicp_notifications_v1',
  COLLABORATIONS: 'aicp_collaborations_v1',
  INSTITUTIONS: 'aicp_institutions_v2',
  AUDIT_LOGS: 'aicp_audit_logs_v1',
  ACTIVE_INSTITUTION: 'aicp_active_inst_v1',
  INDUSTRIES: 'aicp_industries_v2',
  MANAGED_STUDENTS: 'aicp_managed_students_v1',
  MANAGED_MENTORS: 'aicp_managed_mentors_v1',
  USERS: 'aicp_users_v2',
  CURRENT_USER: 'aicp_current_user_v2'
};

const DEFAULT_USERS_SEED: PortalUserAccount[] = [
  {
    id: 'user-std-01',
    email: 'aanal.nathvani@campus.edu',
    name: 'Aanal Nathvani',
    role: 'STUDENT',
    password: 'password123',
    organization: 'ITS Bangalore',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-std-02',
    email: 'aarav.sharma@campus.edu',
    name: 'Aarav Sharma',
    role: 'STUDENT',
    password: 'password123',
    organization: 'ITS Bangalore',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-ind-01',
    email: 'recruiter@cloudscale.io',
    name: 'CloudScale Recruiter',
    role: 'INDUSTRY',
    password: 'password123',
    organization: 'CloudScale Technologies',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-acd-01',
    email: 'herva.mehta@its-blr.edu.in',
    name: 'Prof. Herva Mehta',
    role: 'ACADEMICIAN',
    password: 'password123',
    organization: 'Computer Science Department',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'user-adm-01',
    email: 'admin@its-blr.edu.in',
    name: 'ITS Bangalore Administration',
    role: 'INSTITUTION_ADMIN',
    password: 'password123',
    organization: 'Institute of Technology & Science',
    updatedAt: new Date().toISOString()
  }
];

class PortalRepository {
  private student: StudentProfile;
  private industries: IndustryProfile[];
  private opportunities: Opportunity[];
  private applications: Application[];
  private assessmentQuestions: AssessmentQuestion[];
  private learningPrograms: LearningProgram[];
  private academicians: AcademicianProfile[];
  private institutions: InstitutionProfile[];
  private collaborations: FacultyCollaboration[];
  private notifications: PlatformNotification[];
  private auditLogs: SystemAuditLog[];
  private servicePlans: ServicePlanCatalogItem[];
  private managedStudents: ManagedStudent[];
  private managedMentors: ManagedMentor[];
  private users: PortalUserAccount[];
  private currentUser: PortalUserAccount | null;
  private activeInstitutionId: string;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.student = this.load(STORAGE_KEYS.STUDENT, SEED_STUDENT);
    this.users = this.load<PortalUserAccount[]>(STORAGE_KEYS.USERS, DEFAULT_USERS_SEED);
    this.currentUser = this.load<PortalUserAccount | null>(STORAGE_KEYS.CURRENT_USER, null);

    // If current logged-in user is a student with a custom name, sync with active profile
    if (this.currentUser && this.currentUser.role === 'STUDENT' && this.currentUser.name) {
      this.student.fullName = this.currentUser.name;
      this.student.email = this.currentUser.email;
    }
    
    const rawIndustries = this.load<IndustryProfile[]>(STORAGE_KEYS.INDUSTRIES, SEED_INDUSTRIES);
    this.industries = rawIndustries.map(ind => ({
      ...ind,
      contactPerson: ind.contactPerson || 'Talent Acquisition Team',
      contactPhone: ind.contactPhone || '+91 98765 43210',
      partnershipTier: ind.partnershipTier || 'GOLD',
      mouSigned: ind.mouSigned !== undefined ? ind.mouSigned : true,
      credentials: ind.credentials || getDefaultCompanyCredentials(ind.companyName, ind.contactEmail)
    }));

    this.opportunities = this.load(STORAGE_KEYS.OPPORTUNITIES, SEED_OPPORTUNITIES);
    this.applications = this.load(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
    this.assessmentQuestions = [...SEED_ASSESSMENT_QUESTIONS];
    this.learningPrograms = this.load(STORAGE_KEYS.LEARNING, SEED_LEARNING_PROGRAMS);
    this.academicians = [...SEED_ACADEMICIANS];

    const rawInstitutions = this.load<InstitutionProfile[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
    this.institutions = rawInstitutions.map(inst => ({
      ...inst,
      loginCredentials: inst.loginCredentials || getDefaultInstitutionCredentials(inst.code, inst.contactEmail || 'admin@its-blr.edu.in')
    }));

    this.collaborations = this.load(STORAGE_KEYS.COLLABORATIONS, SEED_FACULTY_COLLABORATIONS);
    this.notifications = this.load(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    this.auditLogs = this.load(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    this.servicePlans = [...SEED_SERVICE_PLANS];
    this.managedStudents = this.load<ManagedStudent[]>(STORAGE_KEYS.MANAGED_STUDENTS, SEED_MANAGED_STUDENTS);
    this.managedMentors = this.load<ManagedMentor[]>(STORAGE_KEYS.MANAGED_MENTORS, SEED_MANAGED_MENTORS);
    this.activeInstitutionId = this.load(STORAGE_KEYS.ACTIVE_INSTITUTION, 'inst-01');

    // Initiate cloud database verification and automatic initial sync
    this.initCloudSync();
  }

  private async initCloudSync(): Promise<void> {
    const isOnline = await verifyCloudDatabaseConnection().catch(() => false);
    if (!isOnline) return;

    // Check if cloud has opportunities or institutions; if not, push initial seed data
    try {
      // 1. Synchronize user accounts across devices
      const existingUsers = await fetchCollectionFromFirestore<PortalUserAccount>('users');
      if (existingUsers.length > 0) {
        this.users = existingUsers;
        this.persist(STORAGE_KEYS.USERS, existingUsers);
        if (this.currentUser) {
          const match = existingUsers.find(u => u.email.toLowerCase() === this.currentUser?.email.toLowerCase());
          if (match) this.currentUser = match;
        }
      }

      // 2. Synchronize student profile across devices
      const existingStudentProfiles = await fetchCollectionFromFirestore<StudentProfile>('studentProfiles');
      if (existingStudentProfiles.length > 0) {
        const userEmail = this.currentUser?.email?.toLowerCase();
        const activeMatch = existingStudentProfiles.find(s => (userEmail && s.email.toLowerCase() === userEmail) || s.id === this.student.id) || existingStudentProfiles[0];
        if (activeMatch && activeMatch.fullName) {
          this.student = activeMatch;
          this.persist(STORAGE_KEYS.STUDENT, this.student);
        }
      }

      // 3. Synchronize notifications across devices
      const existingNotifs = await fetchCollectionFromFirestore<PlatformNotification>('notifications');
      if (existingNotifs.length > 0) {
        this.notifications = existingNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      }

      const existingOpps = await fetchCollectionFromFirestore<Opportunity>('opportunities');
      if (existingOpps.length === 0) {
        // Cloud is empty or freshly initialized: push full seed state
        await this.triggerFullCloudSync();
      } else {
        // Cloud has records: merge with repository
        this.opportunities = existingOpps;
        this.persist(STORAGE_KEYS.OPPORTUNITIES, existingOpps);
        
        const existingInsts = await fetchCollectionFromFirestore<InstitutionProfile>('institutions');
        if (existingInsts.length > 0) {
          this.institutions = existingInsts;
          this.persist(STORAGE_KEYS.INSTITUTIONS, existingInsts);
        }

        const existingStudents = await fetchCollectionFromFirestore<ManagedStudent>('students');
        if (existingStudents.length > 0) {
          this.managedStudents = existingStudents;
          this.persist(STORAGE_KEYS.MANAGED_STUDENTS, existingStudents);
        }

        const existingCompanies = await fetchCollectionFromFirestore<IndustryProfile>('companies');
        if (existingCompanies.length > 0) {
          this.industries = existingCompanies;
          this.persist(STORAGE_KEYS.INDUSTRIES, existingCompanies);
        }

        const existingApps = await fetchCollectionFromFirestore<Application>('applications');
        if (existingApps.length > 0) {
          this.applications = existingApps;
          this.persist(STORAGE_KEYS.APPLICATIONS, existingApps);
        }

        this.notify();
      }

      // Attach realtime listeners for cloud updates
      this.attachRealtimeListeners();
    } catch (err) {
      console.warn('Initial cloud sync notice:', err);
    }
  }

  private attachRealtimeListeners(): void {
    // 1. Realtime listener for student profiles (syncs name, email, credentials across all devices live)
    setupRealtimeSync('studentProfiles', (items: StudentProfile[]) => {
      if (items.length > 0) {
        const userEmail = this.currentUser?.email?.toLowerCase();
        const match = items.find(s => (userEmail && s.email.toLowerCase() === userEmail) || s.id === this.student.id) || items[0];
        if (match && match.fullName) {
          this.student = { ...this.student, ...match };
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(this.student));
          }
          this.notify();
        }
      }
    });

    // 2. Realtime listener for users accounts (email, password, names across devices)
    setupRealtimeSync('users', (items: PortalUserAccount[]) => {
      if (items.length > 0) {
        this.users = items;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(items));
        }
        if (this.currentUser) {
          const match = items.find(u => u.email.toLowerCase() === this.currentUser?.email.toLowerCase());
          if (match) {
            this.currentUser = match;
            if (match.role === 'STUDENT' && match.name && match.name !== this.student.fullName) {
              this.student.fullName = match.name;
              this.student.email = match.email;
              if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(this.student));
              }
            }
          }
        }
        this.notify();
      }
    });

    // 3. Realtime listener for notifications (live navbar notification count and bell updates)
    setupRealtimeSync('notifications', (items: PlatformNotification[]) => {
      if (items.length > 0) {
        this.notifications = items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.notifications));
        }
        this.notify();
      }
    });

    // 4. Opportunities, Applications, and Students
    setupRealtimeSync('opportunities', (items: Opportunity[]) => {
      if (items.length > 0) {
        this.opportunities = items;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(items));
        }
        this.notify();
      }
    });

    setupRealtimeSync('applications', (items: Application[]) => {
      if (items.length > 0) {
        this.applications = items;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(items));
        }
        this.notify();
      }
    });

    setupRealtimeSync('students', (items: ManagedStudent[]) => {
      if (items.length > 0) {
        this.managedStudents = items;
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.MANAGED_STUDENTS, JSON.stringify(items));
        }
        this.notify();
      }
    });
  }

  private load<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  private persist(key: string, data: unknown): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore
    }

    // Mirror updates asynchronously to Cloud Firestore
    if (key === STORAGE_KEYS.STUDENT && data) {
      const std = data as StudentProfile;
      if (std.id) syncDocToFirestore('studentProfiles', std.id, std as any);
      syncDocToFirestore('students', std.id || 'stu-001', {
        id: std.id || 'stu-001',
        fullName: std.fullName,
        email: std.email,
        institutionName: std.institutionName,
        branch: std.branch,
        verifiedSkillScore: std.skills.length ? Math.round(std.skills.reduce((a, b) => a + b.score, 0) / std.skills.length) : 85,
        internshipStatus: 'Seeking'
      });
    } else if (Array.isArray(data)) {
      if (key === STORAGE_KEYS.INSTITUTIONS) {
        data.forEach((inst: any) => {
          if (inst?.id) syncDocToFirestore('institutions', inst.id, inst);
        });
      } else if (key === STORAGE_KEYS.INDUSTRIES) {
        data.forEach((comp: any) => {
          if (comp?.id) syncDocToFirestore('companies', comp.id, comp);
        });
      } else if (key === STORAGE_KEYS.MANAGED_STUDENTS) {
        data.forEach((std: any) => {
          if (std?.id) syncDocToFirestore('students', std.id, std);
        });
      } else if (key === STORAGE_KEYS.MANAGED_MENTORS) {
        data.forEach((mnt: any) => {
          if (mnt?.id) syncDocToFirestore('mentors', mnt.id, mnt);
        });
      } else if (key === STORAGE_KEYS.OPPORTUNITIES) {
        data.forEach((opp: any) => {
          if (opp?.id) syncDocToFirestore('opportunities', opp.id, opp);
        });
      } else if (key === STORAGE_KEYS.APPLICATIONS) {
        data.forEach((app: any) => {
          if (app?.id) syncDocToFirestore('applications', app.id, app);
        });
      } else if (key === STORAGE_KEYS.COLLABORATIONS) {
        data.forEach((col: any) => {
          if (col?.id) syncDocToFirestore('collaborations', col.id, col);
        });
      } else if (key === STORAGE_KEYS.LEARNING) {
        data.forEach((lrn: any) => {
          if (lrn?.id) syncDocToFirestore('learningPrograms', lrn.id, lrn);
        });
      } else if (key === STORAGE_KEYS.AUDIT_LOGS) {
        data.forEach((log: any) => {
          if (log?.id) syncDocToFirestore('auditLogs', log.id, log);
        });
      } else if (key === STORAGE_KEYS.NOTIFICATIONS) {
        data.forEach((notif: any) => {
          if (notif?.id) syncDocToFirestore('notifications', notif.id, notif);
        });
      } else if (key === STORAGE_KEYS.USERS) {
        data.forEach((user: any) => {
          if (user?.id) syncDocToFirestore('users', user.id, user);
        });
      }
    }
  }

  public getCloudDatabaseStatus() {
    return cloudDatabaseInfo;
  }

  public async recheckCloudConnection(): Promise<boolean> {
    const res = await verifyCloudDatabaseConnection();
    this.notify();
    return res;
  }

  public async triggerFullCloudSync(): Promise<{ success: boolean; totalUploaded: number; error?: string }> {
    const res = await pushAllToFirestore({
      institutions: this.institutions,
      companies: this.industries,
      opportunities: this.opportunities,
      managedStudents: this.managedStudents,
      managedMentors: this.managedMentors,
      applications: this.applications,
      collaborations: this.collaborations,
      learningPrograms: this.learningPrograms,
      auditLogs: this.auditLogs,
      notifications: this.notifications,
      users: this.users,
      student: this.student
    });
    this.notify();
    return res;
  }

  public async pullAllFromCloud(): Promise<boolean> {
    try {
      const opps = await fetchCollectionFromFirestore<Opportunity>('opportunities');
      if (opps.length) {
        this.opportunities = opps;
        this.persist(STORAGE_KEYS.OPPORTUNITIES, opps);
      }
      const insts = await fetchCollectionFromFirestore<InstitutionProfile>('institutions');
      if (insts.length) {
        this.institutions = insts;
        this.persist(STORAGE_KEYS.INSTITUTIONS, insts);
      }
      const comps = await fetchCollectionFromFirestore<IndustryProfile>('companies');
      if (comps.length) {
        this.industries = comps;
        this.persist(STORAGE_KEYS.INDUSTRIES, comps);
      }
      const students = await fetchCollectionFromFirestore<ManagedStudent>('students');
      if (students.length) {
        this.managedStudents = students;
        this.persist(STORAGE_KEYS.MANAGED_STUDENTS, students);
      }
      const apps = await fetchCollectionFromFirestore<Application>('applications');
      if (apps.length) {
        this.applications = apps;
        this.persist(STORAGE_KEYS.APPLICATIONS, apps);
      }
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  public exportDatabaseAsJson(): string {
    return exportExternalDatabaseSnapshot({
      student: this.student,
      institutions: this.institutions,
      companies: this.industries,
      opportunities: this.opportunities,
      applications: this.applications,
      managedStudents: this.managedStudents,
      managedMentors: this.managedMentors,
      collaborations: this.collaborations,
      learningPrograms: this.learningPrograms,
      auditLogs: this.auditLogs
    });
  }

  public importDatabaseFromJson(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      const data = parsed.database || parsed;
      if (data.opportunities && Array.isArray(data.opportunities)) {
        this.opportunities = data.opportunities;
        this.persist(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
      }
      if (data.institutions && Array.isArray(data.institutions)) {
        this.institutions = data.institutions;
        this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);
      }
      if (data.companies && Array.isArray(data.companies)) {
        this.industries = data.companies;
        this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);
      }
      if (data.managedStudents && Array.isArray(data.managedStudents)) {
        this.managedStudents = data.managedStudents;
        this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);
      }
      if (data.applications && Array.isArray(data.applications)) {
        this.applications = data.applications;
        this.persist(STORAGE_KEYS.APPLICATIONS, this.applications);
      }
      if (data.student) {
        this.student = data.student;
        this.persist(STORAGE_KEYS.STUDENT, this.student);
      }
      this.triggerFullCloudSync();
      this.notify();
      return { success: true, message: 'Database imported and synced successfully' };
    } catch (err) {
      return { success: false, message: (err as Error).message || 'Invalid JSON format' };
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // Student methods
  public getStudentProfile(): StudentProfile {
    return { ...this.student };
  }

  public getStudentProfileById(studentIdOrIdentifier: string): StudentProfile {
    if (
      studentIdOrIdentifier === this.student.id ||
      studentIdOrIdentifier === 'stu-001' ||
      studentIdOrIdentifier === this.student.email
    ) {
      return { ...this.student };
    }
    const managed = this.managedStudents.find(
      s =>
        s.id === studentIdOrIdentifier ||
        s.email.toLowerCase() === studentIdOrIdentifier.toLowerCase() ||
        s.usn.toLowerCase() === studentIdOrIdentifier.toLowerCase() ||
        s.fullName.toLowerCase() === studentIdOrIdentifier.toLowerCase()
    );
    return getFullStudentProfile(studentIdOrIdentifier, managed);
  }

  public addStudentMentorshipNote(
    studentId: string,
    mentorName: string,
    note: string,
    endorsedSkills?: string[]
  ): void {
    const std = this.managedStudents.find(s => s.id === studentId);
    this.logAudit({
      action: 'FACULTY_MENTOR_NOTE_ADDED',
      category: 'MENTOR_ADMIN',
      performedBy: mentorName,
      targetInstituteName: std?.institutionName || 'Campus Faculty Roster',
      details: `Faculty evaluation recorded for ${std?.fullName || studentId}: "${note}". Endorsements: ${endorsedSkills?.join(', ') || 'General competencies'}.`,
      status: 'SUCCESS'
    });
    this.notify();
  }

  public updateStudentProfile(patch: Partial<StudentProfile>): StudentProfile {
    this.student = { ...this.student, ...patch };
    this.persist(STORAGE_KEYS.STUDENT, this.student);

    // Keep currentUser synchronized if role is STUDENT
    if (this.currentUser && this.currentUser.role === 'STUDENT') {
      if (patch.fullName) this.currentUser.name = patch.fullName;
      if (patch.email) this.currentUser.email = patch.email;
      this.persist(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      const userInList = this.users.find(u => u.id === this.currentUser?.id);
      if (userInList) {
        if (patch.fullName) userInList.name = patch.fullName;
        if (patch.email) userInList.email = patch.email;
        this.persist(STORAGE_KEYS.USERS, this.users);
      }
    }

    // Keep managedStudents synchronized
    const managed = this.managedStudents.find(s => s.id === this.student.id || (patch.email && s.email.toLowerCase() === patch.email.toLowerCase()));
    if (managed) {
      if (patch.fullName) managed.fullName = patch.fullName;
      if (patch.email) managed.email = patch.email;
      this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);
    }

    this.notify();
    return { ...this.student };
  }

  public updateSkillScore(skillName: string, newScore: number, evidenceContext?: string): void {
    const skills = [...this.student.skills];
    const idx = skills.findIndex(s => s.skillName.toLowerCase() === skillName.toLowerCase());

    const getProficiency = (score: number): ProficiencyLevel => {
      if (score >= 85) return 'Expert';
      if (score >= 70) return 'Advanced';
      if (score >= 50) return 'Intermediate';
      return 'Beginner';
    };

    if (idx >= 0) {
      const existing = skills[idx];
      const updatedEvidence = [...existing.evidenceSources];
      if (evidenceContext) {
        updatedEvidence.push({
          id: `ev-${Date.now()}`,
          sourceType: 'Assessment',
          title: `Assessment Completed: ${skillName}`,
          issuerOrContext: evidenceContext,
          date: new Date().toISOString().split('T')[0],
          scoreOrGrade: `${Math.round(newScore)}%`
        });
      }
      skills[idx] = {
        ...existing,
        score: Math.min(100, Math.round(newScore)),
        proficiency: getProficiency(newScore),
        confidence: Math.min(100, Math.max(existing.confidence, 85)),
        lastAssessedAt: new Date().toISOString().split('T')[0],
        evidenceSources: updatedEvidence
      };
    } else {
      skills.push({
        skillId: `sk-${Date.now()}`,
        skillName,
        category: 'cat-backend',
        score: Math.min(100, Math.round(newScore)),
        proficiency: getProficiency(newScore),
        confidence: 85,
        lastAssessedAt: new Date().toISOString().split('T')[0],
        evidenceSources: evidenceContext ? [{
          id: `ev-${Date.now()}`,
          sourceType: 'Assessment',
          title: `Assessment: ${skillName}`,
          issuerOrContext: evidenceContext,
          date: new Date().toISOString().split('T')[0],
          scoreOrGrade: `${Math.round(newScore)}%`
        }] : []
      });
    }

    this.student.skills = skills;
    this.student.employabilityStage = 'LEARN';
    this.persist(STORAGE_KEYS.STUDENT, this.student);
    this.notify();
  }

  // Opportunities
  public getOpportunities(): Opportunity[] {
    return [...this.opportunities];
  }

  public getOpportunityById(id: string): Opportunity | undefined {
    return this.opportunities.find(o => o.id === id);
  }

  public createOpportunity(opp: Omit<Opportunity, 'id' | 'createdAt' | 'totalApplicants'>): Opportunity {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalApplicants: 0
    };
    this.opportunities = [newOpp, ...this.opportunities];
    this.persist(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.notify();
    return newOpp;
  }

  public updateOpportunityStatus(id: string, newStatus: OpportunityStatus): boolean {
    const opp = this.opportunities.find(o => o.id === id);
    if (!opp) return false;
    if (!canTransitionOpportunity(opp.status, newStatus)) {
      throw new Error(`Invalid opportunity transition from ${opp.status} to ${newStatus}`);
    }
    opp.status = newStatus;
    this.persist(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.notify();
    return true;
  }

  // Applications
  public getApplications(): Application[] {
    return [...this.applications];
  }

  public getApplicationsForStudent(studentId: string): Application[] {
    return this.applications.filter(a => a.studentId === studentId);
  }

  public getApplicationsForOpportunity(oppId: string): Application[] {
    return this.applications.filter(a => a.opportunityId === oppId);
  }

  public submitApplication(data: {
    opportunityId: string;
    coverNote?: string;
    resumeId: string;
    matchScore: number;
  }): Application {
    const opp = this.getOpportunityById(data.opportunityId);
    if (!opp) throw new Error('Opportunity not found');
    if (opp.status !== 'PUBLISHED') throw new Error('Cannot apply to an unpublished or closed opportunity');

    // Check duplicate
    const existing = this.applications.find(a => a.opportunityId === data.opportunityId && a.studentId === this.student.id);
    if (existing) throw new Error('You have already applied to this opportunity');

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      companyName: opp.companyName,
      opportunityType: opp.opportunityType,
      studentId: this.student.id,
      studentName: this.student.fullName,
      studentEmail: this.student.email,
      studentDegree: this.student.degree,
      studentBranch: this.student.branch,
      resumeId: data.resumeId,
      coverNote: data.coverNote,
      status: 'APPLIED',
      matchScore: data.matchScore,
      appliedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'APPLIED',
          timestamp: new Date().toISOString(),
          note: 'Application submitted through Candidate Portal',
          changedBy: this.student.fullName
        }
      ]
    };

    this.applications = [newApp, ...this.applications];
    opp.totalApplicants += 1;
    this.student.employabilityStage = 'APPLY';

    // Add notification
    this.addNotification({
      userId: this.student.userId,
      title: 'Application Submitted',
      message: `Your application for ${opp.title} at ${opp.companyName} was successfully received.`,
      type: 'APPLICATION',
      actionUrl: 'applications'
    });

    this.persist(STORAGE_KEYS.APPLICATIONS, this.applications);
    this.persist(STORAGE_KEYS.OPPORTUNITIES, this.opportunities);
    this.persist(STORAGE_KEYS.STUDENT, this.student);
    this.notify();
    return newApp;
  }

  public updateApplicationStatus(
    appId: string,
    newStatus: ApplicationStatus,
    note?: string,
    changedBy: string = 'Recruitment Team',
    interviewDate?: string
  ): Application {
    const app = this.applications.find(a => a.id === appId);
    if (!app) throw new Error('Application not found');

    if (!canTransitionApplication(app.status, newStatus)) {
      throw new Error(`Invalid application transition from ${app.status} to ${newStatus}`);
    }

    app.status = newStatus;
    if (interviewDate) {
      app.interviewDate = interviewDate;
    }

    app.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Application status updated to ${newStatus}`,
      changedBy
    });

    // Notify student
    this.addNotification({
      userId: app.studentId,
      title: `Application Status: ${newStatus.replace('_', ' ')}`,
      message: `${app.companyName} has updated your application for "${app.opportunityTitle}" to ${newStatus.replace('_', ' ')}. ${note ? `Note: ${note}` : ''}`,
      type: 'APPLICATION',
      actionUrl: 'applications'
    });

    this.persist(STORAGE_KEYS.APPLICATIONS, this.applications);
    this.notify();
    return { ...app };
  }

  // Learning Programs & Completion
  public getLearningPrograms(): LearningProgram[] {
    return [...this.learningPrograms];
  }

  public completeLearningProgram(programId: string): void {
    const p = this.learningPrograms.find(item => item.id === programId);
    if (!p) return;
    p.isCompleted = true;

    // Boost the target skill
    const target = this.student.skills.find(s => s.skillName.toLowerCase() === p.targetSkill.toLowerCase());
    const currentScore = target ? target.score : 40;
    const newScore = Math.min(95, currentScore + p.scoreBoost);
    this.updateSkillScore(p.targetSkill, newScore, `Completed Course: ${p.title}`);

    this.addNotification({
      userId: this.student.userId,
      title: 'Course Completed & Skill Verified!',
      message: `Congratulations! You completed "${p.title}". Your skill score in ${p.targetSkill} increased to ${newScore}%.`,
      type: 'ASSESSMENT',
      actionUrl: 'skills'
    });

    this.persist(STORAGE_KEYS.LEARNING, this.learningPrograms);
    this.notify();
  }

  // Notifications
  public getNotifications(): PlatformNotification[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): void {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
      this.notify();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => { n.read = true; });
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public addNotification(n: Omit<PlatformNotification, 'id' | 'createdAt' | 'read'>): PlatformNotification {
    const newNotif: PlatformNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    this.notifications = [newNotif, ...this.notifications];
    this.persist(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
    return newNotif;
  }

  // Questions
  public getAssessmentQuestions(categoryId?: string): AssessmentQuestion[] {
    if (!categoryId) return [...this.assessmentQuestions];
    return this.assessmentQuestions.filter(q => q.categoryId === categoryId);
  }

  // Taxonomies
  public getCategories(): typeof SEED_SKILL_CATEGORIES {
    return SEED_SKILL_CATEGORIES;
  }

  public getSkillDefinitions(): typeof SEED_SKILL_DEFINITIONS {
    return SEED_SKILL_DEFINITIONS;
  }

  // Academician & Collaborations
  public getCollaborations(): FacultyCollaboration[] {
    return [...this.collaborations];
  }

  public getAcademicians(): AcademicianProfile[] {
    return [...this.academicians];
  }

  public getIndustries(): IndustryProfile[] {
    return [...this.industries];
  }

  public getInstitutions(): InstitutionProfile[] {
    return [...this.institutions];
  }

  public getInstitutionById(id: string): InstitutionProfile | undefined {
    return this.institutions.find(i => i.id === id);
  }

  public getActiveInstitution(): InstitutionProfile {
    const inst = this.institutions.find(i => i.id === this.activeInstitutionId);
    return inst || this.institutions[0] || SEED_INSTITUTIONS[0];
  }

  public setActiveInstitutionId(id: string): void {
    this.activeInstitutionId = id;
    this.persist(STORAGE_KEYS.ACTIVE_INSTITUTION, id);
    this.notify();
  }

  public createInstitution(
    data: Omit<InstitutionProfile, 'id' | 'joinedDate'>
  ): InstitutionProfile {
    const newInst: InstitutionProfile = {
      ...data,
      id: `inst-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      status: data.status || 'ACTIVE'
    };
    this.institutions = [newInst, ...this.institutions];
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: 'INSTITUTE_ONBOARDED',
      category: 'INSTITUTE_PROVISION',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: newInst.name,
      details: `Enrolled new institution (${newInst.code}) under ${newInst.subscription?.planTier || 'STANDARD'} tier. Seats: ${newInst.subscription?.totalStudentSeats || newInst.totalStudents}.`,
      status: 'SUCCESS'
    });

    this.notify();
    return newInst;
  }

  public updateInstitution(id: string, patch: Partial<InstitutionProfile>): InstitutionProfile {
    const idx = this.institutions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Institution with id ${id} not found`);

    const updated: InstitutionProfile = {
      ...this.institutions[idx],
      ...patch
    };
    this.institutions[idx] = updated;
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: 'INSTITUTE_UPDATED',
      category: 'INSTITUTE_PROVISION',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.name,
      details: `Updated institutional credentials, departments, or contact details for ${updated.name}.`,
      status: 'INFO'
    });

    this.notify();
    return updated;
  }

  public assignServiceToInstitute(
    id: string,
    tier: ServiceTier,
    moduleOverrides: Partial<ServiceModuleConfig>,
    seats?: number,
    contractValue?: number,
    billingCycle?: 'Annual' | 'Quarterly' | 'Multi-Year (3 Years)' | '90-Day Pilot'
  ): InstitutionProfile {
    const idx = this.institutions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Institution with id ${id} not found`);

    const existing = this.institutions[idx];
    const defaultModules: ServiceModuleConfig = {
      skillAssessmentEngine: true,
      mcpAiCareerAdvisor: true,
      industryRecruiterBridge: true,
      facultyResearchHub: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
      naacNirfAnalytics: tier === 'PROFESSIONAL' || tier === 'ENTERPRISE',
      customBrandingSso: tier === 'ENTERPRISE'
    };

    const mergedModules: ServiceModuleConfig = {
      ...defaultModules,
      ...(existing.subscription?.modules || {}),
      ...moduleOverrides
    };

    const newSeats = seats !== undefined ? seats : (existing.subscription?.totalStudentSeats || existing.totalStudents);
    const newContractValue = contractValue !== undefined ? contractValue : (existing.subscription?.contractValueInr || 850000);

    const updatedSub = {
      ...(existing.subscription || {}),
      planTier: tier,
      contractValueInr: newContractValue,
      billingCycle: billingCycle || existing.subscription?.billingCycle || 'Annual',
      startDate: existing.subscription?.startDate || new Date().toISOString().split('T')[0],
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalStudentSeats: newSeats,
      allocatedStudentSeats: existing.subscription?.allocatedStudentSeats || Math.min(newSeats, existing.totalStudents),
      accountManagerName: existing.subscription?.accountManagerName || 'Skill Safar Enterprise Partner',
      accountManagerEmail: existing.subscription?.accountManagerEmail || 'accounts@skillsafar.internal',
      contractStatus: 'Active' as const,
      modules: mergedModules,
      lastInvoiceNumber: `INV-${Date.now().toString().slice(-6)}`
    };

    const updatedInst: InstitutionProfile = {
      ...existing,
      subscription: updatedSub
    };

    this.institutions[idx] = updatedInst;
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: 'SERVICE_ASSIGNED',
      category: 'PLAN_UPGRADE',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updatedInst.name,
      details: `Assigned ${tier} tier package. Seats: ${newSeats}. Contract Value: ₹${newContractValue.toLocaleString('en-IN')}. Active modules updated.`,
      status: 'SUCCESS'
    });

    this.notify();
    return updatedInst;
  }

  public toggleInstituteStatus(id: string): InstitutionProfile {
    const idx = this.institutions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Institution with id ${id} not found`);

    const existing = this.institutions[idx];
    const newStatus = existing.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const updatedInst: InstitutionProfile = {
      ...existing,
      status: newStatus
    };

    this.institutions[idx] = updatedInst;
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: newStatus === 'ACTIVE' ? 'INSTITUTE_ACTIVATED' : 'INSTITUTE_SUSPENDED',
      category: 'SECURITY',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updatedInst.name,
      details: `Institution service access was marked as ${newStatus}.`,
      status: newStatus === 'ACTIVE' ? 'SUCCESS' : 'WARN'
    });

    this.notify();
    return updatedInst;
  }

  public deleteInstitution(id: string): boolean {
    const inst = this.institutions.find(i => i.id === id);
    if (!inst) return false;

    this.institutions = this.institutions.filter(i => i.id !== id);
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: 'INSTITUTE_DECOMMISSIONED',
      category: 'SECURITY',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: inst.name,
      details: `Institution record ${inst.name} (${inst.code}) was removed from tenant roster.`,
      status: 'WARN'
    });

    this.notify();
    return true;
  }

  // Audit Logs & Plans
  public getAuditLogs(): SystemAuditLog[] {
    return [...this.auditLogs];
  }

  public logAudit(log: Omit<SystemAuditLog, 'id' | 'timestamp'>): SystemAuditLog {
    const newLog: SystemAuditLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs = [newLog, ...this.auditLogs].slice(0, 100);
    this.persist(STORAGE_KEYS.AUDIT_LOGS, this.auditLogs);
    syncDocToFirestore('auditLogs', newLog.id, newLog as any);
    return newLog;
  }

  public getServicePlans(): ServicePlanCatalogItem[] {
    return [...this.servicePlans];
  }

  // Reset to seed defaults
  public resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    }
    this.student = { ...SEED_STUDENT };
    this.opportunities = [...SEED_OPPORTUNITIES];
    this.applications = [...SEED_APPLICATIONS];
    this.learningPrograms = [...SEED_LEARNING_PROGRAMS];
    this.notifications = [...SEED_NOTIFICATIONS];
    this.collaborations = [...SEED_FACULTY_COLLABORATIONS];
    this.institutions = SEED_INSTITUTIONS.map(inst => ({
      ...inst,
      loginCredentials: getDefaultInstitutionCredentials(inst.code, inst.contactEmail || 'admin@its-blr.edu.in')
    }));
    this.industries = SEED_INDUSTRIES.map(ind => ({
      ...ind,
      contactPerson: 'Talent Acquisition Team',
      contactPhone: '+91 98765 43210',
      partnershipTier: 'GOLD',
      mouSigned: true,
      credentials: getDefaultCompanyCredentials(ind.companyName, ind.contactEmail)
    }));
    this.managedStudents = [...SEED_MANAGED_STUDENTS];
    this.managedMentors = [...SEED_MANAGED_MENTORS];
    this.auditLogs = [...SEED_AUDIT_LOGS];
    this.activeInstitutionId = 'inst-01';
    this.notify();
  }

  // Company & Industry Management
  public getIndustryById(id: string): IndustryProfile | undefined {
    return this.industries.find(i => i.id === id);
  }

  public onboardCompany(
    data: Omit<IndustryProfile, 'id' | 'userId' | 'activeOpportunitiesCount'> & { initialPassword?: string }
  ): IndustryProfile {
    const id = `ind-${Date.now()}`;
    const newCompany: IndustryProfile = {
      ...data,
      id,
      userId: `usr-${id}`,
      activeOpportunitiesCount: 0,
      isVerified: data.isVerified !== undefined ? data.isVerified : true,
      partnershipTier: data.partnershipTier || 'GOLD',
      mouSigned: data.mouSigned !== undefined ? data.mouSigned : true,
      credentials: data.credentials || {
        ...getDefaultCompanyCredentials(data.companyName, data.contactEmail),
        temporaryPassword: data.initialPassword || undefined
      }
    };

    this.industries = [newCompany, ...this.industries];
    this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);

    this.logAudit({
      action: 'COMPANY_ONBOARDED',
      category: 'COMPANY_ONBOARD',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: newCompany.companyName,
      details: `Onboarded ${newCompany.companyName} (${newCompany.domain}) as ${newCompany.partnershipTier} partner. Recruiter username: ${newCompany.credentials?.username}.`,
      status: 'SUCCESS'
    });

    this.notify();
    return newCompany;
  }

  public updateCompany(id: string, patch: Partial<IndustryProfile>): IndustryProfile {
    const idx = this.industries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Company with id ${id} not found`);

    const updated: IndustryProfile = {
      ...this.industries[idx],
      ...patch
    };
    this.industries[idx] = updated;
    this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);

    this.logAudit({
      action: 'COMPANY_PROFILE_UPDATED',
      category: 'COMPANY_ONBOARD',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.companyName,
      details: `Updated corporate profile, contacts, or partnership tier for ${updated.companyName}.`,
      status: 'INFO'
    });

    this.notify();
    return updated;
  }

  public updateCompanyCredentials(id: string, patch: Partial<CompanyAccountCredential>): IndustryProfile {
    const idx = this.industries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Company with id ${id} not found`);

    const existing = this.industries[idx];
    const currentCreds = existing.credentials || getDefaultCompanyCredentials(existing.companyName, existing.contactEmail);
    const updatedCreds: CompanyAccountCredential = {
      ...currentCreds,
      ...patch
    };

    const updated: IndustryProfile = {
      ...existing,
      credentials: updatedCreds
    };
    this.industries[idx] = updated;
    this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);

    this.logAudit({
      action: 'COMPANY_CREDENTIALS_MODIFIED',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.companyName,
      details: `Updated recruiter login settings: Status=${updatedCreds.status}, 2FA=${updatedCreds.twoFactorEnabled}.`,
      status: updatedCreds.status === 'ACTIVE' ? 'SUCCESS' : 'WARN'
    });

    this.notify();
    return updated;
  }

  public resetCompanyPassword(id: string): string {
    const idx = this.industries.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Company with id ${id} not found`);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let tempPass = 'Skill-';
    for (let i = 0; i < 8; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const existing = this.industries[idx];
    const currentCreds = existing.credentials || getDefaultCompanyCredentials(existing.companyName, existing.contactEmail);
    existing.credentials = {
      ...currentCreds,
      temporaryPassword: tempPass,
      status: 'ACTIVE'
    };

    this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);
    this.logAudit({
      action: 'COMPANY_PASSWORD_RESET',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: existing.companyName,
      details: `Generated new temporary one-time password for recruiter account (${existing.credentials.loginEmail}).`,
      status: 'WARN'
    });

    this.notify();
    return tempPass;
  }

  public deleteCompany(id: string): boolean {
    const comp = this.industries.find(i => i.id === id);
    if (!comp) return false;

    this.industries = this.industries.filter(i => i.id !== id);
    this.persist(STORAGE_KEYS.INDUSTRIES, this.industries);

    this.logAudit({
      action: 'COMPANY_REMOVED',
      category: 'COMPANY_ONBOARD',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: comp.companyName,
      details: `Decommissioned corporate partner ${comp.companyName}.`,
      status: 'WARN'
    });

    this.notify();
    return true;
  }

  // Institution Credentials Management
  public updateInstitutionCredentials(id: string, patch: Partial<InstitutionLoginCredential>): InstitutionProfile {
    const idx = this.institutions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Institution with id ${id} not found`);

    const existing = this.institutions[idx];
    const currentCreds = existing.loginCredentials || getDefaultInstitutionCredentials(existing.code, existing.contactEmail || 'admin@its-blr.edu.in');
    const updatedCreds: InstitutionLoginCredential = {
      ...currentCreds,
      ...patch
    };

    const updated: InstitutionProfile = {
      ...existing,
      loginCredentials: updatedCreds
    };
    this.institutions[idx] = updated;
    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);

    this.logAudit({
      action: 'INSTITUTE_CREDENTIALS_MODIFIED',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.name,
      details: `Admin account security settings updated for ${updated.name}: Status=${updatedCreds.status}, 2FA=${updatedCreds.twoFactorEnforced}, SSO Domain=${updatedCreds.ssoDomain || 'none'}.`,
      status: updatedCreds.status === 'ACTIVE' ? 'SUCCESS' : 'WARN'
    });

    this.notify();
    return updated;
  }

  public resetInstitutionPassword(id: string): string {
    const idx = this.institutions.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Institution with id ${id} not found`);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let tempPass = 'Campus-';
    for (let i = 0; i < 8; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const existing = this.institutions[idx];
    const currentCreds = existing.loginCredentials || getDefaultInstitutionCredentials(existing.code, existing.contactEmail || 'admin@its-blr.edu.in');
    existing.loginCredentials = {
      ...currentCreds,
      temporaryPassword: tempPass,
      status: 'ACTIVE'
    };

    this.persist(STORAGE_KEYS.INSTITUTIONS, this.institutions);
    this.logAudit({
      action: 'INSTITUTE_PASSWORD_RESET',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: existing.name,
      details: `Generated new emergency temporary password for primary campus admin (${existing.loginCredentials.adminEmail}).`,
      status: 'WARN'
    });

    this.notify();
    return tempPass;
  }

  // Managed Students
  public getManagedStudents(institutionId?: string): ManagedStudent[] {
    if (!institutionId || institutionId === 'ALL') {
      return [...this.managedStudents];
    }
    return this.managedStudents.filter(s => s.institutionId === institutionId);
  }

  public addManagedStudent(data: Omit<ManagedStudent, 'id'>): ManagedStudent {
    const newStudent: ManagedStudent = {
      ...data,
      id: `mstu-${Date.now()}`
    };
    this.managedStudents = [newStudent, ...this.managedStudents];
    this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);

    this.logAudit({
      action: 'STUDENT_ENROLLED_BY_ADMIN',
      category: 'STUDENT_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: newStudent.institutionName,
      details: `Enrolled student ${newStudent.fullName} (${newStudent.usn}) in ${newStudent.branch}.`,
      status: 'SUCCESS'
    });

    this.notify();
    return newStudent;
  }

  public updateManagedStudent(id: string, patch: Partial<ManagedStudent>): ManagedStudent {
    const idx = this.managedStudents.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Student with id ${id} not found`);

    const updated: ManagedStudent = {
      ...this.managedStudents[idx],
      ...patch
    };
    this.managedStudents[idx] = updated;
    this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);

    this.logAudit({
      action: 'STUDENT_RECORD_UPDATED',
      category: 'STUDENT_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.institutionName,
      details: `Updated details or academic score for student ${updated.fullName} (${updated.usn}).`,
      status: 'INFO'
    });

    this.notify();
    return updated;
  }

  public resetStudentPassword(id: string): string {
    const idx = this.managedStudents.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Student with id ${id} not found`);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPass = 'Stu-';
    for (let i = 0; i < 6; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const student = this.managedStudents[idx];
    student.temporaryPassword = tempPass;
    student.accountStatus = 'ACTIVE';

    this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);
    this.logAudit({
      action: 'STUDENT_PASSWORD_RESET',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: student.institutionName,
      details: `Reset login credentials for student ${student.fullName} (${student.usn}).`,
      status: 'WARN'
    });

    this.notify();
    return tempPass;
  }

  public toggleStudentStatus(id: string): ManagedStudent {
    const idx = this.managedStudents.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Student with id ${id} not found`);

    const student = this.managedStudents[idx];
    student.accountStatus = student.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);

    this.logAudit({
      action: 'STUDENT_STATUS_TOGGLED',
      category: 'STUDENT_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: student.institutionName,
      details: `Student account for ${student.fullName} (${student.usn}) set to ${student.accountStatus}.`,
      status: student.accountStatus === 'ACTIVE' ? 'SUCCESS' : 'WARN'
    });

    this.notify();
    return student;
  }

  public deleteManagedStudent(id: string): boolean {
    const st = this.managedStudents.find(s => s.id === id);
    if (!st) return false;

    this.managedStudents = this.managedStudents.filter(s => s.id !== id);
    this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);

    this.logAudit({
      action: 'STUDENT_UNENROLLED',
      category: 'STUDENT_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: st.institutionName,
      details: `Unenrolled student record ${st.fullName} (${st.usn}).`,
      status: 'WARN'
    });

    this.notify();
    return true;
  }

  // Managed Mentors
  public getManagedMentors(institutionId?: string): ManagedMentor[] {
    if (!institutionId || institutionId === 'ALL') {
      return [...this.managedMentors];
    }
    return this.managedMentors.filter(m => m.institutionId === institutionId);
  }

  public addManagedMentor(data: Omit<ManagedMentor, 'id'>): ManagedMentor {
    const newMentor: ManagedMentor = {
      ...data,
      id: `mmen-${Date.now()}`
    };
    this.managedMentors = [newMentor, ...this.managedMentors];
    this.persist(STORAGE_KEYS.MANAGED_MENTORS, this.managedMentors);

    this.logAudit({
      action: 'MENTOR_ONBOARDED',
      category: 'MENTOR_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: newMentor.institutionName,
      details: `Added ${newMentor.type} mentor ${newMentor.fullName} (${newMentor.designation}).`,
      status: 'SUCCESS'
    });

    this.notify();
    return newMentor;
  }

  public updateManagedMentor(id: string, patch: Partial<ManagedMentor>): ManagedMentor {
    const idx = this.managedMentors.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Mentor with id ${id} not found`);

    const updated: ManagedMentor = {
      ...this.managedMentors[idx],
      ...patch
    };
    this.managedMentors[idx] = updated;
    this.persist(STORAGE_KEYS.MANAGED_MENTORS, this.managedMentors);

    this.logAudit({
      action: 'MENTOR_RECORD_UPDATED',
      category: 'MENTOR_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: updated.institutionName,
      details: `Updated profile or mentee capacity for ${updated.fullName}.`,
      status: 'INFO'
    });

    this.notify();
    return updated;
  }

  public resetMentorPassword(id: string): string {
    const idx = this.managedMentors.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Mentor with id ${id} not found`);

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let tempPass = 'Men-';
    for (let i = 0; i < 6; i++) {
      tempPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const mentor = this.managedMentors[idx];
    mentor.temporaryPassword = tempPass;
    mentor.accountStatus = 'ACTIVE';

    this.persist(STORAGE_KEYS.MANAGED_MENTORS, this.managedMentors);
    this.logAudit({
      action: 'MENTOR_PASSWORD_RESET',
      category: 'LOGIN_MANAGEMENT',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: mentor.institutionName,
      details: `Reset login credentials for mentor ${mentor.fullName} (${mentor.email}).`,
      status: 'WARN'
    });

    this.notify();
    return tempPass;
  }

  public toggleMentorStatus(id: string): ManagedMentor {
    const idx = this.managedMentors.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Mentor with id ${id} not found`);

    const mentor = this.managedMentors[idx];
    mentor.accountStatus = mentor.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.persist(STORAGE_KEYS.MANAGED_MENTORS, this.managedMentors);

    this.logAudit({
      action: 'MENTOR_STATUS_TOGGLED',
      category: 'MENTOR_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: mentor.institutionName,
      details: `Mentor account for ${mentor.fullName} set to ${mentor.accountStatus}.`,
      status: mentor.accountStatus === 'ACTIVE' ? 'SUCCESS' : 'WARN'
    });

    this.notify();
    return mentor;
  }

  public deleteManagedMentor(id: string): boolean {
    const m = this.managedMentors.find(men => men.id === id);
    if (!m) return false;

    this.managedMentors = this.managedMentors.filter(men => men.id !== id);
    this.persist(STORAGE_KEYS.MANAGED_MENTORS, this.managedMentors);

    this.logAudit({
      action: 'MENTOR_REMOVED',
      category: 'MENTOR_ADMIN',
      performedBy: 'Master Admin (HQ)',
      targetInstituteName: m.institutionName,
      details: `Removed mentor record for ${m.fullName}.`,
      status: 'WARN'
    });

    this.notify();
    return true;
  }

  // User Accounts & Authentication Synchronization
  public getCurrentUser(): PortalUserAccount | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public getUsers(): PortalUserAccount[] {
    return [...this.users];
  }

  public async authenticateUser(details: {
    name?: string;
    email: string;
    password?: string;
    role: UserRole;
    organization?: string;
    isSignUp?: boolean;
  }): Promise<PortalUserAccount> {
    const cleanEmail = details.email.trim().toLowerCase();
    const cleanName = details.name?.trim() || '';

    let user = this.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      const fallbackName = cleanName || (details.role === 'STUDENT' ? 'Aarav Sharma' : details.role === 'INDUSTRY' ? 'CloudScale Recruiter' : details.role === 'ACADEMICIAN' ? 'Prof. Herva Mehta' : 'Campus Administrator');
      user = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        email: cleanEmail,
        name: fallbackName,
        role: details.role,
        password: details.password || 'password123',
        organization: details.organization || (details.role === 'STUDENT' ? 'ITS Bangalore' : ''),
        updatedAt: new Date().toISOString()
      };
      this.users.push(user);
    } else {
      if (cleanName) user.name = cleanName;
      if (details.password) user.password = details.password;
      if (details.organization) user.organization = details.organization;
      user.role = details.role;
      user.updatedAt = new Date().toISOString();
    }

    this.currentUser = user;
    this.persist(STORAGE_KEYS.USERS, this.users);
    this.persist(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    syncDocToFirestore('users', user.id, user as unknown as Record<string, unknown>);

    if (details.role === 'STUDENT') {
      const studentName = user.name;
      this.student = {
        ...this.student,
        fullName: studentName,
        email: user.email,
        ...(user.organization ? { institutionName: user.organization } : {})
      };
      this.persist(STORAGE_KEYS.STUDENT, this.student);
      syncDocToFirestore('studentProfiles', this.student.id, this.student as unknown as Record<string, unknown>);

      const existingManaged = this.managedStudents.find(
        s => s.email.toLowerCase() === user.email.toLowerCase() || s.id === this.student.id
      );
      if (existingManaged) {
        existingManaged.fullName = studentName;
        existingManaged.email = user.email;
        if (user.organization) existingManaged.institutionName = user.organization;
      } else {
        this.managedStudents.unshift({
          id: this.student.id,
          fullName: studentName,
          email: user.email,
          usn: '1IT22CS089',
          institutionId: this.student.institutionId || 'inst-01',
          institutionName: this.student.institutionName,
          branch: this.student.branch,
          semester: 6,
          cgpa: this.student.cgpa,
          verifiedSkillScore: 88,
          internshipStatus: 'Seeking',
          accountStatus: 'ACTIVE',
          twoFactorEnabled: false
        });
      }
      this.persist(STORAGE_KEYS.MANAGED_STUDENTS, this.managedStudents);

      this.addNotification({
        userId: user.id,
        title: `Welcome, ${studentName}!`,
        message: `Your Skill Safar portfolio is synchronized across all active devices.`,
        type: 'SYSTEM',
        actionUrl: 'dashboard'
      });
    }

    this.notify();
    return { ...user };
  }

  public signOutUser(): void {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }
}

export const portalRepository = new PortalRepository();
