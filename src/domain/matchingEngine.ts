/**
 * Academia–Industry Collaboration Portal
 * Deterministic, Explainable Matching Engine
 * 
 * Formula:
 * - Skill Compatibility: 60%
 * - Eligibility (Degree, Branch, Grad Year, Experience, CGPA): 20%
 * - Career Interest Alignment: 10%
 * - Preferences (Location, Work Type): 10%
 * Total = 100%
 */

import { Opportunity, StudentProfile, MatchExplanation } from '../types';

export function calculateMatchScore(
  student: StudentProfile,
  opportunity: Opportunity
): MatchExplanation {
  const studentSkillMap = new Map<string, number>();
  student.skills.forEach(s => {
    studentSkillMap.set(s.skillName.toLowerCase(), s.score);
  });

  // 1. SKILL COMPATIBILITY (Weight: 60 points max)
  const required = opportunity.requiredSkills.map(s => s.trim());
  const preferred = opportunity.preferredSkills.map(s => s.trim());

  const matchedSkills: string[] = [];
  const missingRequiredSkills: string[] = [];
  const matchedPreferredSkills: string[] = [];

  let requiredScoreSum = 0;
  for (const reqSkill of required) {
    const key = reqSkill.toLowerCase();
    // check exact match or partial alias match
    let foundScore: number | undefined = undefined;
    for (const [sName, score] of studentSkillMap.entries()) {
      if (sName === key || sName.includes(key) || key.includes(sName)) {
        foundScore = score;
        break;
      }
    }

    if (foundScore !== undefined && foundScore >= 40) {
      matchedSkills.push(reqSkill);
      // scale score: a 100% skill score gives full weight
      requiredScoreSum += (foundScore / 100);
    } else {
      missingRequiredSkills.push(reqSkill);
    }
  }

  let preferredScoreSum = 0;
  for (const prefSkill of preferred) {
    const key = prefSkill.toLowerCase();
    let foundScore: number | undefined = undefined;
    for (const [sName, score] of studentSkillMap.entries()) {
      if (sName === key || sName.includes(key) || key.includes(sName)) {
        foundScore = score;
        break;
      }
    }
    if (foundScore !== undefined && foundScore >= 40) {
      matchedPreferredSkills.push(prefSkill);
      preferredScoreSum += (foundScore / 100);
    }
  }

  // Weight required vs preferred (75% of skill points to required, 25% to preferred)
  const reqRatio = required.length > 0 ? (requiredScoreSum / required.length) : 1;
  const prefRatio = preferred.length > 0 ? (preferredScoreSum / preferred.length) : 1;
  const skillCompatibilityScore = Math.round((reqRatio * 0.75 + prefRatio * 0.25) * 60);

  // 2. ELIGIBILITY MATCH (Weight: 20 points max)
  const elDetails: string[] = [];
  let elPoints = 20;

  const elig = opportunity.eligibility;

  // Degree check
  if (elig.degree && elig.degree.length > 0) {
    const degMatch = elig.degree.some(d => 
      d.toLowerCase().includes(student.degree.toLowerCase()) || 
      student.degree.toLowerCase().includes(d.toLowerCase())
    );
    if (!degMatch) {
      elPoints -= 7;
      elDetails.push(`Degree preferred: ${elig.degree.join(', ')} (Candidate: ${student.degree})`);
    } else {
      elDetails.push(`Degree matched: ${student.degree}`);
    }
  }

  // Branch check
  if (elig.branches && elig.branches.length > 0) {
    const branchMatch = elig.branches.some(b => 
      b.toLowerCase().includes(student.branch.toLowerCase()) || 
      student.branch.toLowerCase().includes(b.toLowerCase())
    );
    if (!branchMatch) {
      elPoints -= 7;
      elDetails.push(`Branch preferred: ${elig.branches.join(', ')} (Candidate: ${student.branch})`);
    } else {
      elDetails.push(`Branch matched: ${student.branch}`);
    }
  }

  // Graduation Year
  if (elig.minGraduationYear && student.graduationYear < elig.minGraduationYear) {
    elPoints -= 3;
    elDetails.push(`Expected graduation year ≥ ${elig.minGraduationYear}`);
  }
  if (elig.maxGraduationYear && student.graduationYear > elig.maxGraduationYear) {
    elPoints -= 3;
    elDetails.push(`Expected graduation year ≤ ${elig.maxGraduationYear}`);
  }

  // CGPA
  if (elig.minCgpa && student.cgpa < elig.minCgpa) {
    elPoints -= 3;
    elDetails.push(`Minimum CGPA requirement: ${elig.minCgpa} (Candidate: ${student.cgpa})`);
  }

  const eligibilityScore = Math.max(0, elPoints);
  const eligibilityStatus = eligibilityScore >= 16 
    ? 'EL_MET' 
    : eligibilityScore >= 8 
      ? 'EL_PARTIAL' 
      : 'EL_MISMATCH';

  // 3. CAREER INTEREST ALIGNMENT (Weight: 10 points max)
  let careerInterestScore = 0;
  const oppDomain = opportunity.domain.toLowerCase();
  const oppTitle = opportunity.title.toLowerCase();
  const interestMatch = student.careerInterests.some(ci => {
    const c = ci.toLowerCase();
    return oppDomain.includes(c) || oppTitle.includes(c) || c.includes(oppDomain);
  });
  if (interestMatch) {
    careerInterestScore = 10;
  } else {
    // partial credit if preferred roles align
    const roleMatch = student.preferredRoles.some(pr => oppTitle.includes(pr.toLowerCase()));
    careerInterestScore = roleMatch ? 7 : 4;
  }

  // 4. PREFERENCES (Location / Remote) (Weight: 10 points max)
  let preferencesScore = 0;
  if (opportunity.isRemote) {
    preferencesScore = 10; // Remote matches universally
  } else {
    const oppLoc = opportunity.location.toLowerCase();
    const locMatch = student.preferredLocations.some(pl => 
      pl.toLowerCase().includes(oppLoc) || oppLoc.includes(pl.toLowerCase())
    );
    preferencesScore = locMatch ? 10 : 5;
  }

  // OVERALL SCORE (Max 100)
  const overallScore = Math.min(100, Math.max(0, 
    skillCompatibilityScore + eligibilityScore + careerInterestScore + preferencesScore
  ));

  // Summary statement
  let recommendationSummary = '';
  if (overallScore >= 80) {
    recommendationSummary = `High compatibility profile (${overallScore}%). Strong skill overlap with ${matchedSkills.length} of ${required.length} required competencies verified.`;
  } else if (overallScore >= 60) {
    recommendationSummary = `Good prospective match (${overallScore}%). Eligible candidate with opportunity to bridge ${missingRequiredSkills.length} missing competency gaps.`;
  } else {
    recommendationSummary = `Moderate fit (${overallScore}%). Candidate should prioritize learning ${missingRequiredSkills.slice(0, 2).join(', ')} to boost qualification.`;
  }

  return {
    overallScore,
    skillCompatibilityScore,
    eligibilityScore,
    careerInterestScore,
    preferencesScore,
    matchedSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    eligibilityStatus,
    eligibilityDetails: elDetails,
    recommendationSummary,
  };
}
