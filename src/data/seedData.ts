/**
 * Academia–Industry Collaboration Portal
 * Comprehensive Seed Data & Skill Taxonomy
 */

import {
  SkillCategory,
  SkillDefinition,
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
  SystemAuditLog,
  ServicePlanCatalogItem
} from '../types';

export const SEED_SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'cat-backend', name: 'Backend Engineering', description: 'Server-side logic, APIs, and business systems', iconName: 'Server' },
  { id: 'cat-frontend', name: 'Frontend & Web', description: 'Interactive UIs, client architecture, state management', iconName: 'Layout' },
  { id: 'cat-database', name: 'Databases & Storage', description: 'Relational & NoSQL persistence, query optimization', iconName: 'Database' },
  { id: 'cat-cloud', name: 'Cloud & DevOps', description: 'CI/CD, containerization, microservices, cloud infra', iconName: 'Cloud' },
  { id: 'cat-ai', name: 'AI & Machine Learning', description: 'Model training, prompt engineering, LLM integration, data analytics', iconName: 'Cpu' },
  { id: 'cat-soft', name: 'Professional & Soft Skills', description: 'Communication, technical writing, leadership, problem solving', iconName: 'Users' },
];

export const SEED_SKILL_DEFINITIONS: SkillDefinition[] = [
  { id: 'sk-python', name: 'Python', categoryId: 'cat-backend', aliases: ['Py', 'Python3'], description: 'Versatile language for backend, automation, and data science', industryDemandLevel: 'Very High' },
  { id: 'sk-nodejs', name: 'Node.js', categoryId: 'cat-backend', aliases: ['Node', 'Express', 'NestJS'], description: 'Event-driven JavaScript runtime for server-side apps', industryDemandLevel: 'Very High' },
  { id: 'sk-restapi', name: 'REST API Design', categoryId: 'cat-backend', aliases: ['REST', 'API', 'Web Services'], description: 'Building standardized HTTP web service contracts', industryDemandLevel: 'Very High' },
  { id: 'sk-sql', name: 'SQL & PostgreSQL', categoryId: 'cat-database', aliases: ['Postgres', 'Relational DB', 'MySQL'], description: 'Relational data modeling and complex query execution', industryDemandLevel: 'Very High' },
  { id: 'sk-react', name: 'React', categoryId: 'cat-frontend', aliases: ['React.js', 'ReactJS', 'Next.js'], description: 'Component-driven declarative frontend UI development', industryDemandLevel: 'Very High' },
  { id: 'sk-typescript', name: 'TypeScript', categoryId: 'cat-frontend', aliases: ['TS'], description: 'Statically typed superset of JavaScript for scalable web apps', industryDemandLevel: 'Very High' },
  { id: 'sk-docker', name: 'Docker & Containers', categoryId: 'cat-cloud', aliases: ['Containers', 'Containerization'], description: 'Application containerization and reproducible runtime envs', industryDemandLevel: 'Very High' },
  { id: 'sk-git', name: 'Git & Version Control', categoryId: 'cat-backend', aliases: ['GitHub', 'GitLab', 'VCS'], description: 'Distributed revision control and collaborative pull requests', industryDemandLevel: 'Very High' },
  { id: 'sk-aws', name: 'Cloud Infrastructure (AWS/GCP)', categoryId: 'cat-cloud', aliases: ['AWS', 'GCP', 'Cloud Services'], description: 'Deployment, compute instances, object storage, and serverless', industryDemandLevel: 'High' },
  { id: 'sk-comm', name: 'Technical Communication', categoryId: 'cat-soft', aliases: ['Communication', 'Presentation'], description: 'Explaining complex technical concepts clearly to stakeholders', industryDemandLevel: 'High' },
  { id: 'sk-ml', name: 'Machine Learning Fundamentals', categoryId: 'cat-ai', aliases: ['ML', 'Scikit-learn', 'PyTorch'], description: 'Predictive modeling, regression, classification, and evaluation', industryDemandLevel: 'High' },
];

