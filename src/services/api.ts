// API service for handling backend requests
// This is a placeholder service that returns mock data for demo purposes

export interface PublicHost {
  id: string;
  ifadOption: string;
  spotsAvailable: number;
  careerFields: string[];
  companyName: string;
  jobTitle: string;
  website: string;
  companyDescription: string;
  hostExpectations: string;
  workLocation: string;
  dcMetroAccessible: string;
  federalAgency: string;
  requiresCitizenship: string;
  requiresBackgroundCheck: string;
  availableDays: string;
  springBreakAvailable: string;
  umdAlumni: string;
  additionalInfo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface DashboardStats {
  totalHosts: number;
  verifiedHosts: number;
  pendingHosts: number;
  totalStudents: number;
  completedOrientations: number;
  submittedApplications: number;
  totalMatches: number;
  completedExperiences: number;
  lastUpdated: string;
}

export interface RecentActivity {
  id: string;
  type: 'host_registration' | 'application_submitted' | 'host_verified' | 'match_completed' | 'orientation_completed';
  message: string;
  timestamp: string;
  entityId?: string;
}

export interface SemesterRegistration {
  semester: string;
  maxStudents: number;
  availableDays: string[];
  experienceType: 'virtual' | 'in-person' | 'both';
  additionalInfo: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  updatedAt: string;
}

class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || '';
  
  // In-memory storage for demo purposes - replace with actual database calls
  private hosts: any[] = [];
  private students: any[] = [];
  private applications: any[] = [];
  private matches: any[] = [];
  private activities: RecentActivity[] = [];

  async getPublicHosts(): Promise<ApiResponse<{ hosts: PublicHost[] }>> {
    try {
      // In a real implementation, this would make an actual API call
      // For now, return empty data to indicate no hosts available from API
      return {
        success: false,
        data: { hosts: [] },
        message: 'API service not configured - using fallback data'
      };
    } catch (error) {
      console.error('Failed to fetch public hosts:', error);
      return {
        success: false,
        data: { hosts: [] },
        message: 'Failed to fetch hosts from API'
      };
    }
  }

  async submitHostRegistration(hostData: any): Promise<ApiResponse<any>> {
    try {
      const host = { 
        id: Date.now().toString(), 
        ...hostData, 
        verified: false,
        createdAt: new Date().toISOString()
      };
      
      this.hosts.push(host);
      
      // Add to recent activity
      this.activities.unshift({
        id: Date.now().toString(),
        type: 'host_registration',
        message: `New host registered: ${hostData.firstName} ${hostData.lastName} (${hostData.organization})`,
        timestamp: new Date().toISOString(),
        entityId: host.id
      });
      
      // Keep only last 20 activities
      if (this.activities.length > 20) {
        this.activities = this.activities.slice(0, 20);
      }
      
      return {
        success: true,
        data: host,
        message: 'Host registration submitted successfully'
      };
    } catch (error) {
      console.error('Failed to submit host registration:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to submit host registration'
      };
    }
  }

