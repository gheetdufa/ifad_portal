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
  private baseUrl = 'https://rystvdeu40.execute-api.us-east-1.amazonaws.com/prod';
  
  // In-memory storage for demo purposes - replace with actual database calls
  private hosts: any[] = [];
  private students: any[] = [];
  private applications: any[] = [];
  private matches: any[] = [];
  private activities: RecentActivity[] = [];

  private isDevMode(): boolean {
    return !this.baseUrl;
  }

  private saveActivity(activity: Omit<RecentActivity, 'id' | 'timestamp'>) {
    const item: RecentActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity,
    };
    this.activities.unshift(item);
    if (this.activities.length > 50) this.activities = this.activities.slice(0, 50);
  }

  private persistMockHost(host: any) {
    const existingHosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
    const updated = [host, ...existingHosts];
    localStorage.setItem('ifad_mock_hosts', JSON.stringify(updated));
  }

  private persistMockSemesterRegistration(reg: SemesterRegistration & { userId?: string }) {
    const existing = JSON.parse(localStorage.getItem('ifad_mock_semester_regs') || '[]');
    const updated = [reg, ...existing];
    localStorage.setItem('ifad_mock_semester_regs', JSON.stringify(updated));
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ifad_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    // Only include dev header when no API URL (pure local dev)
    const devEmail = localStorage.getItem('ifad_dev_email');
    if (!this.baseUrl && devEmail) headers['X-Dev-User-Email'] = devEmail;
    return headers;
  }

  async login(email: string, password: string): Promise<ApiResponse<any>> {
    try {
      // Dev-mode fallback: allow login without backend using heuristic role detection
      if (this.isDevMode()) {
        let role: 'admin' | 'host' | 'student' = 'student';
        const lower = (email || '').toLowerCase();
        if (lower === 'ifad@umd.edu' || lower === 'admin@umd.edu' || lower.includes('admin')) {
          role = 'admin';
        } else if (lower.includes('host') || lower.endsWith('@company.com')) {
          role = 'host';
        }

        const firstName = email?.split('@')[0]?.split('.')[0] || 'Demo';
        const lastName = email?.split('@')[0]?.split('.')[1] || 'User';
        const user = {
          id: `${role}-demo-${Date.now()}`,
          userId: `${role}-demo-${Date.now()}`,
          email,
          firstName,
          lastName,
          role,
          status: 'approved',
          verified: role !== 'student',
        };

        localStorage.setItem('ifad_current_user_email', email);
        return {
          success: true,
          data: { token: 'demo-token', user },
          message: 'Login successful (dev mode)'
        };
      }

      if (!this.baseUrl) {
        throw new Error('API URL not configured. Please set VITE_API_URL in your .env file.');
      }
      console.log('[api] POST /auth/login', {
        baseUrl: this.baseUrl,
        email,
      });
      let response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      });

      // Remove legacy prod→staging fallback to avoid pinning a wrong base URL

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      return {
        success: true,
        data: result.data,
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    try {
      // Dev-mode: persist a host registration locally so admin can see it
      if (this.isDevMode()) {
        const nowIso = new Date().toISOString();
        const role = (userData?.role as string) || 'host';
        const hostRecord = {
          id: `host-${Date.now()}`,
          userId: `host-${Date.now()}`,
          email: userData.workEmail || userData.email,
          contactName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || (userData.workEmail || userData.email),
          position: userData.jobTitle || userData.title || 'Host',
          companyName: userData.organization || userData.company || userData.companyName,
          location: userData.cityState || userData.location || (userData.workLocation === 'virtual' ? 'Virtual' : ''),
          status: 'pending',
          verified: false,
          createdAt: nowIso,
          updatedAt: nowIso,
          registrationData: {
            organizationDescription: userData.organizationDescription || userData.bio || '',
            experienceDescription: userData.experienceDescription || '',
            careerFields: userData.careerFields || (userData.industry ? [userData.industry] : []),
            opportunityType: userData.opportunityType || userData.experienceType || 'virtual',
            requiresCitizenship: !!userData.requiresCitizenship,
            requiresBackgroundCheck: !!userData.requiresBackgroundCheck,
            availableDays: userData.availableDays || [],
          },
        };
        this.persistMockHost(hostRecord);
        this.saveActivity({
          type: 'host_registration',
          message: `New host registration from ${hostRecord.contactName || hostRecord.email}`,
          entityId: hostRecord.id,
        });
        localStorage.setItem('ifad_current_user_email', hostRecord.email);
        return {
          success: true,
          data: { user: { role, email: hostRecord.email, userId: hostRecord.userId, id: hostRecord.id } },
          message: 'Registration successful (dev mode)'
        };
      }

      if (!this.baseUrl) throw new Error('API URL not configured. Please set VITE_API_URL in your .env file.');

      const redacted = {
        ...userData,
        password: userData?.password ? '***' : undefined,
      };
      console.log('[api] POST /auth/register', {
        url: `${this.baseUrl}/auth/register`,
        baseUrl: this.baseUrl,
        body: redacted,
      });

      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      
      console.log('[api] /auth/register response', {
        status: response.status,
        statusText: response.statusText,
        data: result
      });
      
      if (!response.ok) {
        console.error('Registration failed with response:', result);
        throw new Error(result.error || result.message || 'Registration failed');
      }

      return {
        success: true,
        data: result,
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    try {
      // Dev-mode: return cached user profile if available
      if (this.isDevMode()) {
        const cachedUser = localStorage.getItem('ifad_user');
        if (cachedUser) {
          return { success: true, data: JSON.parse(cachedUser), message: 'Profile (dev cached)' };
        }
        // Try to infer from mock hosts by current email
        const currentUserEmail = localStorage.getItem('ifad_current_user_email');
        if (currentUserEmail) {
          const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
          const match = hosts.find((h: any) => h.email === currentUserEmail || h.workEmail === currentUserEmail);
          if (match) return { success: true, data: match, message: 'Profile (dev host)' };
        }
        return { success: false, data: null as any, message: 'No user profile (dev mode)' };
      }

      if (!this.baseUrl) throw new Error('API URL not configured. Please set VITE_API_URL in your .env file.');
      console.log('[api] GET /users/profile', { baseUrl: this.baseUrl });
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get user profile');
      }

      return {
        success: true,
        data: result.data,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get user profile'
      };
    }
  }

  async logout(): Promise<ApiResponse<any>> {
    try {
      // Optional: call a logout endpoint if present; otherwise clear client state only
      return { success: true, data: null, message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      // Don't fail logout on API error
      return {
        success: true,
        data: null,
        message: 'Logout completed'
      };
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) return { success: true, data: null, message: 'Reset code sent (dev mode)' };
      const res = await fetch(`${this.baseUrl}/auth/forgot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to start password reset');
      return { success: true, data: json, message: 'Reset code sent' };
    } catch (e) {
      return { success: false, data: null, message: e instanceof Error ? e.message : 'Failed to start password reset' };
    }
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) return { success: true, data: null, message: 'Password reset (dev mode)' };
      const res = await fetch(`${this.baseUrl}/auth/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to reset password');
      return { success: true, data: json, message: 'Password has been reset' };
    } catch (e) {
      return { success: false, data: null, message: e instanceof Error ? e.message : 'Failed to reset password' };
    }
  }

  async getPublicHosts(): Promise<ApiResponse<{ hosts: PublicHost[] }>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      console.log('[api] GET /public/hosts', { baseUrl: this.baseUrl });
      const response = await fetch(`${this.baseUrl}/public/hosts`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch public hosts');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: { hosts: result.data || [] },
        message: 'Public hosts retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to fetch public hosts:', error);
      return {
        success: false,
        data: { hosts: [] },
        message: 'Failed to fetch hosts from API - using fallback'
      };
    }
  }

  async submitHostRegistration(hostData: any): Promise<ApiResponse<any>> {
    try {
      if (this.isDevMode()) {
        const nowIso = new Date().toISOString();
        const hostRecord = {
          id: `host-${Date.now()}`,
          userId: `host-${Date.now()}`,
          email: hostData.workEmail || hostData.email,
          contactName: `${hostData.firstName || ''} ${hostData.lastName || ''}`.trim() || (hostData.workEmail || hostData.email),
          position: hostData.jobTitle || 'Host',
          companyName: hostData.organization,
          location: hostData.cityState || (hostData.workLocation === 'virtual' ? 'Virtual' : ''),
          status: 'pending',
          verified: false,
          createdAt: nowIso,
          updatedAt: nowIso,
          registrationData: {
            organizationDescription: hostData.organizationDescription || '',
            experienceDescription: hostData.experienceDescription || '',
            careerFields: hostData.careerFields || [],
            opportunityType: hostData.opportunityType || 'virtual',
            requiresCitizenship: !!hostData.requiresCitizenship,
            requiresBackgroundCheck: !!hostData.requiresBackgroundCheck,
            availableDays: hostData.availableDays || [],
          },
        };
        this.persistMockHost(hostRecord);
        this.saveActivity({ type: 'host_registration', message: `New host registration from ${hostRecord.contactName || hostRecord.email}`, entityId: hostRecord.id });
        localStorage.setItem('ifad_current_user_email', hostRecord.email);
        return { success: true, data: { host: hostRecord }, message: 'Host registration submitted successfully (dev mode)' };
      }
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const redacted = { ...hostData, password: hostData?.password ? '***' : undefined };
      console.log('[api] POST /auth/register (host)', {
        url: `${this.baseUrl}/auth/register`,
        baseUrl: this.baseUrl,
        body: redacted,
      });
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...hostData, role: 'host' }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Host registration failed');
      }

      return {
        success: true,
        data: result,
        message: result.message || 'Host registration submitted successfully'
      };
    } catch (error) {
      console.error('Failed to submit host registration:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to submit host registration'
      };
    }
  }

  async submitStudentApplication(studentData: any): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/applications`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(studentData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Student application failed');
      }

      return {
        success: true,
        data: result,
        message: 'Student application submitted successfully'
      };
    } catch (error) {
      console.error('Failed to submit student application:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to submit student application'
      };
    }
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Calculate stats from in-memory data
      if (!this.baseUrl) throw new Error('API URL not configured.');
      // Optionally call an admin stats endpoint; placeholder returns zeros until wired
      const verifiedHosts = 0;
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
      // Use updateHostStatus method for consistency
      return await this.updateHostStatus(hostId, 'approved');
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
    requiresBackgroundCheck?: boolean;
    requiresCitizenship?: boolean;
    isDcMetroAccessible?: boolean;
    dmvAreaConfirm?: boolean;
    holidayBreakAvailable?: boolean;
    understandPhysicalOffice?: boolean;
  }): Promise<ApiResponse<SemesterRegistration>> {
    try {
      if (!this.baseUrl) {
        const currentUserEmail = localStorage.getItem('ifad_current_user_email');
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const host = hosts.find((h: any) => h.email === currentUserEmail || h.workEmail === currentUserEmail);
        const baseRecord = {
          semester: registrationData.semester,
          maxStudents: registrationData.maxStudents,
          availableDays: registrationData.availableDays,
          additionalInfo: registrationData.additionalInfo,
          status: 'pending' as const,
          registeredAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (registrationData.experienceType === 'both') {
          const rec1: SemesterRegistration = { ...baseRecord, experienceType: 'in-person' } as SemesterRegistration;
          const rec2: SemesterRegistration = { ...baseRecord, experienceType: 'virtual' } as SemesterRegistration;
          this.persistMockSemesterRegistration({ ...rec1, userId: host?.userId || host?.id });
          this.persistMockSemesterRegistration({ ...rec2, userId: host?.userId || host?.id });
          return { success: true, data: rec1, message: 'Semester registration saved for both options (dev mode)' };
        }
        const record: SemesterRegistration = { ...baseRecord, experienceType: registrationData.experienceType } as SemesterRegistration;
        this.persistMockSemesterRegistration({ ...record, userId: host?.userId || host?.id });
        return { success: true, data: record, message: 'Semester registration saved (dev mode)' };
      }
      // Backend mode: if both, create two registrations
      const redacted = { ...registrationData };
      console.log('[api] POST /users/semester-registration start', { baseUrl: this.baseUrl, payload: redacted });
      const upsert = async (payload: any): Promise<SemesterRegistration> => {
        // Try create
        let res = await fetch(`${this.baseUrl}/users/semester-registration`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        let json = await res.json();
        console.log('[api] POST /users/semester-registration result', { status: res.status, ok: res.ok, json });
        if (res.ok) return json.data as SemesterRegistration;
        // If already exists, update instead
        if (res.status === 409) {
          console.log('[api] POST returned 409, attempting PUT upsert');
          res = await fetch(`${this.baseUrl}/users/semester-registration`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(payload),
          });
          json = await res.json();
          console.log('[api] PUT /users/semester-registration result', { status: res.status, ok: res.ok, json });
          if (!res.ok) throw new Error(json.message || 'Failed to update existing semester registration');
          return json.data as SemesterRegistration;
        }
        throw new Error(json.message || 'Failed to register for semester');
      };

      if (registrationData.experienceType === 'both') {
        const first = await upsert({ ...registrationData, experienceType: 'in-person' });
        await upsert({ ...registrationData, experienceType: 'virtual' });
        return { success: true, data: first, message: 'Semester registrations upserted for both options' };
      } else {
        const data = await upsert(registrationData);
        return { success: true, data };
      }
    } catch (error) {
      console.error('Error registering for semester:', error);
      return {
        success: false,
        data: {} as SemesterRegistration,
        message: error instanceof Error ? error.message : 'Failed to register for semester',
      };
    }
  }

  async getProfile(): Promise<ApiResponse<any>> {
    try {
      // Development mode - use mock functionality if no API URL is configured
      if (!this.baseUrl) {
        console.log('Development mode: No API URL configured, using mock profile data');
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if user is logged in and get their data
        const currentUserEmail = localStorage.getItem('ifad_current_user_email');
        if (!currentUserEmail) {
          throw new Error('No user logged in');
        }
        
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const currentHost = hosts.find((h: any) => h.workEmail === currentUserEmail || h.email === currentUserEmail);
        
        if (!currentHost) {
          throw new Error('User profile not found');
        }
        
        return {
          success: true,
          data: currentHost,
          message: 'Profile retrieved successfully'
        };
      }
      
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get profile');
      }

      return {
        success: true,
        data: result.data ?? result,
        message: 'Profile retrieved successfully'
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get profile'
      };
    }
  }

  async getUserById(userId: string, opts?: { semester?: string }): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const qs = opts?.semester ? `?semester=${encodeURIComponent(opts.semester)}` : '';
      const response = await fetch(`${this.baseUrl}/users/${encodeURIComponent(userId)}${qs}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to get user');
      return { success: true, data: result.data || result, message: 'User retrieved' };
    } catch (e) {
      return { success: false, data: null, message: e instanceof Error ? e.message : 'Failed to get user' };
    }
  }

  async getAdminCurrentSemester(): Promise<ApiResponse<{ semester: string }>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const res = await fetch(`${this.baseUrl}/admin/semester`, { method: 'GET', headers: this.getAuthHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to get current semester');
      const payload = (json && json.data) ? json.data : json;
      return { success: true, data: { semester: payload.semester }, message: 'Current semester retrieved' };
    } catch (e) {
      return { success: false, data: { semester: '' } as any, message: e instanceof Error ? e.message : 'Failed to get current semester' };
    }
  }

  async setAdminCurrentSemester(semester: string): Promise<ApiResponse<{ semester: string }>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const res = await fetch(`${this.baseUrl}/admin/semester`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ semester }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to set current semester');
      const payload = (json && json.data) ? json.data : json;
      return { success: true, data: { semester: payload.semester }, message: 'Current semester updated' };
    } catch (e) {
      return { success: false, data: { semester: '' } as any, message: e instanceof Error ? e.message : 'Failed to set current semester' };
    }
  }

  async updateProfile(updates: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) {
        // Dev mode: merge into mock current host
        const currentUserEmail = localStorage.getItem('ifad_current_user_email');
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const idx = hosts.findIndex((h: any) => h.email === currentUserEmail || h.workEmail === currentUserEmail);
        if (idx >= 0) {
          hosts[idx] = { ...hosts[idx], ...updates, updatedAt: new Date().toISOString() };
          localStorage.setItem('ifad_mock_hosts', JSON.stringify(hosts));
          return { success: true, data: hosts[idx], message: 'Profile updated (dev mode)' };
        }
        return { success: false, data: null, message: 'No profile to update (dev mode)' };
      }
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }
      return { success: true, data: result.data || result, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  }

  async getSemesterRegistration(semester?: string): Promise<ApiResponse<{registered: boolean, registration: SemesterRegistration | null, semester?: string}>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/users/semester-registration${semester ? `?semester=${encodeURIComponent(semester)}` : ''}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
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
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/users/semester-registration`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
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

  async getHosts(filters?: { verified?: boolean; limit?: number; status?: 'approved' | 'pending' | 'rejected' | 'all'; lastKey?: string }): Promise<ApiResponse<{ hosts: any[]; lastEvaluatedKey?: string | null }>> {
    try {
      // Development mode - use mock functionality if no API URL is configured
      if (!this.baseUrl) {
        console.log('Development mode: No API URL configured, using mock hosts data');
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get hosts from localStorage
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        
        // Apply filters
        let filteredHosts = hosts;
        if (filters?.verified !== undefined) {
          filteredHosts = hosts.filter((host: any) => host.verified === filters.verified);
        }
        if (filters?.limit) {
          filteredHosts = filteredHosts.slice(0, filters.limit);
        }
        
        return {
          success: true,
          data: { hosts: filteredHosts },
          message: 'Hosts retrieved successfully'
        };
      }
      
      const queryParams = new URLSearchParams();
      if (filters?.verified !== undefined) queryParams.append('verified', String(filters.verified));
      if (filters?.limit) queryParams.append('limit', String(filters.limit));
      
      if (!this.baseUrl) throw new Error('API URL not configured.');
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters?.lastKey) queryParams.append('lastEvaluatedKey', filters.lastKey);
      const url = `${this.baseUrl}/admin/users?${queryParams.toString()}`;
      console.log('[api] GET /admin/users', { url, baseUrl: this.baseUrl });
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch hosts');
      }

      const result = await response.json();
      const payload = (result && result.data) ? result.data : result;
      
      return {
        success: true,
        data: { hosts: payload.hosts || [], lastEvaluatedKey: payload.lastEvaluatedKey || null },
        message: 'Hosts retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to fetch hosts:', error);
      return {
        success: false,
        data: { hosts: [] },
        message: error instanceof Error ? error.message : 'Failed to fetch hosts'
      };
    }
  }

  async updateHostStatus(hostId: string, status: 'approved' | 'rejected' | 'pending'): Promise<ApiResponse<any>> {
    try {
      // Development mode - use mock functionality if no API URL is configured
      if (!this.baseUrl) {
        console.log('Development mode: No API URL configured, using mock host status update');
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get hosts from localStorage
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const hostIndex = hosts.findIndex((host: any) => host.id === hostId);
        
        if (hostIndex === -1) {
          throw new Error('Host not found');
        }
        
        // Update host status
        hosts[hostIndex].status = status;
        hosts[hostIndex].verified = status === 'approved';
        hosts[hostIndex].verifiedAt = status === 'approved' ? new Date().toISOString() : null;
        
        // Save back to localStorage
        localStorage.setItem('ifad_mock_hosts', JSON.stringify(hosts));
        
        return {
          success: true,
          data: hosts[hostIndex],
          message: `Host ${status} successfully`
        };
      }
      
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/admin/users/${hostId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, verified: status === 'approved' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update host status');
      }

      const result = await response.json();
      const payload = (result && result.data) ? result.data : result;
      
      return {
        success: true,
        data: payload.user,
        message: 'Host status updated successfully'
      };
    } catch (error) {
      console.error('Failed to update host status:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to update host status'
      };
    }
  }

  async deleteHost(hostId: string): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/admin/users/${hostId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete host');
      }

      return {
        success: true,
        data: null,
        message: 'Host deleted successfully'
      };
    } catch (error) {
      console.error('Failed to delete host:', error);
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to delete host'
      };
    }
  }

  async updateHost(hostId: string, updates: Record<string, any>): Promise<ApiResponse<any>> {
    try {
      if (!this.baseUrl) {
        // Dev mode: update in localStorage
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const index = hosts.findIndex((h: any) => h.id === hostId);
        if (index === -1) throw new Error('Host not found');
        hosts[index] = { ...hosts[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem('ifad_mock_hosts', JSON.stringify(hosts));
        return { success: true, data: hosts[index], message: 'Host updated (dev mode)' };
      }

      const response = await fetch(`${this.baseUrl}/admin/users/${hostId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update host');
      }
      const payload = (result && result.data) ? result.data : result;
      return { success: true, data: payload.user || payload, message: 'Host updated successfully' };
    } catch (error) {
      console.error('Failed to update host:', error);
      return { success: false, data: null, message: error instanceof Error ? error.message : 'Failed to update host' };
    }
  }

  async getAdminApplications(filters?: { semester?: string; status?: string; limit?: number; lastKey?: string }): Promise<ApiResponse<{ applications: any[]; lastEvaluatedKey?: string | null }>> {
    try {
      if (!this.baseUrl) {
        // Dev mode: return empty list; UI can show samples or none
        return { success: true, data: { applications: [] }, message: 'Applications (dev mode empty)' };
      }

      const queryParams = new URLSearchParams();
      if (filters?.semester) queryParams.append('semester', filters.semester);
      if (filters?.status && filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters?.limit) queryParams.append('limit', String(filters.limit));
      if (filters?.lastKey) queryParams.append('lastEvaluatedKey', filters.lastKey);
      const url = `${this.baseUrl}/admin/applications?${queryParams.toString()}`;
      console.log('[api] GET /admin/applications', { url });
      const response = await fetch(url, { method: 'GET', headers: this.getAuthHeaders() });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch applications');
      const payload = (result && result.data) ? result.data : result;
      return { success: true, data: { applications: payload.applications || payload.items || [], lastEvaluatedKey: payload.lastEvaluatedKey || null }, message: 'Applications retrieved' };
    } catch (error) {
      console.error('Failed to fetch admin applications:', error);
      return { success: false, data: { applications: [] }, message: error instanceof Error ? error.message : 'Failed to fetch applications' };
    }
  }

  async getApplications(): Promise<ApiResponse<{ applications: any[] }>> {
    try {
      if (!this.baseUrl) {
        return { success: true, data: { applications: [] }, message: 'Applications (dev mode empty)' };
      }
      const response = await fetch(`${this.baseUrl}/applications`, { method: 'GET', headers: this.getAuthHeaders() });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to fetch applications');
      const payload = (result && result.data) ? result.data : result;
      return { success: true, data: { applications: payload.applications || payload.items || [] }, message: 'Applications retrieved' };
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      return { success: false, data: { applications: [] }, message: error instanceof Error ? error.message : 'Failed to fetch applications' };
    }
  }
  async getAdminStats(): Promise<ApiResponse<any>> {
    try {
      // Development mode - use mock functionality if no API URL is configured
      if (!this.baseUrl) {
        console.log('Development mode: No API URL configured, using mock admin stats');
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get hosts from localStorage to generate realistic stats
        const hosts = JSON.parse(localStorage.getItem('ifad_mock_hosts') || '[]');
        const verifiedHosts = hosts.filter((host: any) => host.verified);
        const pendingHosts = hosts.filter((host: any) => !host.verified);
        
        const mockStats = {
          totalHosts: hosts.length,
          verifiedHosts: verifiedHosts.length,
          pendingHosts: pendingHosts.length,
          totalStudents: 45,
          completedOrientations: 32,
          submittedApplications: 28,
          totalMatches: 18,
          completedExperiences: 12,
          lastUpdated: new Date().toISOString()
        };
        
        return {
          success: true,
          data: mockStats,
          message: 'Admin stats retrieved successfully'
        };
      }
      
      if (!this.baseUrl) throw new Error('API URL not configured.');
      const response = await fetch(`${this.baseUrl}/admin/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const result = await response.json();
      const payload = (result && result.data) ? result.data : result;
      
      return {
        success: true,
        data: payload,
        message: 'Admin stats retrieved successfully'
      };
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      return {
        success: false,
        data: {
          totalHosts: 0,
          pendingHosts: 0,
          approvedHosts: 0,
          totalStudents: 0,
          totalApplications: 0
        },
        message: error instanceof Error ? error.message : 'Failed to fetch admin stats'
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;