export const SEED_STUDENT: StudentProfile = {
  id: 'stu-001',
  userId: 'usr-student-01',
  fullName: 'Aanal Nathvani',
  email: 'aanal.nathvani@institution.edu',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  headline: 'Pre-final Year CS Student | Backend & Cloud Enthusiast',
  bio: 'Passionate computer science undergraduate focusing on high-performance distributed backend architectures, RESTful microservices, and database optimization.',
  institutionId: 'inst-01',
  institutionName: 'Institute of Technology & Science, Bangalore',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  graduationYear: 2026,
  cgpa: 8.7,
  experienceYears: 0.5,
  preferredLocations: ['Bangalore', 'Hyderabad', 'Remote', 'Pune'],
  preferredRoles: ['Backend Engineer Intern', 'Software Developer Intern', 'Full Stack Intern'],
  careerInterests: ['Backend Engineering', 'Cloud & DevOps', 'Distributed Systems'],
  employabilityStage: 'IDENTIFY_GAPS',
  skills: [
    {
      skillId: 'sk-python',
      skillName: 'Python',
      category: 'cat-backend',
      score: 85,
      proficiency: 'Advanced',
      confidence: 90,
      evidenceSources: [
        { id: 'ev-1', sourceType: 'Assessment', title: 'Python Backend Proficiency Exam', issuerOrContext: 'Platform Assessment Engine', date: '2026-08-15', scoreOrGrade: '88%' },
        { id: 'ev-2', sourceType: 'Project', title: 'TaskFlow Distributed Queue', issuerOrContext: 'GitHub Repository', date: '2026-06-20', scoreOrGrade: 'Code Review Passed' }
      ],
      lastAssessedAt: '2026-08-15'
    },
    {
      skillId: 'sk-sql',
      skillName: 'SQL & PostgreSQL',
      category: 'cat-database',
      score: 82,
      proficiency: 'Advanced',
      confidence: 85,
      evidenceSources: [
        { id: 'ev-3', sourceType: 'Assessment', title: 'Relational Database Assessment', issuerOrContext: 'Platform Assessment Engine', date: '2026-08-10', scoreOrGrade: '84%' },
        { id: 'ev-4', sourceType: 'Certification', title: 'PostgreSQL Essentials', issuerOrContext: 'Coursera / Meta', date: '2026-05-12' }
      ],
      lastAssessedAt: '2026-08-10'
    },
    {
      skillId: 'sk-git',
      skillName: 'Git & Version Control',
      category: 'cat-backend',
      score: 90,
      proficiency: 'Expert',
      confidence: 95,
      evidenceSources: [
        { id: 'ev-5', sourceType: 'Assessment', title: 'Git & Collaboration Workflow', issuerOrContext: 'Platform Assessment Engine', date: '2026-07-28', scoreOrGrade: '95%' }
      ],
      lastAssessedAt: '2026-07-28'
    },
    {
      skillId: 'sk-restapi',
      skillName: 'REST API Design',
      category: 'cat-backend',
      score: 55,
      proficiency: 'Intermediate',
      confidence: 65,
      evidenceSources: [
        { id: 'ev-6', sourceType: 'Assessment', title: 'API Protocols & Security', issuerOrContext: 'Platform Assessment Engine', date: '2026-08-01', scoreOrGrade: '60%' }
      ],
      lastAssessedAt: '2026-08-01'
    },
    {
      skillId: 'sk-docker',
      skillName: 'Docker & Containers',
      category: 'cat-cloud',
      score: 42,
      proficiency: 'Beginner',
      confidence: 50,
      evidenceSources: [],
      lastAssessedAt: '2026-06-10'
    },
    {
      skillId: 'sk-react',
      skillName: 'React',
      category: 'cat-frontend',
      score: 65,
      proficiency: 'Intermediate',
      confidence: 70,
      evidenceSources: [
        { id: 'ev-7', sourceType: 'Project', title: 'Campus Club Event Portal', issuerOrContext: 'College Project', date: '2026-04-10' }
      ],
      lastAssessedAt: '2026-07-15'
    },
    {
      skillId: 'sk-comm',
      skillName: 'Technical Communication',
      category: 'cat-soft',
      score: 80,
      proficiency: 'Advanced',
      confidence: 85,
      evidenceSources: [
        { id: 'ev-8', sourceType: 'Industry Feedback', title: 'Campus Hackathon Finalist Presentation', issuerOrContext: 'Industry Jury Feedback', date: '2026-05-18', scoreOrGrade: 'Distinction' }
      ],
      lastAssessedAt: '2026-05-18'
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'TaskFlow Distributed Queue Engine',
      description: 'Asynchronous event streaming and message worker system built in Python, redis, and PostgreSQL with automatic retry mechanisms and dead-letter queues.',
      technologies: ['Python', 'PostgreSQL', 'Redis', 'REST API'],
      skillsDemonstrated: ['Python', 'SQL & PostgreSQL', 'REST API Design'],
      githubUrl: 'https://github.com/aanalnathvani/taskflow-engine',
      liveUrl: 'https://taskflow-demo.example.com',
      completedDate: '2026-06-20'
    },
    {
      id: 'proj-2',
      title: 'EduSphere Academic Event Discovery',
      description: 'Full-stack campus portal with student role management, RSVP tracking, and responsive event feed with real-time updates.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      skillsDemonstrated: ['React', 'TypeScript', 'SQL & PostgreSQL'],
      githubUrl: 'https://github.com/aanalnathvani/edusphere-web',
      completedDate: '2026-04-10'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      title: 'PostgreSQL Relational Database Essentials',
      issuer: 'Meta / Coursera',
      issueDate: '2026-05-12',
      credentialId: 'META-DB-99428',
      skillsCertified: ['SQL & PostgreSQL', 'Database Design']
    },
    {
      id: 'cert-2',
      title: 'Cloud Core Fundamentals',
      issuer: 'Google Cloud Platform',
      issueDate: '2026-03-01',
      credentialId: 'GCP-FUND-11029',
      skillsCertified: ['Cloud Infrastructure (AWS/GCP)']
    }
  ],
  resumes: [
    {
      id: 'res-1',
      fileName: 'Aanal_Nathvani_Backend_Resume_2026.pdf',
      fileSize: '420 KB',
      uploadedAt: '2026-08-20',
      extractedSkills: ['Python', 'SQL & PostgreSQL', 'Git & Version Control', 'REST API Design', 'React', 'Docker & Containers'],
      isDefault: true,
      summary: 'Experienced with backend microservice concepts, transactional PostgreSQL, and automated deployment pipelines.'
    },
    {
      id: 'res-2',
      fileName: 'Aanal_Nathvani_FullStack_Resume.pdf',
      fileSize: '390 KB',
      uploadedAt: '2026-07-10',
      extractedSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL'],
      isDefault: false,
      summary: 'Broad full stack engineering resume highlighting React components and server-side endpoints.'
    }
  ],
  selectedResumeId: 'res-1'
};

