import { differenceInMonths, subDays, addDays, addMonths, parseISO, isSaturday, isSunday, isBefore, isSameDay, startOfDay } from 'date-fns';
import { CalculatedStats, StressEvent, UserSettings } from '../types';
import { POINTS_PER_DAY_OFF, TAIWAN_HOLIDAYS } from '../constants';

const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  if (isBefore(endDate, startDate)) return 0;

  let currentDate = startOfDay(startDate);
  const end = startOfDay(endDate);
  let workingDays = 0;

  // Iterate through each day
  while (isBefore(currentDate, end) || isSameDay(currentDate, end)) {
    const dateString = currentDate.toISOString().split('T')[0];
    
    const isWeekend = isSaturday(currentDate) || isSunday(currentDate);
    const isHoliday = TAIWAN_HOLIDAYS.includes(dateString);

    if (!isWeekend && !isHoliday) {
      workingDays++;
    }

    currentDate = addDays(currentDate, 1);
  }

  return workingDays;
};

export const calculateStats = (events: StressEvent[], settings: UserSettings): CalculatedStats => {
  // 1. Separate Stress and Happy events
  const stressEvents = events.filter(e => e.type === 'stress' || e.type === undefined); // Backwards compatibility
  const happyEvents = events.filter(e => e.type === 'happy');

  // 2. Calculate totals
  const totalStressPoints = stressEvents.reduce((sum, event) => sum + event.points, 0);
  const totalHappyPoints = happyEvents.reduce((sum, event) => sum + event.points, 0);

  // 3. Calculate Days Adjustment
  // Stress removes days (Accelerates resignation)
  const stressDaysEarned = Math.floor(totalStressPoints / POINTS_PER_DAY_OFF);
  const stressPointsUntilNextDay = POINTS_PER_DAY_OFF - (totalStressPoints % POINTS_PER_DAY_OFF);

  // Happy adds days (Delays resignation)
  const happyDaysEarned = Math.floor(totalHappyPoints / POINTS_PER_DAY_OFF);
  const happyPointsUntilNextDay = POINTS_PER_DAY_OFF - (totalHappyPoints % POINTS_PER_DAY_OFF);

  // Net impact on resignation date: (Target - StressDays + HappyDays)
  // Example: Target Jan 10. Stress Days 2. Happy Days 1.
  // Result: Jan 10 - 2 + 1 = Jan 9.
  
  let acceleratedResignationDate: Date | null = null;
  let legalNoticeDate: Date | null = null;
  let tenureMonths = 0;
  let legalNoticeDays = 0;
  let remainingWorkingDays: number | null = null;

  if (settings.targetResignationDate) {
    const targetDate = parseISO(settings.targetResignationDate);
    
    // Apply both factors
    const dateAfterStress = subDays(targetDate, stressDaysEarned);
    acceleratedResignationDate = addDays(dateAfterStress, happyDaysEarned);
    
    // Calculate Working Days from TODAY until Accelerated Date
    const today = new Date();
    if (isBefore(acceleratedResignationDate, startOfDay(today))) {
      remainingWorkingDays = 0;
    } else {
      remainingWorkingDays = calculateWorkingDays(today, acceleratedResignationDate);
    }

    if (settings.onboardingDate) {
      const onboardDate = parseISO(settings.onboardingDate);
      
      // Calculate tenure
      tenureMonths = differenceInMonths(acceleratedResignationDate, onboardDate);

      // Taiwan Labor Standards Act Notice Periods
      if (tenureMonths >= 36) {
        legalNoticeDays = 30;
      } else if (tenureMonths >= 12) {
        legalNoticeDays = 20;
      } else if (tenureMonths >= 3) {
        legalNoticeDays = 10;
      } else {
        legalNoticeDays = 0;
      }

      if (legalNoticeDays > 0) {
        legalNoticeDate = subDays(acceleratedResignationDate, legalNoticeDays);
      }
    }
  }

  return {
    totalStressPoints,
    totalHappyPoints,
    stressDaysEarned,
    happyDaysEarned,
    stressPointsUntilNextDay,
    happyPointsUntilNextDay,
    acceleratedResignationDate,
    remainingWorkingDays,
    tenureMonths,
    legalNoticeDays,
    legalNoticeDate,
  };
};

export const getRecommendedDates = (onboardingDateStr: string | null) => {
  if (!onboardingDateStr) return { adaptationDate: null, experienceDate: null };
  
  const onboard = parseISO(onboardingDateStr);
  return {
    adaptationDate: addMonths(onboard, 12), // 12 months
    experienceDate: addMonths(onboard, 15), // 15 months
  };
};