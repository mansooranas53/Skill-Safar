/**
 * Academia–Industry Collaboration Portal
 * Service Layer
 * 
 * Orchestrates business rules, domain engines, and repository interactions.
 * UI components interact with services rather than accessing data directly.
 */

import { portalRepository } from '../repositories/mockRepository';
import { calculateMatchScore } from '../domain/matchingEngine';
import {
  StudentProfile,
  Opportunity,
  Application,
  MatchExplanation,
  AssessmentQuestion,
  LearningProgram,
  ApplicationStatus,
  OpportunityStatus
} from '../types';

export class StudentService {
  public static getProfile(): StudentProfile {
    return portalRepository.getStudentProfile();
  }

  public static updateProfile(patch: Partial<StudentProfile>): StudentProfile {
    return portalRepository.updateStudentProfile(patch);
  }

  public static getSkillGaps(student: StudentProfile) {
    const opportunities = portalRepository.getOpportunities().filter(o => o.status === 'PUBLISHED');
    const skillDemandCount = new Map<string, number>();

    // Count frequency of required skills in published opportunities
    opportunities.forEach(opp => {
      opp.requiredSkills.forEach(req => {
        const count = skillDemandCount.get(req) || 0;
        skillDemandCount.set(req, count + 1);
      });
    });

    const studentSkillMap = new Map<string, number>();
    student.skills.forEach(s => {
      studentSkillMap.set(s.skillName.toLowerCase(), s.score);
    });

    const gaps: {
      skillName: string;
      demandCount: number;
      currentScore: number;
      gapSeverity: 'Critical' | 'Moderate' | 'Minor';
      recommendedLearning?: LearningProgram;
    }[] = [];

    const allLearning = portalRepository.getLearningPrograms();

    skillDemandCount.forEach((demand, skillName) => {
      const score = studentSkillMap.get(skillName.toLowerCase()) || 0;
      if (score < 70) {
        const severity = score < 45 ? 'Critical' : score < 60 ? 'Moderate' : 'Minor';
        const course = allLearning.find(l => l.targetSkill.toLowerCase() === skillName.toLowerCase());
        gaps.push({
          skillName,
          demandCount: demand,
          currentScore: score,
          gapSeverity: severity,
          recommendedLearning: course
        });
      }
    });

    return gaps.sort((a, b) => b.demandCount - a.demandCount);
  }
}

export class OpportunityService {
  public static getAll(): Opportunity[] {
    return portalRepository.getOpportunities();
  }

  public static getPublished(): Opportunity[] {
    return portalRepository.getOpportunities().filter(o => o.status === 'PUBLISHED');
  }

  public static getById(id: string): Opportunity | undefined {
    return portalRepository.getOpportunityById(id);
  }

  public static create(opp: Omit<Opportunity, 'id' | 'createdAt' | 'totalApplicants'>): Opportunity {
    return portalRepository.createOpportunity(opp);
  }

  public static updateStatus(id: string, status: OpportunityStatus): boolean {
    return portalRepository.updateOpportunityStatus(id, status);
  }
}

export class MatchingService {
  public static getMatchesForStudent(student: StudentProfile): {
    opportunity: Opportunity;
    explanation: MatchExplanation;
  }[] {
    const published = OpportunityService.getPublished();
    return published
      .map(opp => ({
        opportunity: opp,
        explanation: calculateMatchScore(student, opp)
      }))
      .sort((a, b) => b.explanation.overallScore - a.explanation.overallScore);
  }

  public static getMatchesForOpportunity(opportunity: Opportunity): {
    student: StudentProfile;
    explanation: MatchExplanation;
  }[] {
    // In our mock, we evaluate the current student profile
    const student = portalRepository.getStudentProfile();
    return [{
      student,
      explanation: calculateMatchScore(student, opportunity)
    }];
  }

  public static explain(student: StudentProfile, opportunity: Opportunity): MatchExplanation {
    return calculateMatchScore(student, opportunity);
  }
}

export class AssessmentService {
  public static getQuestions(categoryId?: string): AssessmentQuestion[] {
    return portalRepository.getAssessmentQuestions(categoryId);
  }

