// UMD CAS Authentication Service

interface CASConfig {
  baseUrl: string;
  loginPath: string;
  logoutPath: string;
  validatePath: string;
  serviceUrl: string;
}

class CASService {
  private config: CASConfig;

  constructor() {
    this.config = {
      baseUrl: 'https://shib.idm.umd.edu/shibboleth-idp/profile/cas',
      loginPath: '/login',
      logoutPath: '/logout',
      validatePath: '/serviceValidate',
      serviceUrl: `${window.location.origin}/auth/cas/callback`,
    };
  }

  /**
   * Get the CAS login URL
   */
  getLoginUrl(): string {
    const params = new URLSearchParams({
      service: this.config.serviceUrl,
    });
    
    return `${this.config.baseUrl}${this.config.loginPath}?${params.toString()}`;
  }

  /**
   * Get the CAS logout URL
   */
  getLogoutUrl(returnUrl?: string): string {
    const params = new URLSearchParams();
    
    if (returnUrl) {
      params.set('service', returnUrl);
    }
    
    return `${this.config.baseUrl}${this.config.logoutPath}?${params.toString()}`;
  }

  /**
   * Validate a CAS ticket
   */
  async validateTicket(ticket: string, service?: string): Promise<CASValidationResponse> {
    const params = new URLSearchParams({
      ticket,
      service: service || this.config.serviceUrl,
    });

    const validateUrl = `${this.config.baseUrl}${this.config.validatePath}?${params.toString()}`;
    
    try {
      const response = await fetch(validateUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/xml, text/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`CAS validation failed: ${response.statusText}`);
      }

      const xmlText = await response.text();
      return this.parseValidationResponse(xmlText);
    } catch (error) {
      console.error('CAS ticket validation error:', error);
      throw new Error('Failed to validate CAS ticket');
    }
  }

  /**
   * Parse CAS validation XML response
   */
  private parseValidationResponse(xmlText: string): CASValidationResponse {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for authentication success
    const successElement = xmlDoc.querySelector('cas\\:authenticationSuccess, authenticationSuccess');
    
    if (successElement) {
      const userElement = successElement.querySelector('cas\\:user, user');
      const attributesElement = successElement.querySelector('cas\\:attributes, attributes');
      
      const username = userElement?.textContent?.trim() || '';
      const attributes: Record<string, string> = {};

      // Parse attributes if present
      if (attributesElement) {
        const attributeElements = attributesElement.children;
        for (let i = 0; i < attributeElements.length; i++) {
          const attr = attributeElements[i];
          const key = attr.tagName.replace('cas:', '');
          attributes[key] = attr.textContent?.trim() || '';
        }
      }

      return {
        success: true,
        username,
        attributes,
      };
    }

    // Check for authentication failure
    const failureElement = xmlDoc.querySelector('cas\\:authenticationFailure, authenticationFailure');
    if (failureElement) {
      const code = failureElement.getAttribute('code') || 'UNKNOWN_ERROR';
      const message = failureElement.textContent?.trim() || 'Authentication failed';
      
      return {
        success: false,
        error: {
          code,
          message,
        },
      };
    }

    // If neither success nor failure, something went wrong
    return {
      success: false,
      error: {
        code: 'INVALID_RESPONSE',
        message: 'Invalid CAS response format',
      },
    };
  }

  /**
   * Redirect to CAS login
   */
  redirectToLogin(): void {
    window.location.href = this.getLoginUrl();
  }

  /**
   * Redirect to CAS logout
   */
  redirectToLogout(returnUrl?: string): void {
    window.location.href = this.getLogoutUrl(returnUrl);
  }

  /**
   * Check if current URL contains a CAS ticket
   */
  hasTicketInUrl(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('ticket');
  }

  /**
   * Extract CAS ticket from current URL
   */
  getTicketFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ticket');
  }

  /**
   * Remove ticket parameter from URL without page reload
   */
  cleanUrlFromTicket(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete('ticket');
    window.history.replaceState({}, document.title, url.toString());
  }
}

export interface CASValidationResponse {
  success: boolean;
  username?: string;
  attributes?: Record<string, string>;
  error?: {
    code: string;
    message: string;
  };
}

export interface CASUser {
  username: string;
  directoryId: string;
  attributes: Record<string, string>;
}

export const casService = new CASService();
export default CASService;