export const SEED_INDUSTRIES: IndustryProfile[] = [
  {
    id: 'ind-01',
    userId: 'usr-ind-01',
    companyName: 'CloudScale Technologies',
    domain: 'Cloud Infrastructure & SaaS',
    tagline: 'Empowering global enterprises with high-throughput cloud tooling',
    description: 'CloudScale builds modern cloud infrastructure, serverless observability frameworks, and enterprise developer tools trusted by Fortune 500 engineering teams.',
    website: 'https://cloudscale.example.com',
    location: 'Bangalore, India',
    isVerified: true,
    activeOpportunitiesCount: 4,
    contactEmail: 'careers@cloudscale.example.com'
  },
  {
    id: 'ind-02',
    userId: 'usr-ind-02',
    companyName: 'Nexus FinTech Labs',
    domain: 'Financial Technology & Security',
    tagline: 'Ultra-low latency financial transaction systems',
    description: 'Pioneering reliable, secure core banking payment gateways, fraud detection engines, and compliance automation platforms.',
    website: 'https://nexusfintech.example.com',
    location: 'Hyderabad, India',
    isVerified: true,
    activeOpportunitiesCount: 3,
    contactEmail: 'talent@nexusfintech.example.com'
  },
  {
    id: 'ind-03',
    userId: 'usr-ind-03',
    companyName: 'BioHealth Analytics',
    domain: 'Healthcare & Data Science',
    tagline: 'Translating biological data into clinical breakthroughs',
    description: 'Transforming clinical diagnostics and patient care with predictive AI models, genomic pipeline orchestration, and secure data sharing.',
    website: 'https://biohealth.example.com',
    location: 'Pune / Remote',
    isVerified: true,
    activeOpportunitiesCount: 2,
    contactEmail: 'recruit@biohealth.example.com'
  }
];

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-101',
    industryId: 'ind-01',
    companyName: 'CloudScale Technologies',
    title: 'Backend Engineering Intern (Python & Cloud)',
    opportunityType: 'Internship',
    domain: 'Backend Engineering',
    location: 'Bangalore, India',
    isRemote: false,
    duration: '6 Months',
    stipendOrSalary: '₹45,000 / month',
    requiredSkills: ['Python', 'SQL & PostgreSQL', 'Git & Version Control', 'REST API Design'],
    preferredSkills: ['Docker & Containers', 'Cloud Infrastructure (AWS/GCP)'],
    eligibility: {
      degree: ['B.Tech', 'B.E.', 'M.Tech'],
      branches: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      minGraduationYear: 2025,
      maxGraduationYear: 2027,
      minCgpa: 7.5,
      minExperienceYears: 0
    },
    description: 'Join our Cloud Platform team to design high-throughput REST APIs, build robust data ingestion pipelines, and optimize relational database queries for our enterprise analytics service.',
    responsibilities: [
      'Implement modular server-side microservice endpoints in Python',
      'Optimize relational PostgreSQL schema indexes and queries',
      'Write comprehensive unit and integration tests with CI/CD integration',
      'Collaborate with senior distributed systems architects during design reviews'
    ],
    perks: ['Pre-Placement Offer (PPO) Eligibility', 'Flexible Work Hours', 'Laptop & Health Insurance', 'Mentorship from Staff Engineers'],
    applicationDeadline: '2026-10-15',
    status: 'PUBLISHED',
    createdAt: '2026-08-10',
    publishedAt: '2026-08-12',
    totalApplicants: 24
  },
  {
    id: 'opp-102',
    industryId: 'ind-02',
    companyName: 'Nexus FinTech Labs',
    title: 'Junior Software Engineer (Full Stack / Node.js & React)',
    opportunityType: 'Job',
    domain: 'Financial Technology',
    location: 'Hyderabad, India',
    isRemote: true,
    duration: 'Full-time',
    stipendOrSalary: '₹14,00,000 / year',
    requiredSkills: ['Node.js', 'React', 'TypeScript', 'SQL & PostgreSQL'],
    preferredSkills: ['REST API Design', 'Docker & Containers'],
    eligibility: {
      degree: ['B.Tech', 'B.E.', 'MCA'],
      branches: ['Computer Science', 'Information Science', 'Electrical'],
      minGraduationYear: 2024,
      maxGraduationYear: 2026,
      minCgpa: 8.0,
      minExperienceYears: 0
    },
    description: 'Looking for enthusiastic engineers to build next-generation merchant dashboards and instant settlement workflows with strong focus on type safety and audit trails.',
    responsibilities: [
      'Build reactive financial management dashboards with React & TypeScript',
      'Craft resilient Node.js microservices handling transaction validation',
      'Maintain 99.99% uptime operational standards'
    ],
    perks: ['Remote-first Culture', 'Annual Learning Allowance', 'Stock Options (ESOPs)', 'Comprehensive Medical Cover'],
    applicationDeadline: '2026-10-30',
    status: 'PUBLISHED',
    createdAt: '2026-08-15',
    publishedAt: '2026-08-18',
    totalApplicants: 42
  },
  {
    id: 'opp-103',
    industryId: 'ind-01',
    companyName: 'CloudScale Technologies',
    title: 'Cloud DevOps & Containerization Apprentice',
    opportunityType: 'Apprenticeship',
    domain: 'Cloud & DevOps',
    location: 'Bangalore, India',
    isRemote: true,
    duration: '3 Months',
    stipendOrSalary: '₹35,000 / month',
    requiredSkills: ['Docker & Containers', 'Cloud Infrastructure (AWS/GCP)', 'Git & Version Control'],
    preferredSkills: ['Python', 'Technical Communication'],
    eligibility: {
      degree: ['B.Tech', 'B.E.', 'B.Sc Computer Science'],
      branches: ['Computer Science', 'IT'],
      minGraduationYear: 2025,
      maxGraduationYear: 2027,
      minCgpa: 7.0,
      minExperienceYears: 0
    },
    description: 'Hands-on apprenticeship building Kubernetes cluster deployments, optimizing Docker container footprints, and maintaining automated GitHub Actions pipelines.',
    responsibilities: [
      'Package microservices into hardened, multi-stage Docker images',
      'Deploy test environments on Google Cloud Platform',
      'Monitor container memory utilization and set up telemetry alerts'
    ],
    perks: ['Official Cloud Certification Sponsorship', 'Certificate of Completion', 'Direct Conversion to Full-time'],
    applicationDeadline: '2026-09-30',
    status: 'PUBLISHED',
    createdAt: '2026-08-22',
    publishedAt: '2026-08-25',
    totalApplicants: 18
  },
  {
    id: 'opp-104',
    industryId: 'ind-03',
    companyName: 'BioHealth Analytics',
    title: 'AI & Data Science Research Project Intern',
    opportunityType: 'Live Project',
    domain: 'Healthcare & AI',
    location: 'Pune / Remote',
    isRemote: true,
    duration: '4 Months',
    stipendOrSalary: '₹40,000 / month',
    requiredSkills: ['Python', 'Machine Learning Fundamentals', 'SQL & PostgreSQL'],
    preferredSkills: ['REST API Design', 'Technical Communication'],
    eligibility: {
      degree: ['B.Tech', 'M.Tech', 'M.Sc Data Science'],
      branches: ['Computer Science', 'Data Science', 'Biomedical Engineering'],
      minGraduationYear: 2025,
      maxGraduationYear: 2027,
      minCgpa: 8.0,
      minExperienceYears: 0
    },
    description: 'Work on live clinical dataset pattern recognition, model evaluation pipelines, and research paper publications with our biomedical team.',
    responsibilities: [
      'Clean and prepare multi-center medical sensor time-series data',
      'Train baseline classification models and benchmark metrics',
      'Document experimental findings for joint academia-industry symposiums'
    ],
    perks: ['Co-authorship on Industry Research Publications', 'Dedicated Academic Mentor', 'Compute Credit Stipend'],
    applicationDeadline: '2026-11-05',
    status: 'PUBLISHED',
    createdAt: '2026-08-28',
    publishedAt: '2026-08-30',
    totalApplicants: 12
  }
];

