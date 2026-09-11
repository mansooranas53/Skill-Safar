/**
 * Academia–Industry Collaboration Portal
 * Core Domain Models & Application Contracts
 */

export type UserRole = 
  | 'STUDENT'
  | 'INDUSTRY'
  | 'ACADEMICIAN'
  | 'INSTITUTION_ADMIN'
  | 'SUPER_ADMIN';

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type EvidenceSourceType = 'Assessment' | 'Project' | 'Certification' | 'Internship' | 'Industry Feedback';

export interface SkillEvidence {
  id: string;
  sourceType: EvidenceSourceType;
  title: string;
  issuerOrContext: string;
  date: string;
  verificationUrl?: string;
  scoreOrGrade?: string;
}

export interface SkillScore {
  skillId: string;
  skillName: string;
  category: string;
  score: number; // 0 to 100
  proficiency: ProficiencyLevel;
  confidence: number; // 0 to 100
  evidenceSources: SkillEvidence[];
  lastAssessedAt?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  categoryId: string;
  aliases: string[];
  description: string;
  industryDemandLevel: 'Very High' | 'High' | 'Moderate';
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  skillsDemonstrated: string[];
  githubUrl?: string;
  liveUrl?: string;
  completedDate: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  skillsCertified: string[];
  verificationUrl?: string;
}