  public static evaluateAndSubmit(
    studentId: string,
    answers: Record<string, number> // questionId -> selectedOptionIndex
  ): {
    totalQuestions: number;
    correctCount: number;
    scorePercentage: number;
    skillUpdates: { skillName: string; score: number }[];
  } {
    const allQuestions = portalRepository.getAssessmentQuestions();
    const answeredList = Object.entries(answers);
    let correct = 0;
    const skillScoreTally = new Map<string, { total: number; correct: number }>();

    for (const [qId, selectedIdx] of answeredList) {
      const q = allQuestions.find(item => item.id === qId);
      if (!q) continue;

      const isCorrect = q.correctOptionIndex === selectedIdx;
      if (isCorrect) correct += 1;

      const tally = skillScoreTally.get(q.skillTarget) || { total: 0, correct: 0 };
      tally.total += 1;
      if (isCorrect) tally.correct += 1;
      skillScoreTally.set(q.skillTarget, tally);
    }

    const totalQuestions = answeredList.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

    const skillUpdates: { skillName: string; score: number }[] = [];
    skillScoreTally.forEach((val, skillName) => {
      const calculatedScore = Math.round((val.correct / val.total) * 100);
      portalRepository.updateSkillScore(skillName, calculatedScore, 'Official Platform Assessment');
      skillUpdates.push({ skillName, score: calculatedScore });
    });

    return {
      totalQuestions,
      correctCount: correct,
      scorePercentage,
      skillUpdates
    };
  }
}

export class ApplicationService {
  public static apply(data: {
    opportunityId: string;
    coverNote?: string;
    resumeId: string;
    matchScore: number;
  }): Application {
    return portalRepository.submitApplication(data);
  }

  public static getForStudent(studentId: string): Application[] {
    return portalRepository.getApplicationsForStudent(studentId);
  }

  public static getForOpportunity(opportunityId: string): Application[] {
    return portalRepository.getApplicationsForOpportunity(opportunityId);
  }

  public static updateStatus(
    appId: string,
    status: ApplicationStatus,
    note?: string,
    changedBy?: string,
    interviewDate?: string
  ): Application {
    return portalRepository.updateApplicationStatus(appId, status, note, changedBy, interviewDate);
  }
}

export class LearningService {
  public static getAllPrograms(): LearningProgram[] {
    return portalRepository.getLearningPrograms();
  }

  public static completeProgram(programId: string): void {
    portalRepository.completeLearningProgram(programId);
  }
}

/**
 * Model Context Protocol (MCP) Simulated Layer (Phase 10 & 11)
 * Safe interface for AI Agent queries without direct database tampering.
 */
export class MCPService {
  public static callTool(toolName: string, params: Record<string, unknown> = {}): Record<string, unknown> {
    const student = portalRepository.getStudentProfile();

    switch (toolName) {
      case 'get_student_profile':
        return {
          id: student.id,
          fullName: student.fullName,
          degree: student.degree,
          branch: student.branch,
          cgpa: student.cgpa,
          graduationYear: student.graduationYear,
          headline: student.headline,
          careerInterests: student.careerInterests
        };

      case 'get_student_skill_profile':
        return {
          skills: student.skills.map(s => ({
            name: s.skillName,
            score: s.score,
            proficiency: s.proficiency,
            confidence: s.confidence,
            evidenceCount: s.evidenceSources.length
          }))
        };

      case 'analyze_skill_gaps': {
        const gaps = StudentService.getSkillGaps(student);
        return {
          identifiedGapsCount: gaps.length,
          criticalGaps: gaps.filter(g => g.gapSeverity === 'Critical').map(g => g.skillName),
          allGaps: gaps.map(g => ({
            skill: g.skillName,
            currentScore: g.currentScore,
            severity: g.gapSeverity,
            marketDemandCount: g.demandCount
          }))
        };
      }

      case 'find_matching_opportunities': {
        const matches = MatchingService.getMatchesForStudent(student);
        return {
          totalMatches: matches.length,
          topRecommendations: matches.slice(0, 3).map(m => ({
            title: m.opportunity.title,
            company: m.opportunity.companyName,
            matchScore: `${m.explanation.overallScore}%`,
            matchedSkills: m.explanation.matchedSkills,
            missingSkills: m.explanation.missingRequiredSkills,
            stipend: m.opportunity.stipendOrSalary
          }))
        };
      }

      case 'recommend_learning': {
        const gaps = StudentService.getSkillGaps(student);
        const programs = gaps
          .map(g => g.recommendedLearning)
          .filter((p): p is LearningProgram => Boolean(p));
        return {
          recommendations: programs.map(p => ({
            title: p.title,
            targetSkill: p.targetSkill,
            difficulty: p.difficulty,
            durationHours: p.durationHours,
            expectedScoreBoost: `+${p.scoreBoost}%`
          }))
        };
      }

      default:
        return { error: `Tool ${toolName} not supported` };
    }
  }
}