export const SEED_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    opportunityId: 'opp-101',
    opportunityTitle: 'Backend Engineering Intern (Python & Cloud)',
    companyName: 'CloudScale Technologies',
    opportunityType: 'Internship',
    studentId: 'stu-001',
    studentName: 'Aanal Nathvani',
    studentEmail: 'aanal.nathvani@institution.edu',
    studentDegree: 'B.Tech',
    studentBranch: 'Computer Science & Engineering',
    resumeId: 'res-1',
    coverNote: 'I have demonstrated strong proficiency in Python and PostgreSQL through my distributed queue project TaskFlow and look forward to contributing to CloudScale.',
    status: 'SHORTLISTED',
    matchScore: 88,
    appliedAt: '2026-08-16T10:30:00Z',
    interviewDate: '2026-09-15T14:00:00Z',
    statusHistory: [
      { status: 'APPLIED', timestamp: '2026-08-16T10:30:00Z', note: 'Application submitted with Aanal_Nathvani_Backend_Resume_2026.pdf', changedBy: 'Aanal Nathvani' },
      { status: 'UNDER_REVIEW', timestamp: '2026-08-18T09:15:00Z', note: 'Profile screened by CloudScale Talent Acquisition', changedBy: 'DevOps Hiring Team' },
      { status: 'SHORTLISTED', timestamp: '2026-08-24T16:00:00Z', note: 'Shortlisted for Technical Interview Round 1', changedBy: 'Lead Architect' }
    ]
  }
];

