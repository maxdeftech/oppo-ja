import { Parish, JobType, UserRole } from './types';

export const PARISHES = Object.values(Parish);
export const JOB_TYPES = Object.values(JobType);

export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior React Developer',
    companyName: 'Digicel Group',
    location: Parish.KINGSTON,
    type: JobType.FULL_TIME,
    salaryRange: 'JMD 4.5M - 6M / yr',
    postedDate: '2 days ago',
    description: 'We are looking for an experienced frontend engineer to lead our digital transformation projects.',
    skills: ['React', 'TypeScript', 'Tailwind'],
    isFeatured: true
  },
  {
    id: '2',
    title: 'Financial Analyst',
    companyName: 'Sagicor Jamaica',
    location: Parish.ST_ANDREW,
    type: JobType.FULL_TIME,
    salaryRange: 'JMD 3M - 4.2M / yr',
    postedDate: '5 days ago',
    description: 'Analyze financial data and provide forecasting support for the investment banking division.',
    skills: ['Excel', 'Financial Modeling', 'Risk Analysis'],
    isFeatured: false
  },
  {
    id: '3',
    title: 'Hospitality Manager',
    companyName: 'Sandals Resorts',
    location: Parish.ST_JAMES,
    type: JobType.CONTRACT,
    salaryRange: 'Negotiable',
    postedDate: '1 week ago',
    description: 'Oversee guest relations and operations at our flagship Montego Bay resort.',
    skills: ['Management', 'Customer Service', 'Operations'],
    isFeatured: true
  },
  {
    id: '4',
    title: 'Remote Customer Support',
    companyName: 'Iterative BPO',
    location: Parish.MANCHESTER,
    type: JobType.REMOTE,
    salaryRange: 'JMD 800/hr',
    postedDate: 'Just now',
    description: 'Work from home opportunity supporting US-based healthcare clients.',
    skills: ['Communication', 'English', 'Tech Savvy'],
    isFeatured: false
  }
];

export const MOCK_VERIFICATIONS = [
  {
    id: 'v1',
    businessName: 'TechSolutions Ja Ltd.',
    registrationNumber: '88291-C',
    trn: '555-999-111',
    status: 'Pending',
    submittedDate: '2023-10-25'
  },
  {
    id: 'v2',
    businessName: 'Ocho Rios Crafts',
    registrationNumber: '11293-A',
    trn: '222-333-444',
    status: 'Pending',
    submittedDate: '2023-10-24'
  }
];