export interface ResumeDocument {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  extractedSkills: string[];
  isDefault: boolean;
  summary: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  headline: string;
  bio: string;
  institutionId: string;
  institutionName: string;
  degree: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  experienceYears: number;
  preferredLocations: string[];
  preferredRoles: string[];
  careerInterests: string[];
  skills: SkillScore[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  resumes: ResumeDocument[];
  selectedResumeId?: string;
  employabilityStage: 'ASSESS' | 'IDENTIFY_GAPS' | 'LEARN' | 'MATCH' | 'APPLY' | 'EXPERIENCE';
}

export interface CompanyAccountCredential {
  loginEmail: string;
  username: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  lastLoginAt?: string;
  twoFactorEnabled: boolean;
  temporaryPassword?: string;
}

export interface IndustryProfile {
  id: string;
  userId: string;
  companyName: string;
  domain: string;
  tagline: string;
  description: string;
  website: string;
  location: string;
  logoUrl?: string;
  isVerified: boolean;
  activeOpportunitiesCount: number;
  contactEmail: string;
  contactPerson?: string;
  contactPhone?: string;
  partnershipTier?: 'PLATINUM' | 'GOLD' | 'PILOT' | 'STANDARD';
  mouSigned?: boolean;
  mouExpiryDate?: string;
  credentials?: CompanyAccountCredential;
}

export interface AcademicianProfile {
  id: string;
  userId: string;
  fullName: string;
  institutionName: string;
  department: string;
  designation: string;
  researchInterests: string[];
  consultancyAreas: string[];
  publicationsCount: number;
  openForFacultyInternship: boolean;
  openForIndustryJointResearch: boolean;
  email: string;
}

export type ServiceTier = 'PILOT' | 'STANDARD' | 'PROFESSIONAL' | 'ENTERPRISE';
export type InstituteStatus = 'ACTIVE' | 'ONBOARDING' | 'TRIAL' | 'SUSPENDED';

export interface ServiceModuleConfig {
  skillAssessmentEngine: boolean;
  mcpAiCareerAdvisor: boolean;
  industryRecruiterBridge: boolean;
  facultyResearchHub: boolean;
  naacNirfAnalytics: boolean;
  customBrandingSso: boolean;
}

export interface InstituteSubscription {
  planTier: ServiceTier;
  contractValueInr: number;
  billingCycle: 'Annual' | 'Quarterly' | 'Multi-Year (3 Years)' | '90-Day Pilot';
  startDate: string;
  renewalDate: string;
  totalStudentSeats: number;
  allocatedStudentSeats: number;
  accountManagerName: string;
  accountManagerEmail: string;
  modules: ServiceModuleConfig;
  contractStatus: 'Active' | 'Pending Renewal' | 'Payment Due' | 'Trial Active';
  lastInvoiceNumber?: string;
}

export interface InstitutionLoginCredential {
  adminEmail: string;
  adminUsername: string;
  status: 'ACTIVE' | 'LOCKED' | 'SUSPENDED';
  lastLoginAt?: string;
  ssoDomain?: string;
  temporaryPassword?: string;
  twoFactorEnforced: boolean;
  activeSessionsCount?: number;
}

export interface InstitutionProfile {
  id: string;
  name: string;
  code: string;
  location: string;
  state?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  naacGrade: string;
  nirfRank?: number;
  totalStudents: number;
  placedPercentage: number;
  departments: string[];
  status?: InstituteStatus;
  joinedDate?: string;
  subscription?: InstituteSubscription;
  loginCredentials?: InstitutionLoginCredential;
}

export interface ManagedStudent {
  id: string;
  usn: string;
  fullName: string;
  email: string;
  institutionId: string;
  institutionName: string;
  branch: string;
  semester: number;
  cgpa: number;
  verifiedSkillScore: number;
  internshipStatus: 'Placed' | 'Interviewing' | 'Seeking' | 'Not Eligible';
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  lastActiveAt?: string;
  mentorId?: string;
  mentorName?: string;
  temporaryPassword?: string;
  twoFactorEnabled: boolean;
}

export interface ManagedMentor {
  id: string;
  fullName: string;
  email: string;
  institutionId?: string;
  institutionName: string;
  type: 'FACULTY' | 'INDUSTRY';
  departmentOrCompany: string;
  designation: string;
  assignedMenteesCount: number;
  maxMenteesCapacity: number;
  specialization: string[];
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  lastActiveAt?: string;
  temporaryPassword?: string;
  twoFactorEnabled: boolean;
}

export interface SystemAuditLog {
  id: string;
  action: string;
  category:
    | 'INSTITUTE_PROVISION'
    | 'SERVICE_CHANGE'
    | 'PLAN_UPGRADE'
    | 'LICENSE_SEATS'
    | 'SECURITY'
    | 'COMPANY_ONBOARD'
    | 'LOGIN_MANAGEMENT'
    | 'STUDENT_ADMIN'
    | 'MENTOR_ADMIN';
  performedBy: string;
  targetInstituteName?: string;
  timestamp: string;
  details: string;
  status: 'SUCCESS' | 'WARN' | 'INFO';
}

export interface ServicePlanCatalogItem {
  tier: ServiceTier;
  name: string;
  tagline: string;
  annualPriceInr: number;
  recommendedStudents: string;
  modulesIncluded: string[];
  popularBadge?: boolean;
}

export type OpportunityType = 'Internship' | 'Job' | 'Apprenticeship' | 'Live Project' | 'Training';
export type OpportunityStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface OpportunityRequirement {
  degree: string[];
  branches: string[];
  minGraduationYear?: number;
  maxGraduationYear?: number;
  minCgpa?: number;
  minExperienceYears?: number;
}

export interface Opportunity {
  id: string;
  industryId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  opportunityType: OpportunityType;
  domain: string;
  location: string;
  isRemote: boolean;
  duration: string; // e.g., '3 Months', '6 Months', 'Full-time'
  stipendOrSalary: string; // e.g., '$1,500/mo', '$85,000/yr'
  requiredSkills: string[];
  preferredSkills: string[];
  eligibility: OpportunityRequirement;
  description: string;
  responsibilities: string[];
  perks: string[];
  applicationDeadline: string;
  status: OpportunityStatus;
  createdAt: string;
  publishedAt?: string;
  totalApplicants: number;
}

export type ApplicationStatus = 
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'SELECTED'
  | 'REJECTED';

export interface ApplicationStatusHistory {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
  changedBy: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  companyName: string;
  opportunityType: OpportunityType;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentDegree: string;
  studentBranch: string;
  resumeId: string;
  coverNote?: string;
  status: ApplicationStatus;
  statusHistory: ApplicationStatusHistory[];
  matchScore: number;
  appliedAt: string;
  interviewDate?: string;
}

export interface MatchExplanation {
  overallScore: number;
  skillCompatibilityScore: number;
  eligibilityScore: number;
  careerInterestScore: number;
  preferencesScore: number;
  matchedSkills: string[];
  missingRequiredSkills: string[];
  matchedPreferredSkills: string[];
  eligibilityStatus: 'EL_MET' | 'EL_PARTIAL' | 'EL_MISMATCH';
  eligibilityDetails: string[];
  recommendationSummary: string;
}

export interface AssessmentQuestion {
  id: string;
  categoryId: string;
  skillTarget: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  completedAt: string;
  updatedSkills: {
    skillName: string;
    newScore: number;
    proficiency: ProficiencyLevel;
  }[];
}

export interface LearningProgram {
  id: string;
  title: string;
  provider: string;
  type: 'Course' | 'Certification' | 'Workshop' | 'Live Bootcamp';
  targetSkill: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  description: string;
  syllabus: string[];
  isCompleted?: boolean;
  scoreBoost: number; // Potential score points gained
}

export interface PlatformNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'MATCH' | 'ASSESSMENT' | 'SYSTEM';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface FacultyCollaboration {
  id: string;
  title: string;
  type: 'Faculty Internship' | 'Joint R&D' | 'FDP' | 'Consultancy' | 'Guest Lecture';
  industryPartner: string;
  domain: string;
  duration: string;
  location: string;
  description: string;
  stipendOrGrant: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  deadline: string;
}