export const SEED_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q-py-1',
    categoryId: 'cat-backend',
    skillTarget: 'Python',
    difficulty: 'Medium',
    questionText: 'What is the output of evaluating list comprehension with variable binding in Python?',
    codeSnippet: 'funcs = [lambda x, i=i: x * i for i in range(3)]\nprint([f(2) for f in funcs])',
    options: ['[0, 2, 4]', '[4, 4, 4]', '[0, 1, 2]', 'TypeError: lambda missing argument'],
    correctOptionIndex: 0,
    explanation: 'By setting default argument i=i, each lambda binds the current value of i at definition time rather than closing over the final loop value.'
  },
  {
    id: 'q-py-2',
    categoryId: 'cat-backend',
    skillTarget: 'Python',
    difficulty: 'Medium',
    questionText: 'In Python async/await, which construct is best suited to execute multiple I/O coroutines concurrently and gather their results in order?',
    options: ['asyncio.gather(*tasks)', 'asyncio.run_all(tasks)', 'threading.join(tasks)', 'concurrent.sync(tasks)'],
    correctOptionIndex: 0,
    explanation: 'asyncio.gather schedules all awaitables concurrently on the event loop and returns an ordered list of future results.'
  },
  {
    id: 'q-api-1',
    categoryId: 'cat-backend',
    skillTarget: 'REST API Design',
    difficulty: 'Medium',
    questionText: 'Which HTTP method should be used according to RFC 7231 for idempotent, full replacement of an existing resource?',
    options: ['PUT', 'PATCH', 'POST', 'UPDATE'],
    correctOptionIndex: 0,
    explanation: 'PUT replaces the target resource entirely and is defined as idempotent. PATCH is intended for partial delta updates.'
  },
  {
    id: 'q-api-2',
    categoryId: 'cat-backend',
    skillTarget: 'REST API Design',
    difficulty: 'Hard',
    questionText: 'How should an API respond when a client sends an "If-Match" header that does not match the current resource ETag?',
    options: ['412 Precondition Failed', '409 Conflict', '400 Bad Request', '404 Not Found'],
    correctOptionIndex: 0,
    explanation: '412 Precondition Failed indicates that one or more conditions in the request header fields evaluated to false.'
  },
  {
    id: 'q-dock-1',
    categoryId: 'cat-cloud',
    skillTarget: 'Docker & Containers',
    difficulty: 'Medium',
    questionText: 'What is the primary benefit of using multi-stage builds in a Dockerfile for production deployments?',
    options: [
      'Significantly reduces the final image size by discarding build-time SDKs and intermediate artifacts',
      'Allows containers to run faster with multithreaded kernel execution',
      'Automatically generates unit test reports during image compilation',
      'Encrypts the image layers with TLS certificates'
    ],
    correctOptionIndex: 0,
    explanation: 'Multi-stage builds allow you to use a heavy builder image for compiling code, and copy only the final binary into a minimal scratch/alpine base image.'
  },
  {
    id: 'q-sql-1',
    categoryId: 'cat-database',
    skillTarget: 'SQL & PostgreSQL',
    difficulty: 'Medium',
    questionText: 'Which index type in PostgreSQL is best suited for equality and range queries on standard scalar types like integers and timestamps?',
    options: ['B-tree', 'GIN', 'GiST', 'Hash'],
    correctOptionIndex: 0,
    explanation: 'B-tree is the default and optimal index structure in PostgreSQL for sorting, range comparisons (<, <=, =, >=, >), and exact lookups.'
  },
  {
    id: 'q-react-1',
    categoryId: 'cat-frontend',
    skillTarget: 'React',
    difficulty: 'Medium',
    questionText: 'When using useEffect in React, what happens if you omit the dependency array entirely?',
    options: [
      'The effect callback runs after every single render of the component',
      'The effect runs only once when mounted',
      'The component fails to compile with a syntax error',
      'The effect never executes'
    ],
    correctOptionIndex: 0,
    explanation: 'Without a dependency array, React executes the effect on every commit phase (after mount and after every render).'
  }
];

