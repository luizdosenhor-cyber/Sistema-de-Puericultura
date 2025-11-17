
import { CONSULTATION_MILESTONES_IN_MONTHS } from '../constants';
import { Consultation, ConsultationStatus } from '../types';

const adjustForWeekend = (date: Date): Date => {
  const day = date.getDay();
  if (day === 6) { // Saturday
    date.setDate(date.getDate() + 2);
  } else if (day === 0) { // Sunday
    date.setDate(date.getDate() + 1);
  }
  return date;
};

export const generateConsultationSchedule = (dateOfBirth: string): Consultation[] => {
  const dob = new Date(dateOfBirth);
  // Adjust for timezone offset
  const dobUTC = new Date(dob.valueOf() + dob.getTimezoneOffset() * 60 * 1000);

  return CONSULTATION_MILESTONES_IN_MONTHS.map((milestone, index) => {
    const scheduledDate = new Date(dobUTC);
    if (milestone.days !== undefined) {
      scheduledDate.setDate(scheduledDate.getDate() + milestone.days);
    }
    if (milestone.months !== undefined) {
      scheduledDate.setMonth(scheduledDate.getMonth() + milestone.months);
    }

    const adjustedDate = adjustForWeekend(scheduledDate);
    
    return {
      id: `${dateOfBirth}-${index}`,
      milestone: milestone.name,
      scheduledDate: adjustedDate.toISOString().split('T')[0],
      status: ConsultationStatus.Pendente,
    };
  });
};