  async submitStudentApplication(studentData: any): Promise<ApiResponse<any>> {
    try {
      const application = { 
        id: Date.now().toString(), 
        ...studentData,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };
      
      this.applications.push(application);
      
      // Add to recent activity
      this.activities.unshift({
        id: Date.now().toString(),
        type: 'application_submitted',
        message: `Student application submitted: ${studentData.firstName} ${studentData.lastName}`,
        timestamp: new Date().toISOString(),
        entityId: application.id
      });
      
      // Keep only last 20 activities
      if (this.activities.length > 20) {
        this.activities = this.activities.slice(0, 20);
      }
      
      return {
        success: true,
        data: application,
        message: 'Student application submitted successfully'
      };
    } catch (error) {
      console.error('Failed to submit student application:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to submit student application'
      };
    }
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Calculate stats from in-memory data
      const verifiedHosts = this.hosts.filter(h => h.verified).length;
      const pendingHosts = this.hosts.filter(h => !h.verified).length;
      const completedOrientations = this.students.filter(s => s.orientationCompleted).length;
      
      const stats: DashboardStats = {
        totalHosts: this.hosts.length,
        verifiedHosts,
        pendingHosts,
        totalStudents: this.students.length,
        completedOrientations,
        submittedApplications: this.applications.length,
        totalMatches: this.matches.length,
        completedExperiences: this.matches.filter(m => m.status === 'completed').length,
        lastUpdated: new Date().toISOString()
      };

      return {
        success: true,
        data: stats,
        message: 'Dashboard stats retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to get dashboard stats:', error);
      return {
        success: false,
        data: {
          totalHosts: 0,
          verifiedHosts: 0,
          pendingHosts: 0,
          totalStudents: 0,
          completedOrientations: 0,
          submittedApplications: 0,
          totalMatches: 0,
          completedExperiences: 0,
          lastUpdated: new Date().toISOString()
        },
        message: 'Failed to retrieve dashboard stats'
      };
    }
  }

  async getRecentActivity(): Promise<ApiResponse<RecentActivity[]>> {
    try {
      return {
        success: true,
        data: this.activities.slice(0, 10), // Return last 10 activities
        message: 'Recent activity retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve recent activity'
      };
    }
  }

  async verifyHost(hostId: string): Promise<ApiResponse<any>> {
    try {
      const hostIndex = this.hosts.findIndex(h => h.id === hostId);
      if (hostIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Host not found'
        };
      }

      this.hosts[hostIndex].verified = true;
      this.hosts[hostIndex].verifiedAt = new Date().toISOString();

      // Add to recent activity
      this.activities.unshift({
        id: Date.now().toString(),
        type: 'host_verified',
        message: `Host verified: ${this.hosts[hostIndex].firstName} ${this.hosts[hostIndex].lastName} (${this.hosts[hostIndex].organization})`,
        timestamp: new Date().toISOString(),
        entityId: hostId
      });

      // Keep only last 20 activities
      if (this.activities.length > 20) {
        this.activities = this.activities.slice(0, 20);
      }

      return {
        success: true,
        data: this.hosts[hostIndex],
        message: 'Host verified successfully'
      };
    } catch (error) {
      console.error('Failed to verify host:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to verify host'
      };
    }
  }

  async createMatch(studentId: string, hostId: string): Promise<ApiResponse<any>> {
    try {
      const match = {
        id: Date.now().toString(),
        studentId,
        hostId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.matches.push(match);

      // Add to recent activity
      this.activities.unshift({
        id: Date.now().toString(),
        type: 'match_completed',
        message: `New match created`,
        timestamp: new Date().toISOString(),
        entityId: match.id
      });

      // Keep only last 20 activities
      if (this.activities.length > 20) {
        this.activities = this.activities.slice(0, 20);
      }

      return {
        success: true,
        data: match,
        message: 'Match created successfully'
      };
    } catch (error) {
      console.error('Failed to create match:', error);
      return {
        success: false,
        data: null,
        message: 'Failed to create match'
      };
    }
  }

  // Semester Registration endpoints
  async registerForSemester(registrationData: {
    semester: string;
    maxStudents: number;
    availableDays: string[];
    experienceType: 'virtual' | 'in-person' | 'both';
    additionalInfo: string;
  }): Promise<ApiResponse<SemesterRegistration>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/semester-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to register for semester');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error registering for semester:', error);
      return {
        success: false,
        data: {} as SemesterRegistration,
        message: error instanceof Error ? error.message : 'Failed to register for semester',
      };
    }
  }

  async getSemesterRegistration(semester: string): Promise<ApiResponse<{registered: boolean, registration: SemesterRegistration | null}>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/semester-registration?semester=${encodeURIComponent(semester)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get semester registration');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error getting semester registration:', error);
      return {
        success: false,
        data: { registered: false, registration: null },
        message: error instanceof Error ? error.message : 'Failed to get semester registration',
      };
    }
  }

  async updateSemesterRegistration(registrationData: {
    semester: string;
    maxStudents?: number;
    availableDays?: string[];
    experienceType?: 'virtual' | 'in-person' | 'both';
    additionalInfo?: string;
  }): Promise<ApiResponse<SemesterRegistration>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/semester-registration`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update semester registration');
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error updating semester registration:', error);
      return {
        success: false,
        data: {} as SemesterRegistration,
        message: error instanceof Error ? error.message : 'Failed to update semester registration',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;