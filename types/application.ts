export type ApplicationStatus = 'processing' | 'accepted' | 'rejected' | 'applied for VPD' | '';

export interface UniversityApplication {
  id: string;
  universityName: string;
  semesterFee: string;
  city: string;
  applyThrough: string;
  applicationStartDate: string;
  applicationEndDate: string;
  subject: string;
  livingCost: string;
  documentsRequired: string;
  ieltsScore: string;
  applicationFee: string;
  applied: boolean;
  status: ApplicationStatus;
  usefulLinks: string;
  createdAt: string;
}