export const SEED_LEARNING_PROGRAMS: LearningProgram[] = [
  {
    id: 'learn-01',
    title: 'Enterprise REST API Architecture & Security Masterclass',
    provider: 'Industry Academy & Tech Consortium',
    type: 'Course',
    targetSkill: 'REST API Design',
    category: 'cat-backend',
    difficulty: 'Intermediate',
    durationHours: 12,
    description: 'Master rate limiting, OAuth2 Bearer token flows, RFC error standard formats (RFC 7807), and API contract testing with OpenAPI 3.1.',
    syllabus: [
      'Resource Modeling & URI Semantics',
      'Idempotency, ETags & Optimistic Concurrency',
      'Rate Limiting & Token Bucket Algorithms',
      'API Versioning Strategies & Automated Testing'
    ],
    scoreBoost: 25
  },
  {
    id: 'learn-02',
    title: 'Production Docker Containers & Microservices Zero to Hero',
    provider: 'Cloud Native Computing Foundation Lab',
    type: 'Workshop',
    targetSkill: 'Docker & Containers',
    category: 'cat-cloud',
    difficulty: 'Beginner',
    durationHours: 8,
    description: 'Learn Docker daemon internals, writing hardened multi-stage Dockerfiles, Docker Compose networking, and image vulnerability scanning.',
    syllabus: [
      'Container Architecture & Namespaces/Cgroups',
      'Multi-stage Dockerfile Optimization',
      'Environment Variables & Secret Mounts',
      'Container Security Hardening with Trivy'
    ],
    scoreBoost: 30
  },
  {
    id: 'learn-03',
    title: 'Cloud Infrastructure with Terraform & GCP',
    provider: 'CloudScale Industry Labs',
    type: 'Certification',
    targetSkill: 'Cloud Infrastructure (AWS/GCP)',
    category: 'cat-cloud',
    difficulty: 'Intermediate',
    durationHours: 16,
    description: 'Automate compute instances, Cloud Run containers, IAM least-privilege policies, and Cloud Storage buckets using Infrastructure-as-Code.',
    syllabus: [
      'Declarative Infrastructure as Code Fundamentals',
      'Container Deployment on Google Cloud Run',
      'VPC Networks, Subnets & Cloud Firewall Rules',
      'Continuous Delivery with GitHub Actions'
    ],
    scoreBoost: 25
  }
];

export const SEED_ACADEMICIANS: AcademicianProfile[] = [
  {
    id: 'acad-01',
    userId: 'usr-acad-01',
    fullName: 'Prof. Herva Mehta',
    institutionName: 'Institute of Technology & Science, Bangalore',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Distributed Systems Lab',
    researchInterests: ['Cloud Computing', 'Distributed Consensus', 'Decentralized Ledgers', 'Edge Computing'],
    consultancyAreas: ['Enterprise Architecture Review', 'High-Availability Database Design'],
    publicationsCount: 42,
    openForFacultyInternship: true,
    openForIndustryJointResearch: true,
    email: 'herva.mehta@institution.edu'
  },
  {
    id: 'acad-02',
    userId: 'usr-acad-02',
    fullName: 'Dr. Ananya Mukherjee',
    institutionName: 'National Institute of Technology',
    department: 'Artificial Intelligence & Data Engineering',
    designation: 'Associate Professor',
    researchInterests: ['Medical NLP', 'Explainable AI', 'Federated Learning'],
    consultancyAreas: ['AI Model Governance', 'Biomedical Dataset Auditing'],
    publicationsCount: 28,
    openForFacultyInternship: true,
    openForIndustryJointResearch: true,
    email: 'ananya.m@nit.edu'
  }
];

