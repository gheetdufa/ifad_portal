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

class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL || '';

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
      // Mock API response
      return {
        success: true,
        data: { id: Date.now().toString(), ...hostData },
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
      // Mock API response
      return {
        success: true,
        data: { id: Date.now().toString(), ...studentData },
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
}

export const apiService = new ApiService();
export default apiService;