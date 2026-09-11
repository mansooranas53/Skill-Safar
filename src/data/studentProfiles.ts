import { StudentProfile, ManagedStudent, SkillScore, ProjectItem, CertificationItem, ResumeDocument } from '../types';
import { SEED_STUDENT } from './seedData';

// Map of comprehensive student profiles for all seed managed students
export const DETAILED_STUDENT_PROFILES: Record<string, StudentProfile> = {
  // Aanal Nathvani
  'stu-001': SEED_STUDENT,
  'mstu-01': {
    ...SEED_STUDENT,
    id: 'mstu-01',
    email: 'aanal.nathvani@student.its-blr.edu.in'
  },

  // Rohan Varma
  'mstu-02': {
    id: 'mstu-02',
    userId: 'usr-student-02',
    fullName: 'Rohan Varma',
    email: 'rohan.varma@student.its-blr.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    headline: 'Pre-final Year Data Science & AI Undergrad | Deep Learning & LLM Pipelines',
    bio: 'Passionate about building scalable machine learning pipelines, transformer architectures, and explainable AI systems for production environments.',
    institutionId: 'inst-01',
    institutionName: 'Institute of Technology & Science, Bangalore',
    degree: 'B.Tech',
    branch: 'Data Science & AI',
    graduationYear: 2027,
    cgpa: 8.3,
    experienceYears: 0.5,
    preferredLocations: ['Bangalore', 'Hyderabad', 'Remote'],
    preferredRoles: ['Machine Learning Engineer', 'Data Scientist', 'AI Research Intern'],
    careerInterests: ['Natural Language Processing', 'Vector Databases', 'Model Quantization', 'MLOps'],
    employabilityStage: 'MATCH',
    skills: [
      {
        skillId: 'sk-python',
        skillName: 'Python',
        category: 'cat-backend',
        score: 88,
        proficiency: 'Advanced',
        confidence: 90,
        lastAssessedAt: '2026-08-20',
        evidenceSources: [
          {
            id: 'ev-py-02',
            sourceType: 'Assessment',
            title: 'Advanced Python for Data Science Assessment',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-20',
            scoreOrGrade: '88%'
          },
          {
            id: 'ev-py-proj-02',
            sourceType: 'Project',
            title: 'Transformer Clinical Entity Extraction',
            issuerOrContext: 'GitHub Repository',
            date: '2026-07-15'
          }
        ]
      },
      {
        skillId: 'sk-ml',
        skillName: 'Machine Learning Fundamentals',
        category: 'cat-ai',
        score: 82,
        proficiency: 'Advanced',
        confidence: 88,
        lastAssessedAt: '2026-08-18',
        evidenceSources: [
          {
            id: 'ev-ml-02',
            sourceType: 'Assessment',
            title: 'Machine Learning & Statistical Modeling',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-18',
            scoreOrGrade: '82%'
          }
        ]
      },
      {
        skillId: 'sk-sql',
        skillName: 'SQL & PostgreSQL',
        category: 'cat-database',
        score: 78,
        proficiency: 'Advanced',
        confidence: 85,
        lastAssessedAt: '2026-07-28',
        evidenceSources: [
          {
            id: 'ev-sql-02',
            sourceType: 'Assessment',
            title: 'Relational Database Query Optimization',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-07-28',
            scoreOrGrade: '78%'
          }
        ]
      },
      {
        skillId: 'sk-docker',
        skillName: 'Docker & Containers',
        category: 'cat-cloud',
        score: 70,
        proficiency: 'Intermediate',
        confidence: 78,
        lastAssessedAt: '2026-08-05',
        evidenceSources: [
          {
            id: 'ev-doc-02',
            sourceType: 'Project',
            title: 'Dockerized Fast-API Model Serving Container',
            issuerOrContext: 'GitHub / DockerHub',
            date: '2026-08-05'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-rohan-01',
        title: 'Clinical NER & Entity Relation Extraction with RoBERTa',
        description: 'Fine-tuned domain-adapted RoBERTa model to automatically extract ICD-10 diagnostic entities and dosage linkages from anonymized electronic health records.',
        technologies: ['PyTorch', 'HuggingFace', 'FastAPI', 'Docker', 'Python'],
        skillsDemonstrated: ['Machine Learning Fundamentals', 'Python', 'Docker & Containers'],
        githubUrl: 'https://github.com/rohanvarma-ds/clinical-ner-transformer',
        completedDate: '2026-07-20'
      },
      {
        id: 'proj-rohan-02',
        title: 'Real-Time Financial Fraud Anomaly Detector with XGBoost',
        description: 'Streaming anomaly detection architecture processing synthetic transaction events through Kafka and evaluating risk scores with sub-30ms latency.',
        technologies: ['Python', 'XGBoost', 'PostgreSQL', 'Redis', 'Kafka'],
        skillsDemonstrated: ['Python', 'SQL & PostgreSQL', 'Machine Learning Fundamentals'],
        githubUrl: 'https://github.com/rohanvarma-ds/stream-fraud-detection',
        completedDate: '2026-06-12'
      }
    ],
    certifications: [
      {
        id: 'cert-rohan-01',
        title: 'DeepLearning.AI Machine Learning Specialization',
        issuer: 'DeepLearning.AI & Stanford Online',
        issueDate: '2026-05-14',
        credentialId: 'DLAI-ML-883920',
        skillsCertified: ['Supervised Learning', 'Neural Networks', 'Decision Trees']
      },
      {
        id: 'cert-rohan-02',
        title: 'Google Professional Data Analyst',
        issuer: 'Google Career Certificates',
        issueDate: '2026-03-10',
        credentialId: 'GGL-DA-2026-441',
        skillsCertified: ['SQL', 'Data Analytics', 'Statistical Modeling']
      }
    ],
    resumes: [
      {
        id: 'res-rohan-01',
        fileName: 'Rohan_Varma_DS_AI_Resume_2026.pdf',
        fileSize: '380 KB',
        uploadedAt: '2026-08-10',
        extractedSkills: ['Python', 'PyTorch', 'Transformers', 'FastAPI', 'PostgreSQL', 'Docker', 'MLOps'],
        isDefault: true,
        summary: 'Undergraduate specializing in deep learning, transformer fine-tuning, and low-latency API deployment with verifiable project evidence.'
      }
    ]
  },

  // Sneha Deshmukh
  'mstu-03': {
    id: 'mstu-03',
    userId: 'usr-student-03',
    fullName: 'Sneha Deshmukh',
    email: 'sneha.d@student.its-blr.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    headline: 'Final Year ECE Senior | Embedded Systems, RTOS & Edge ML',
    bio: 'Pioneering edge telemetry and real-time firmware development. Deep expertise in ARM Cortex-M microcontrollers, FreeRTOS task scheduling, and MQTT mesh networking.',
    institutionId: 'inst-01',
    institutionName: 'Institute of Technology & Science, Bangalore',
    degree: 'B.Tech',
    branch: 'Electronics & Communication',
    graduationYear: 2026,
    cgpa: 9.1,
    experienceYears: 1.0,
    preferredLocations: ['Bangalore', 'Pune', 'Chennai'],
    preferredRoles: ['Embedded Systems Engineer', 'Firmware Developer', 'IoT Solutions Architect'],
    careerInterests: ['Edge Computing', 'Automotive CAN-bus', 'FreeRTOS', 'Industrial Automation'],
    employabilityStage: 'APPLY',
    skills: [
      {
        skillId: 'sk-embedded',
        skillName: 'Embedded C++ & Firmware',
        category: 'cat-backend',
        score: 95,
        proficiency: 'Expert',
        confidence: 94,
        lastAssessedAt: '2026-08-25',
        evidenceSources: [
          {
            id: 'ev-emb-01',
            sourceType: 'Assessment',
            title: 'ARM Cortex Architecture & Bare-Metal C++',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-25',
            scoreOrGrade: '95%'
          },
          {
            id: 'ev-emb-proj',
            sourceType: 'Project',
            title: 'FreeRTOS Multi-Sensor Industrial Gateway',
            issuerOrContext: 'Hardware Lab Prototype',
            date: '2026-07-30'
          }
        ]
      },
      {
        skillId: 'sk-rtos',
        skillName: 'RTOS & Task Scheduling',
        category: 'cat-backend',
        score: 90,
        proficiency: 'Expert',
        confidence: 92,
        lastAssessedAt: '2026-08-15',
        evidenceSources: [
          {
            id: 'ev-rtos-01',
            sourceType: 'Assessment',
            title: 'Real-Time Operating Systems Determinism Test',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-15',
            scoreOrGrade: '90%'
          }
        ]
      },
      {
        skillId: 'sk-python',
        skillName: 'Python',
        category: 'cat-backend',
        score: 82,
        proficiency: 'Advanced',
        confidence: 86,
        lastAssessedAt: '2026-07-20',
        evidenceSources: [
          {
            id: 'ev-py-03',
            sourceType: 'Assessment',
            title: 'Python for Hardware Test Automation',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-07-20',
            scoreOrGrade: '82%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-sneha-01',
        title: 'Edge AI Smart Vision on NVIDIA Jetson Nano',
        description: 'Deployed a quantized YOLOv8 object classifier on Jetson Nano with hardware-accelerated TensorRT inference reaching 48 FPS on edge telemetry cameras.',
        technologies: ['C++', 'TensorRT', 'OpenCV', 'CUDA', 'Python'],
        skillsDemonstrated: ['Embedded C++ & Firmware', 'Python'],
        githubUrl: 'https://github.com/snehadeshmukh/edge-jetson-vision',
        completedDate: '2026-07-25'
      },
      {
        id: 'proj-sneha-02',
        title: 'Solar Microgrid LoRaWAN Monitoring Node',
        description: 'Ultra-low-power telemetry node operating on STM32L4 utilizing FreeRTOS sleep modes with battery life exceeding 24 months transmitting sensor readings over 12km.',
        technologies: ['C', 'FreeRTOS', 'STM32Cube', 'LoRaWAN', 'KiCAD'],
        skillsDemonstrated: ['Embedded C++ & Firmware', 'RTOS & Task Scheduling'],
        githubUrl: 'https://github.com/snehadeshmukh/lora-microgrid-telemetry',
        completedDate: '2026-05-18'
      }
    ],
    certifications: [
      {
        id: 'cert-sneha-01',
        title: 'ARM Accredited MCU Engineer (AAME)',
        issuer: 'ARM University Program',
        issueDate: '2026-04-12',
        credentialId: 'ARM-MCU-2026-902',
        skillsCertified: ['ARM Cortex-M', 'Memory Architecture', 'Interrupt Handling']
      }
    ],
    resumes: [
      {
        id: 'res-sneha-01',
        fileName: 'Sneha_Deshmukh_ECE_Embedded_2026.pdf',
        fileSize: '410 KB',
        uploadedAt: '2026-08-01',
        extractedSkills: ['C', 'C++', 'FreeRTOS', 'STM32', 'LoRaWAN', 'TensorRT', 'PCB Design'],
        isDefault: true,
        summary: 'Top-tier ECE graduate with high academic standing (9.1 CGPA), proven hardware prototypes, and specialized RTOS and Edge AI competencies.'
      }
    ]
  },

  // Karthik Iyer
  'mstu-04': {
    id: 'mstu-04',
    userId: 'usr-student-04',
    fullName: 'Karthik Iyer',
    email: 'karthik.iyer@vgie.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    headline: 'Senior CS Student | Full-Stack TypeScript, Node.js & Distributed Cache',
    bio: 'Dedicated software engineer skilled in building high-throughput web architectures, REST microservices, and reactive user interfaces.',
    institutionId: 'inst-02',
    institutionName: 'Vellore Global Institute of Engineering',
    degree: 'B.Tech',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.6,
    experienceYears: 0.8,
    preferredLocations: ['Chennai', 'Bangalore', 'Coimbatore'],
    preferredRoles: ['Full Stack Developer', 'Backend Software Engineer', 'Cloud Developer'],
    careerInterests: ['Microservices', 'GraphQL', 'Distributed Caching', 'Event-Driven Systems'],
    employabilityStage: 'APPLY',
    skills: [
      {
        skillId: 'sk-typescript',
        skillName: 'TypeScript',
        category: 'cat-frontend',
        score: 84,
        proficiency: 'Advanced',
        confidence: 88,
        lastAssessedAt: '2026-08-14',
        evidenceSources: [
          {
            id: 'ev-ts-04',
            sourceType: 'Assessment',
            title: 'TypeScript Type System & Generics Examination',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-14',
            scoreOrGrade: '84%'
          }
        ]
      },
      {
        skillId: 'sk-nodejs',
        skillName: 'Node.js',
        category: 'cat-backend',
        score: 85,
        proficiency: 'Advanced',
        confidence: 89,
        lastAssessedAt: '2026-08-12',
        evidenceSources: [
          {
            id: 'ev-node-04',
            sourceType: 'Assessment',
            title: 'Node.js Event Loop & Microservice Benchmarking',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-12',
            scoreOrGrade: '85%'
          }
        ]
      },
      {
        skillId: 'sk-react',
        skillName: 'React',
        category: 'cat-frontend',
        score: 82,
        proficiency: 'Advanced',
        confidence: 86,
        lastAssessedAt: '2026-08-10',
        evidenceSources: [
          {
            id: 'ev-react-04',
            sourceType: 'Assessment',
            title: 'React Concurrent Mode & State Architecture',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-10',
            scoreOrGrade: '82%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-karthik-01',
        title: 'Real-Time Collaborative Whiteboard with Operational Transformation',
        description: 'Low-latency multiplayer canvas supporting 100+ concurrent editors with WebSocket communication and Redis pub/sub room synchronizers.',
        technologies: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'Redis'],
        skillsDemonstrated: ['TypeScript', 'Node.js', 'React'],
        githubUrl: 'https://github.com/karthik-iyer/collab-whiteboard',
        completedDate: '2026-06-30'
      }
    ],
    certifications: [
      {
        id: 'cert-karthik-01',
        title: 'Meta Certified Professional Front-End Developer',
        issuer: 'Meta & Coursera',
        issueDate: '2026-04-20',
        credentialId: 'META-FED-884210',
        skillsCertified: ['React', 'JavaScript', 'State Management']
      }
    ],
    resumes: [
      {
        id: 'res-karthik-01',
        fileName: 'Karthik_Iyer_FullStack_2026.pdf',
        fileSize: '320 KB',
        uploadedAt: '2026-07-15',
        extractedSkills: ['TypeScript', 'React', 'Node.js', 'Redis', 'PostgreSQL', 'Docker'],
        isDefault: true,
        summary: 'Full-stack software developer with production project experience in TypeScript and high-concurrency Node.js services.'
      }
    ]
  },

  // Meera Krishnan
  'mstu-05': {
    id: 'mstu-05',
    userId: 'usr-student-05',
    fullName: 'Meera Krishnan',
    email: 'meera.k@vgie.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    headline: 'Robotics & Automation Undergrad | ROS2, SLAM & Computer Vision',
    bio: 'Designing autonomous mobile robot (AMR) platforms and trajectory control algorithms. Skilled in ROS2 Humble, Gazebo simulation, and LiDAR-based simultaneous localization and mapping.',
    institutionId: 'inst-02',
    institutionName: 'Vellore Global Institute of Engineering',
    degree: 'B.Tech',
    branch: 'Robotics & Automation',
    graduationYear: 2027,
    cgpa: 8.9,
    experienceYears: 0.6,
    preferredLocations: ['Bangalore', 'Chennai', 'Pune'],
    preferredRoles: ['Robotics Software Engineer', 'Computer Vision Engineer', 'Autonomous Systems Intern'],
    careerInterests: ['ROS2 Navigation', 'SLAM', 'Industrial AGVs', 'Kinematics'],
    employabilityStage: 'MATCH',
    skills: [
      {
        skillId: 'sk-ros',
        skillName: 'ROS2 & Navigation2',
        category: 'cat-backend',
        score: 88,
        proficiency: 'Advanced',
        confidence: 90,
        lastAssessedAt: '2026-08-22',
        evidenceSources: [
          {
            id: 'ev-ros-05',
            sourceType: 'Assessment',
            title: 'ROS2 Architecture & Node Lifecycle Assessment',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-22',
            scoreOrGrade: '88%'
          }
        ]
      },
      {
        skillId: 'sk-python',
        skillName: 'Python',
        category: 'cat-backend',
        score: 85,
        proficiency: 'Advanced',
        confidence: 88,
        lastAssessedAt: '2026-08-10',
        evidenceSources: [
          {
            id: 'ev-py-05',
            sourceType: 'Assessment',
            title: 'Python for Scientific & Robotics Computation',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-10',
            scoreOrGrade: '85%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-meera-01',
        title: 'Autonomous Warehouse AMR with Nav2 SLAM & Obstacle Avoidance',
        description: 'Built a 2D LiDAR differential-drive robot in Gazebo and real hardware with Costmap2D obstacle avoidance and path planning under dynamic environments.',
        technologies: ['ROS2', 'C++', 'Python', 'Gazebo', 'Nav2'],
        skillsDemonstrated: ['ROS2 & Navigation2', 'Python'],
        githubUrl: 'https://github.com/meerakrishnan/warehouse-amr-ros2',
        completedDate: '2026-07-28'
      }
    ],
    certifications: [
      {
        id: 'cert-meera-01',
        title: 'NVIDIA DLI: Fundamentals of Deep Learning for Autonomous Machines',
        issuer: 'NVIDIA Deep Learning Institute',
        issueDate: '2026-05-18',
        credentialId: 'NV-DLI-2026-778',
        skillsCertified: ['Deep Learning', 'Computer Vision', 'Jetson Deployment']
      }
    ],
    resumes: [
      {
        id: 'res-meera-01',
        fileName: 'Meera_Krishnan_Robotics_Resume_2026.pdf',
        fileSize: '350 KB',
        uploadedAt: '2026-08-05',
        extractedSkills: ['ROS2', 'Gazebo', 'Nav2', 'Python', 'C++', 'SLAM', 'OpenCV'],
        isDefault: true,
        summary: 'Robotics engineer with hands-on ROS2 simulation and hardware deployment experience for warehouse automation.'
      }
    ]
  },

  // Aditya Sharma
  'mstu-06': {
    id: 'mstu-06',
    userId: 'usr-student-06',
    fullName: 'Aditya Sharma',
    email: 'aditya.sharma@vgie.edu.in',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    headline: 'Information Technology Senior | Cloud Infrastructure & Security Hardening',
    bio: 'Focused on cloud security posture management, Linux systems engineering, CI/CD automation, and identity federation.',
    institutionId: 'inst-02',
    institutionName: 'Vellore Global Institute of Engineering',
    degree: 'B.Tech',
    branch: 'Information Technology',
    graduationYear: 2026,
    cgpa: 7.8,
    experienceYears: 0.5,
    preferredLocations: ['Bangalore', 'Hyderabad', 'Chennai'],
    preferredRoles: ['Cloud Support Engineer', 'DevSecOps Intern', 'Linux Systems Administrator'],
    careerInterests: ['Cloud Security', 'Kubernetes Hardening', 'IAM Policies', 'Zero Trust'],
    employabilityStage: 'LEARN',
    skills: [
      {
        skillId: 'sk-aws',
        skillName: 'Cloud Infrastructure (AWS/GCP)',
        category: 'cat-cloud',
        score: 75,
        proficiency: 'Advanced',
        confidence: 82,
        lastAssessedAt: '2026-08-16',
        evidenceSources: [
          {
            id: 'ev-cloud-06',
            sourceType: 'Assessment',
            title: 'AWS Well-Architected Framework & VPC Exam',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-16',
            scoreOrGrade: '75%'
          }
        ]
      },
      {
        skillId: 'sk-docker',
        skillName: 'Docker & Containers',
        category: 'cat-cloud',
        score: 72,
        proficiency: 'Intermediate',
        confidence: 76,
        lastAssessedAt: '2026-07-29',
        evidenceSources: [
          {
            id: 'ev-doc-06',
            sourceType: 'Assessment',
            title: 'Docker Security Scanning and CIS Benchmarks',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-07-29',
            scoreOrGrade: '72%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-aditya-01',
        title: 'Automated Multi-Cloud CIS Benchmark Security Scanner',
        description: 'Python automation tool scanning AWS IAM policies, S3 bucket permissions, and open security groups generating compliance audit reports.',
        technologies: ['Python', 'Boto3', 'AWS', 'Docker', 'Markdown'],
        skillsDemonstrated: ['Cloud Infrastructure (AWS/GCP)', 'Docker & Containers'],
        githubUrl: 'https://github.com/adityasharma-sec/cloud-cis-scanner',
        completedDate: '2026-07-12'
      }
    ],
    certifications: [
      {
        id: 'cert-aditya-01',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: '2026-03-22',
        credentialId: 'AWS-CCP-992014',
        skillsCertified: ['Cloud Concepts', 'AWS Security & Compliance', 'Core Services']
      }
    ],
    resumes: [
      {
        id: 'res-aditya-01',
        fileName: 'Aditya_Sharma_IT_Cloud_2026.pdf',
        fileSize: '310 KB',
        uploadedAt: '2026-07-10',
        extractedSkills: ['AWS', 'Linux', 'Python', 'Docker', 'Bash Scripting', 'IAM'],
        isDefault: true,
        summary: 'IT undergraduate with AWS Cloud Practitioner certification and practical experience in security scanning.'
      }
    ]
  },

  // Tanvi Kulkarni
  'mstu-07': {
    id: 'mstu-07',
    userId: 'usr-student-07',
    fullName: 'Tanvi Kulkarni',
    email: 'tanvi.k@ppru.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    headline: 'Pre-final Year Computer Engineering | Mobile App Architecture & React Native',
    bio: 'Crafting responsive cross-platform mobile experiences with offline SQLite syncing, clean architecture, and delightful micro-interactions.',
    institutionId: 'inst-03',
    institutionName: 'Pune Polytechnic & Research University',
    degree: 'B.Tech',
    branch: 'Computer Engineering',
    graduationYear: 2027,
    cgpa: 8.5,
    experienceYears: 0.6,
    preferredLocations: ['Pune', 'Mumbai', 'Bangalore'],
    preferredRoles: ['Mobile App Developer', 'Frontend Engineer', 'UI/UX Engineer'],
    careerInterests: ['React Native', 'Flutter', 'State Management', 'Offline-First Apps'],
    employabilityStage: 'MATCH',
    skills: [
      {
        skillId: 'sk-react',
        skillName: 'React & Mobile UI',
        category: 'cat-frontend',
        score: 82,
        proficiency: 'Advanced',
        confidence: 86,
        lastAssessedAt: '2026-08-15',
        evidenceSources: [
          {
            id: 'ev-mob-07',
            sourceType: 'Assessment',
            title: 'Mobile Front-End Engineering & Performance',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-15',
            scoreOrGrade: '82%'
          }
        ]
      },
      {
        skillId: 'sk-restapi',
        skillName: 'REST API Design',
        category: 'cat-backend',
        score: 76,
        proficiency: 'Advanced',
        confidence: 80,
        lastAssessedAt: '2026-08-01',
        evidenceSources: [
          {
            id: 'ev-api-07',
            sourceType: 'Assessment',
            title: 'API Client Architecture & Token Handling',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-01',
            scoreOrGrade: '76%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-tanvi-01',
        title: 'Campus Transit & Peer Carpooling App',
        description: 'Cross-platform app connecting 3,000+ university students with real-time location tracking, route matching, and emergency SOS alerts.',
        technologies: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'Mapbox'],
        skillsDemonstrated: ['React & Mobile UI', 'REST API Design'],
        githubUrl: 'https://github.com/tanvikulkarni/campus-transit-app',
        completedDate: '2026-06-25'
      }
    ],
    certifications: [
      {
        id: 'cert-tanvi-01',
        title: 'Google Associate Android Developer Preparation',
        issuer: 'Google Developers Program',
        issueDate: '2026-05-10',
        credentialId: 'GGL-AND-2026-551',
        skillsCertified: ['Mobile UI', 'Data Persistence', 'Background Workers']
      }
    ],
    resumes: [
      {
        id: 'res-tanvi-01',
        fileName: 'Tanvi_Kulkarni_Mobile_Engineer_2026.pdf',
        fileSize: '340 KB',
        uploadedAt: '2026-07-20',
        extractedSkills: ['React Native', 'TypeScript', 'Flutter', 'Redux Toolkit', 'SQLite', 'REST'],
        isDefault: true,
        summary: 'Mobile developer with production-published application and strong aesthetic UI design principles.'
      }
    ]
  },

  // Pranav Patil
  'mstu-08': {
    id: 'mstu-08',
    userId: 'usr-student-08',
    fullName: 'Pranav Patil',
    email: 'pranav.p@ppru.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    headline: 'Senior Mechatronics Undergrad | Industrial Automation & PLC Logic',
    bio: 'Passionate about integrating mechanical actuation with programmable logic controllers (PLCs), SCADA telemetry, and automated assembly conveyors.',
    institutionId: 'inst-03',
    institutionName: 'Pune Polytechnic & Research University',
    degree: 'B.Tech',
    branch: 'Mechanical & Mechatronics',
    graduationYear: 2026,
    cgpa: 7.4,
    experienceYears: 0.4,
    preferredLocations: ['Pune', 'Aurangabad', 'Nashik'],
    preferredRoles: ['Automation Engineer', 'PLC Programmer', 'Manufacturing QA Engineer'],
    careerInterests: ['Industrial IoT', 'Siemens PLC', 'SCADA', 'Pneumatics'],
    employabilityStage: 'LEARN',
    skills: [
      {
        skillId: 'sk-plc',
        skillName: 'PLC Programming & SCADA',
        category: 'cat-backend',
        score: 72,
        proficiency: 'Intermediate',
        confidence: 75,
        lastAssessedAt: '2026-08-10',
        evidenceSources: [
          {
            id: 'ev-plc-08',
            sourceType: 'Assessment',
            title: 'Ladder Logic & Industrial Fieldbus Protocols',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-08-10',
            scoreOrGrade: '72%'
          }
        ]
      },
      {
        skillId: 'sk-cad',
        skillName: 'CAD Modeling & Simulation',
        category: 'cat-backend',
        score: 78,
        proficiency: 'Advanced',
        confidence: 80,
        lastAssessedAt: '2026-07-25',
        evidenceSources: [
          {
            id: 'ev-cad-08',
            sourceType: 'Assessment',
            title: 'Parametric Solid Modeling & Stress Analysis',
            issuerOrContext: 'Skill Safar Verification Engine',
            date: '2026-07-25',
            scoreOrGrade: '78%'
          }
        ]
      }
    ],
    projects: [
      {
        id: 'proj-pranav-01',
        title: '3-Axis Automated Sorting Gantry with Siemens S7-1200',
        description: 'Designed and programmed a pneumatic pick-and-place sorting gantry with color sensor discrimination and SCADA operational dashboard.',
        technologies: ['Siemens TIA Portal', 'SolidWorks', 'Ladder Logic', 'Modbus TCP'],
        skillsDemonstrated: ['PLC Programming & SCADA', 'CAD Modeling & Simulation'],
        githubUrl: 'https://github.com/pranavpatil-auto/sorting-gantry-plc',
        completedDate: '2026-06-15'
      }
    ],
    certifications: [
      {
        id: 'cert-pranav-01',
        title: 'Certified SolidWorks Associate (CSWA)',
        issuer: 'Dassault Systèmes',
        issueDate: '2026-02-14',
        credentialId: 'CSWA-2026-8819',
        skillsCertified: ['Part Modeling', 'Assembly Analysis', 'Drawing Creation']
      }
    ],
    resumes: [
      {
        id: 'res-pranav-01',
        fileName: 'Pranav_Patil_Mechatronics_2026.pdf',
        fileSize: '360 KB',
        uploadedAt: '2026-07-05',
        extractedSkills: ['PLC', 'Siemens S7', 'SCADA', 'SolidWorks', 'Pneumatics', 'Modbus'],
        isDefault: true,
        summary: 'Mechatronics engineer with hands-on PLC ladder logic, automated pneumatic sorting, and CAD modeling certification.'
      }
    ]
  }
};

/**
 * Helper to get a full StudentProfile for any student by id, email, or USN.
 * Falls back to generating a coherent profile if not found in prebuilt records.
 */
export function getFullStudentProfile(
  idOrIdentifier: string,
  managedStudentFallback?: ManagedStudent
): StudentProfile {
  // 1. Direct match by ID
  if (DETAILED_STUDENT_PROFILES[idOrIdentifier]) {
    return DETAILED_STUDENT_PROFILES[idOrIdentifier];
  }

  // 2. Match by email or fullName
  const found = Object.values(DETAILED_STUDENT_PROFILES).find(
    p => p.id === idOrIdentifier || p.email.toLowerCase() === idOrIdentifier.toLowerCase() || p.fullName.toLowerCase() === idOrIdentifier.toLowerCase()
  );
  if (found) return found;

  // 3. Construct coherent profile from ManagedStudent fallback
  if (managedStudentFallback) {
    return {
      id: managedStudentFallback.id,
      userId: `usr-${managedStudentFallback.id}`,
      fullName: managedStudentFallback.fullName,
      email: managedStudentFallback.email,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      headline: `Student at ${managedStudentFallback.institutionName} | ${managedStudentFallback.branch}`,
      bio: `Enrolled undergraduate in ${managedStudentFallback.branch} with verified skill score of ${managedStudentFallback.verifiedSkillScore}/100 and CGPA ${managedStudentFallback.cgpa}.`,
      institutionId: managedStudentFallback.institutionId,
      institutionName: managedStudentFallback.institutionName,
      degree: 'B.Tech',
      branch: managedStudentFallback.branch,
      graduationYear: 2026,
      cgpa: managedStudentFallback.cgpa,
      experienceYears: 0.5,
      preferredLocations: ['Bangalore', 'Hyderabad', 'Pune'],
      preferredRoles: ['Software Engineer', 'Technical Analyst'],
      careerInterests: ['Cloud', 'Software Development', 'Analytics'],
      employabilityStage: 'MATCH',
      skills: [
        {
          skillId: 'sk-gen-1',
          skillName: `${managedStudentFallback.branch} Core Competency`,
          category: 'cat-backend',
          score: managedStudentFallback.verifiedSkillScore,
          proficiency: managedStudentFallback.verifiedSkillScore >= 85 ? 'Expert' : managedStudentFallback.verifiedSkillScore >= 70 ? 'Advanced' : 'Intermediate',
          confidence: 85,
          evidenceSources: [
            {
              id: `ev-${managedStudentFallback.id}-1`,
              sourceType: 'Assessment',
              title: 'Standardized Campus Assessment Verification',
              issuerOrContext: 'Skill Safar Verification Engine',
              date: '2026-08-25',
              scoreOrGrade: `${managedStudentFallback.verifiedSkillScore}%`
            }
          ]
        },
        {
          skillId: 'sk-comm',
          skillName: 'Technical Communication & Problem Solving',
          category: 'cat-soft',
          score: 80,
          proficiency: 'Advanced',
          confidence: 82,
          evidenceSources: [
            {
              id: `ev-${managedStudentFallback.id}-2`,
              sourceType: 'Assessment',
              title: 'Engineering Communication Benchmark',
              issuerOrContext: 'Skill Safar Verification Engine',
              date: '2026-08-15',
              scoreOrGrade: '80%'
            }
          ]
        }
      ],
      projects: [
        {
          id: `proj-${managedStudentFallback.id}-1`,
          title: `${managedStudentFallback.branch} Capstone Engineering Project`,
          description: `Practical implementation and verification in ${managedStudentFallback.branch} adhering to industrial engineering specifications.`,
          technologies: ['C++', 'Python', 'Git', 'Linux'],
          skillsDemonstrated: [`${managedStudentFallback.branch} Core Competency`],
          githubUrl: 'https://github.com',
          completedDate: '2026-07-15'
        }
      ],
      certifications: [
        {
          id: `cert-${managedStudentFallback.id}-1`,
          title: `Certified ${managedStudentFallback.branch} Specialist`,
          issuer: 'Consortium of Engineering Institutions',
          issueDate: '2026-04-10',
          skillsCertified: [`${managedStudentFallback.branch} Core Competency`]
        }
      ],
      resumes: [
        {
          id: `res-${managedStudentFallback.id}-1`,
          fileName: `${managedStudentFallback.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
          fileSize: '320 KB',
          uploadedAt: '2026-08-10',
          extractedSkills: [managedStudentFallback.branch, 'Python', 'Git'],
          isDefault: true,
          summary: `Academic and practical profile of ${managedStudentFallback.fullName} with verified skill score of ${managedStudentFallback.verifiedSkillScore}%.`
        }
      ]
    };
  }

  // Fallback to default student
  return SEED_STUDENT;
}