export const SEED_INSTITUTIONS: InstitutionProfile[] = [
  {
    id: 'inst-01',
    name: 'Institute of Technology & Science, Bangalore',
    code: 'ITS-BLR',
    location: 'Bangalore, Karnataka',
    state: 'Karnataka',
    contactPerson: 'Dr. Radhakrishnan Nair (Dean of Academics)',
    contactEmail: 'dean.academics@its-blr.edu.in',
    contactPhone: '+91 80 2839 4001',
    naacGrade: 'A++',
    nirfRank: 18,
    totalStudents: 3400,
    placedPercentage: 88,
    status: 'ACTIVE',
    joinedDate: '2025-06-15',
    departments: [
      'Computer Science & Engineering',
      'Information Technology',
      'Electronics & Communication',
      'Data Science & AI',
      'Mechanical Engineering'
    ],
    subscription: {
      planTier: 'ENTERPRISE',
      contractValueInr: 1850000,
      billingCycle: 'Annual',
      startDate: '2026-01-01',
      renewalDate: '2026-12-31',
      totalStudentSeats: 4000,
      allocatedStudentSeats: 3400,
      accountManagerName: 'Vikram Sethi (Skill Safar Senior Enterprise Partner)',
      accountManagerEmail: 'vikram.sethi@skillsafar.internal',
      contractStatus: 'Active',
      lastInvoiceNumber: 'INV-2026-089',
      modules: {
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: true,
        naacNirfAnalytics: true,
        customBrandingSso: true
      }
    }
  },
  {
    id: 'inst-02',
    name: 'Vellore Global Institute of Engineering',
    code: 'VGIE-TN',
    location: 'Vellore, Tamil Nadu',
    state: 'Tamil Nadu',
    contactPerson: 'Prof. K. Sundararajan (Placement Director)',
    contactEmail: 'placement.director@vgie.edu.in',
    contactPhone: '+91 416 220 2000',
    naacGrade: 'A+',
    nirfRank: 32,
    totalStudents: 4200,
    placedPercentage: 84,
    status: 'ACTIVE',
    joinedDate: '2025-11-20',
    departments: [
      'Computer Science',
      'Information Technology',
      'Robotics & Automation',
      'Electrical & Electronics',
      'Biomedical Engineering'
    ],
    subscription: {
      planTier: 'PROFESSIONAL',
      contractValueInr: 850000,
      billingCycle: 'Annual',
      startDate: '2026-02-01',
      renewalDate: '2027-01-31',
      totalStudentSeats: 4500,
      allocatedStudentSeats: 4200,
      accountManagerName: 'Priya Nambiar (Skill Safar Lead)',
      accountManagerEmail: 'priya.nambiar@skillsafar.internal',
      contractStatus: 'Active',
      lastInvoiceNumber: 'INV-2026-114',
      modules: {
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: true,
        naacNirfAnalytics: true,
        customBrandingSso: false
      }
    }
  },
  {
    id: 'inst-03',
    name: 'Pune Polytechnic & Research University',
    code: 'PPRU-MH',
    location: 'Pune, Maharashtra',
    state: 'Maharashtra',
    contactPerson: 'Dr. Meenakshi Joshi (Registrar)',
    contactEmail: 'registrar@ppru.ac.in',
    contactPhone: '+91 20 2569 8000',
    naacGrade: 'A',
    nirfRank: 54,
    totalStudents: 1600,
    placedPercentage: 76,
    status: 'TRIAL',
    joinedDate: '2026-08-01',
    departments: [
      'Computer Engineering',
      'Artificial Intelligence & Data Science',
      'Mechanical & Mechatronics'
    ],
    subscription: {
      planTier: 'PILOT',
      contractValueInr: 150000,
      billingCycle: '90-Day Pilot',
      startDate: '2026-08-01',
      renewalDate: '2026-10-31',
      totalStudentSeats: 2000,
      allocatedStudentSeats: 1600,
      accountManagerName: 'Amitabh Sen (Skill Safar Onboarding)',
      accountManagerEmail: 'amitabh.sen@skillsafar.internal',
      contractStatus: 'Trial Active',
      lastInvoiceNumber: 'INV-PILOT-042',
      modules: {
        skillAssessmentEngine: true,
        mcpAiCareerAdvisor: true,
        industryRecruiterBridge: true,
        facultyResearchHub: false,
        naacNirfAnalytics: false,
        customBrandingSso: false
      }
    }
  }
];

export const SEED_SERVICE_PLANS: ServicePlanCatalogItem[] = [
  {
    tier: 'PILOT',
    name: 'Campus Pilot (90 Days)',
    tagline: 'Rapid proof-of-value for upcoming placement season & single batch validation',
    annualPriceInr: 150000,
    recommendedStudents: 'Up to 2,000 Students',
    modulesIncluded: [
      'Skill Assessment Engine & Verifiable Proof Ledger',
      'MCP AI Grounded Career Advisor',
      'Industry Recruiter Discovery & Job Matcher'
    ]
  },
  {
    tier: 'STANDARD',
    name: 'Standard Campus Edition',
    tagline: 'Core employability platform for mid-sized colleges seeking proven outcome lifts',
    annualPriceInr: 450000,
    recommendedStudents: 'Up to 3,000 Students',
    modulesIncluded: [
      'Skill Assessment Engine & Verifiable Proof Ledger',
      'MCP AI Grounded Career Advisor',
      'Industry Recruiter Discovery & Job Matcher',
      'Faculty Research & Guest Lecture Linkage'
    ]
  },
  {
    tier: 'PROFESSIONAL',
    name: 'Professional Placement & R&D Suite',
    tagline: 'Comprehensive placement intelligence, faculty immersion, and NAAC reporting',
    annualPriceInr: 850000,
    recommendedStudents: 'Up to 5,000 Students',
    popularBadge: true,
    modulesIncluded: [
      'Skill Assessment Engine & Verifiable Proof Ledger',
      'MCP AI Grounded Career Advisor',
      'Industry Recruiter Discovery & Job Matcher',
      'Faculty Joint R&D & Summer Sabbatical Portal',
      'NAAC Criteria 5 & NIRF Placement Analytics Engine'
    ]
  },
  {
    tier: 'ENTERPRISE',
    name: 'Enterprise Multi-Campus University MoU',
    tagline: 'Full university-wide deployment with custom SSO, SLA guarantee, and dedicated customer success architect',
    annualPriceInr: 1850000,
    recommendedStudents: 'Unlimited / Multi-Campus (10k+)',
    modulesIncluded: [
      'All Professional Features Included',
      'Custom Campus Subdomain & Single Sign-On (SAML/OAuth2)',
      'Dedicated Skill Safar Partner & Account Manager',
      'Bespoke Curriculum Gap Advisory to Academic Councils',
      'Co-branded Verifiable Credentials on Cryptographic Ledger',
      'Priority Industry Recruiter Exclusive Drives'
    ]
  }
];

