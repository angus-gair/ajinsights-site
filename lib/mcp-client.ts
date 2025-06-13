/**
 * MCPClient - A client for interacting with the Model Context Protocol (MCP) services
 */

export interface Skill {
  name: string;
  relevance: number;
  category?: string;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description?: string;
  enhanced?: boolean;
}

export interface ResumeData {
  skills: string[];
  experience: Experience[];
  education?: any[];
  certifications?: string[];
  [key: string]: any;
}

export interface Enhancements {
  skills?: string[];
  experience?: any[];
  [key: string]: any;
}

/**
 * MCPClient provides methods to interact with MCP services
 */
export class MCPClient {
  private apiBaseUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.apiBaseUrl = process.env.MCP_API_URL || 'http://localhost:3000/api/mcp';
    this.apiKey = process.env.MCP_API_KEY;
  }

  /**
   * Set the API base URL
   */
  public setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }

  /**
   * Set the API key
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Make an authenticated request to the MCP API
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error('MCP API request failed:', error);
      throw error;
    }
  }

  /**
   * Analyze a job description and extract relevant skills
   */
  public async analyzeJobDescription(
    jobDescription: string,
    userId?: string
  ): Promise<{ skills: Skill[] }> {
    return this.makeRequest<{ skills: Skill[] }>('/analyze', {
      method: 'POST',
      body: JSON.stringify({ jobDescription, userId }),
    });
  }

  /**
   * Enhance a resume with additional data from MCP
   */
  public async enhanceResume(
    resumeData: ResumeData,
    enhancements: Enhancements = {},
    userId?: string
  ): Promise<{ enhancedResume: ResumeData }> {
    return this.makeRequest<{ enhancedResume: ResumeData }>('/enhance', {
      method: 'POST',
      body: JSON.stringify({ resumeData, enhancements, userId }),
    });
  }

  /**
   * Get recommended skills based on a user's profile
   */
  public async getRecommendedSkills(
    userId: string,
    limit: number = 10
  ): Promise<{ skills: Skill[] }> {
    return this.makeRequest<{ skills: Skill[] }>(
      `/recommendations/skills?userId=${userId}&limit=${limit}`
    );
  }

  /**
   * Get technical context for a specific technology or skill
   */
  public async getTechnicalContext(
    skill: string,
    userId?: string
  ): Promise<{ context: string; resources: string[] }> {
    return this.makeRequest<{ context: string; resources: string[] }>(
      '/technical-context',
      {
        method: 'POST',
        body: JSON.stringify({ skill, userId }),
      }
    );
  }

  /**
   * Check the health of the MCP service
   */
  public async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health');
  }
}

export default MCPClient;
