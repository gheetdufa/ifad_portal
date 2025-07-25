export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'host' | 'admin';
  createdAt: string;
}

export interface Student extends User {
  role: 'student';
  major: string;
  graduationYear: number;
  orientationCompleted: boolean;
  applicationSubmitted: boolean;
  matched: boolean;
  matchedHostId?: string;
  favoriteHostIds?: string[];
}

export interface Host extends User {
  role: 'host';
  
  // Personal Information
  preferredPrefix?: string; // Mr., Ms., Mrs., Mx., Dr., etc.
  workEmail: string;
  preferredPhone: string;
  
  // Previous Experience
  previousHostExperience: boolean;
  
  // UMD Affiliation
  isUmdParent: boolean;
  isUmdAlumni: boolean;
  
  // Work Information
  jobTitle: string;
  organization: string; // Company/Org Name
  companyWebsite?: string;
  companyAddress: string;
  cityState: string;
  zipCode: string;
  
  // Career Fields (up to 5)
  careerFields: string[];
  careerFieldsOther?: string;
  
  // Opportunity Type
  opportunityType: 'in-person' | 'virtual';
  
  // Work Location & Accessibility
  isDcMetroAccessible?: boolean;
  workLocationAccessibilityUnsure?: boolean;
  isPhysicalOffice: boolean; // confirms they're not teleworking
  isFederalAgency: boolean;
  
  // Requirements
  requiresCitizenship: boolean;
  requiresBackgroundCheck: boolean;
  
  // Organization Description
  organizationDescription: string;
  experienceDescription: string;
  
  // Capacity & Availability
  maxStudents: number;
  availableDays: string[]; // ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri']
  availableWinterSession: boolean;
  additionalInfo?: string;
  
  // Recruitment Interest
  interestedInRecruitment: boolean;
  
  // Optional Identities
  sharedIdentities: string[];
  customIdentities?: { religion?: string; other?: string };
  
  // Legacy fields for compatibility
  industry: string; // derived from careerFields[0] or 'Other'
  bio: string; // derived from organizationDescription
  experienceType: 'shadowing' | 'interview' | 'both'; // derived from opportunityType
  location: 'in-person' | 'virtual' | 'both'; // derived from opportunityType
  verified: boolean;
  matchedStudentIds: string[];
  visibilitySettings?: HostVisibilitySettings;
}

export interface HostVisibilitySettings {
  showCompanyDescription: boolean;
  showExpectations: boolean;
  showLocation: boolean;
  showAdditionalInfo: boolean;
  showContactInfo: boolean;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

export interface Application {
  id: string;
  studentId: string;
  rankedHostIds: string[];
  submittedAt: string;
  status: 'submitted' | 'matched' | 'unmatched';
}

export interface Match {
  id: string;
  studentId: string;
  hostId: string;
  status: 'pending' | 'confirmed' | 'completed';
  scheduledDate?: string;
  createdAt: string;
}

export interface ProgramTimeline {
  hostRegistrationOpen: string;
  hostRegistrationClose: string;
  studentApplicationOpen: string;
  studentApplicationClose: string;
  matchingComplete: string;
  experienceStart: string;
  experienceEnd: string;
}

export interface StudentFavorites {
  studentId: string;
  favoriteHostIds: string[];
  rankedPreferences: string[];
  lastUpdated: string;
}

// Constants for form options
export const PREFERRED_PREFIXES = [
  'None',
  'Mr.',
  'Ms.',
  'Mrs.',
  'Mx.',
  'Dr.',
  'Honorable',
  'Judge',
  'Officer',
  'Other'
] as const;

export const CAREER_FIELDS = [
  'Agriculture/Environment',
  'Architecture/Real Estate',
  'Arts and Entertainment',
  'Business',
  'Communications, Journalism, Media',
  'Computing/Computer Science and Technology',
  'Consulting',
  'Cybersecurity',  
  'Data Science and Data Analytics',
  'Education',
  'Engineering',
  'Government and International Relations',
  'Health and Healthcare',
  'Hospitality and Tourism',
  'Law and Law Enforcement',
  'Military',
  'Museums and Library Services',
  'NonProfit and Social Services',
  'Policy and Advocacy',
  'Sales and Marketing',
  'Science and Research',
  'Sports and Recreation',
  'Other'
] as const;

export const AVAILABLE_DAYS = [
  'Any weekday (Mon–Fri)',
  'Mon',
  'Tues', 
  'Wed',
  'Thurs',
  'Fri'
] as const;

export const IDENTITY_OPTIONS = [
  'ADD/ADHD',
  'Asian American & Pacific Islander',
  'Black',
  '(Dis)Ability',
  'First Generation College Student (former)',
  'International Student (former)',
  'Latinx',
  'LGBTQ+',
  'Middle Eastern or North African',
  'Multiracial',
  'Native American Indian',
  'Nonbinary',
  'Religion',
  'Transgender',
  'Undocumented/DACA',
  'Veteran',
  'Woman',
  'Other'
] as const;