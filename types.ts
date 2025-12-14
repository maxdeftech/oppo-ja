export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  BUSINESS = 'BUSINESS',
  FREELANCER = 'FREELANCER',
  ADMIN = 'ADMIN', // MDT Staff
  STAFF_VERIFICATION = 'STAFF_VERIFICATION',
  CEO = 'CEO'
}

export enum ApplicationStatus {
  SUBMITTED = 'Submitted',
  REVIEWING = 'Reviewing',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected'
}

export enum JobType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  CONTRACT = 'Contract',
  REMOTE = 'Remote'
}

export enum Parish {
  KINGSTON = 'Kingston',
  ST_ANDREW = 'St. Andrew',
  ST_CATHERINE = 'St. Catherine',
  CLARENDON = 'Clarendon',
  MANCHESTER = 'Manchester',
  ST_ELIZABETH = 'St. Elizabeth',
  WESTMORELAND = 'Westmoreland',
  HANOVER = 'Hanover',
  ST_JAMES = 'St. James',
  TRELAWNY = 'Trelawny',
  ST_ANN = 'St. Ann',
  ST_MARY = 'St. Mary',
  PORTLAND = 'Portland',
  ST_THOMAS = 'St. Thomas'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  verified?: boolean;
  emailVerified?: boolean;
  location?: Parish;
  trnMasked?: string; // e.g. ***-***-123
  bio?: string;
  experience?: any[]; // JSON structure for experience
  skills?: string[];
  linkedinUrl?: string;
  phone?: string;
}

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  location: Parish;
  type: JobType;
  salaryRange?: string;
  postedDate: string;
  description: string;
  skills: string[];
  isFeatured?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedDate: string;
}

export interface VerificationRequest {
  id: string;
  businessName: string;
  registrationNumber: string;
  trn: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedDate: string;
}
