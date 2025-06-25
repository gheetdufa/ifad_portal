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
}

export interface Host extends User {
  role: 'host';
  jobTitle: string;
  organization: string;
  industry: string;
  bio: string;
  experienceType: 'shadowing' | 'interview' | 'both';
  location: 'in-person' | 'virtual' | 'both';
  maxStudents: number;
  verified: boolean;
  matchedStudentIds: string[];
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