export const SEED_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-001',
    action: 'SERVICE_TIER_ASSIGNED',
    category: 'PLAN_UPGRADE',
    performedBy: 'Skill Safar Ops (Internal Team)',
    targetInstituteName: 'Institute of Technology & Science, Bangalore',
    timestamp: '2026-08-30T10:15:00Z',
    details: 'Contract renewed under Enterprise Tier (INR 18,50,000). Added 600 additional student license seats (Total: 4,000).',
    status: 'SUCCESS'
  },
  {
    id: 'log-002',
    action: 'INSTITUTE_ONBOARDED',
    category: 'INSTITUTE_PROVISION',
    performedBy: 'Amitabh Sen (Onboarding Team)',
    targetInstituteName: 'Pune Polytechnic & Research University',
    timestamp: '2026-08-01T08:30:00Z',
    details: 'Provisioned 90-Day Pilot license for 1,600 students across 3 engineering departments.',
    status: 'SUCCESS'
  },
  {
    id: 'log-003',
    action: 'MODULE_ENABLED',
    category: 'SERVICE_CHANGE',
    performedBy: 'Priya Nambiar (Account Lead)',
    targetInstituteName: 'Vellore Global Institute of Engineering',
    timestamp: '2026-07-14T14:40:00Z',
    details: 'Activated NAAC & NIRF Accreditation Analytics module following mid-term evaluation review.',
    status: 'INFO'
  },
  {
    id: 'log-004',
    action: 'SECURITY_AUDIT_PASSED',
    category: 'SECURITY',
    performedBy: 'Skill Safar Security Engine',
    timestamp: '2026-08-28T18:00:00Z',
    details: 'FERPA & Indian Digital Personal Data Protection (DPDP) compliance verification check passed for all enrolled institutes.',
    status: 'SUCCESS'
  }
];

export const SEED_FACULTY_COLLABORATIONS: FacultyCollaboration[] = [
  {
    id: 'collab-01',
    title: 'Industry Faculty Immersion in Cloud Native SRE',
    type: 'Faculty Internship',
    industryPartner: 'CloudScale Technologies',
    domain: 'Cloud Infrastructure & SRE',
    duration: '6 Weeks (Summer)',
    location: 'Bangalore / Hybrid',
    description: 'Faculty immersion inside CloudScale live SRE engineering pods to understand telemetry at scale and modernize university cloud curriculum.',
    stipendOrGrant: '₹1,20,000 Academic Grant',
    status: 'OPEN',
    deadline: '2026-10-31'
  },
  {
    id: 'collab-02',
    title: 'Joint R&D in Federated AI for Privacy-Preserving Healthcare',
    type: 'Joint R&D',
    industryPartner: 'BioHealth Analytics',
    domain: 'Healthcare & AI',
    duration: '1 Year Joint Project',
    location: 'Bangalore & NIT Lab',
    description: 'Co-funded research initiative on decentralized model training over encrypted medical records with mutual IP and co-authorship agreements.',
    stipendOrGrant: '₹18,50,000 Co-funding Grant',
    status: 'OPEN',
    deadline: '2026-11-30'
  },
  {
    id: 'collab-03',
    title: 'Faculty Development Program (FDP) on Production Microservices',
    type: 'FDP',
    industryPartner: 'Nexus FinTech Labs',
    domain: 'Financial Technology Architecture',
    duration: '5 Days Interactive Workshop',
    location: 'Campus Auditorium & Virtual',
    description: 'Intensive training for 50+ faculty members on event-driven financial messaging, PCI-DSS compliance, and zero-trust authentication.',
    stipendOrGrant: 'Fully Sponsored by Nexus Labs',
    status: 'OPEN',
    deadline: '2026-10-15'
  }
];

export const SEED_NOTIFICATIONS: PlatformNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-01',
    title: 'Shortlisted for Technical Interview!',
    message: 'CloudScale Technologies has shortlisted your application for Backend Engineering Intern. Check scheduled interview details.',
    type: 'APPLICATION',
    read: false,
    createdAt: '2026-08-24T16:00:00Z',
    actionUrl: 'applications'
  },
  {
    id: 'notif-2',
    userId: 'usr-student-01',
    title: 'High Compatibility Opportunity Match',
    message: 'New posting "Junior Software Engineer (Full Stack)" by Nexus FinTech Labs matches 85% of your verified skills.',
    type: 'MATCH',
    read: false,
    createdAt: '2026-08-20T11:00:00Z',
    actionUrl: 'opportunities'
  },
  {
    id: 'notif-3',
    userId: 'usr-student-01',
    title: 'Skill Assessment Available',
    message: 'Bridge your Docker & Cloud gaps: take the new assessment or enroll in the sponsored workshop.',
    type: 'ASSESSMENT',
    read: true,
    createdAt: '2026-08-15T09:00:00Z',
    actionUrl: 'assessments'
  }
];
