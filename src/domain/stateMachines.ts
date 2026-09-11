/**
 * Academia–Industry Collaboration Portal
 * State Machine Rules & Transition Validators
 */

import { ApplicationStatus, OpportunityStatus } from '../types';

export const VALID_APPLICATION_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  APPLIED: ['UNDER_REVIEW', 'REJECTED'],
  UNDER_REVIEW: ['SHORTLISTED', 'REJECTED'],
  SHORTLISTED: ['INTERVIEW', 'REJECTED'],
  INTERVIEW: ['SELECTED', 'REJECTED'],
  SELECTED: [],
  REJECTED: [],
};

export function canTransitionApplication(
  currentStatus: ApplicationStatus,
  targetStatus: ApplicationStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_APPLICATION_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}

export const VALID_OPPORTUNITY_TRANSITIONS: Record<OpportunityStatus, OpportunityStatus[]> = {
  DRAFT: ['PUBLISHED'],
  PUBLISHED: ['CLOSED'],
  CLOSED: ['PUBLISHED'], // Can reopen closed listing if renewed
};

export function canTransitionOpportunity(
  currentStatus: OpportunityStatus,
  targetStatus: OpportunityStatus
): boolean {
  if (currentStatus === targetStatus) return true;
  const allowed = VALID_OPPORTUNITY_TRANSITIONS[currentStatus] || [];
  return allowed.includes(targetStatus);
}
