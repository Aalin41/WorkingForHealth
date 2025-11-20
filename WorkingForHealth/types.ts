export enum StressLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export type EventType = 'stress' | 'happy';

export interface StressEvent {
  id: string;
  date: string; // ISO string
  type: EventType; // New field to distinguish stress vs happy
  points: StressLevel;
  tags: string[];
  description: string;
}

export interface UserSettings {
  onboardingDate: string | null;
  targetResignationDate: string | null;
  name: string;
}

export interface CalculatedStats {
  totalStressPoints: number;
  totalHappyPoints: number;
  
  stressDaysEarned: number; // Days removed from work
  happyDaysEarned: number; // Days added to work (delayed resignation)
  
  stressPointsUntilNextDay: number;
  happyPointsUntilNextDay: number;

  acceleratedResignationDate: Date | null;
  remainingWorkingDays: number | null;
  tenureMonths: number;
  legalNoticeDays: number;
  legalNoticeDate: Date | null;
}