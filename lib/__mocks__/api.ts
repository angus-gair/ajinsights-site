// Mock API responses for testing
export const mcpApi = {
  // Mock getSkills function
  getSkills: jest.fn().mockResolvedValue({
    data: [
      { id: '1', name: 'React', relevance: 0.9 },
      { id: '2', name: 'TypeScript', relevance: 0.85 },
      { id: '3', name: 'Node.js', relevance: 0.8 },
    ],
  }),

  // Mock analyzeJobDescription function
  analyzeJobDescription: jest.fn().mockResolvedValue({
    data: {
      skills: [
        { id: '4', name: 'Next.js', relevance: 0.88 },
        { id: '5', name: 'GraphQL', relevance: 0.82 },
      ],
    },
  }),

  // Mock applySkills function
  applySkills: jest.fn().mockResolvedValue({
    success: true,
    message: 'Skills applied successfully',
  }),

  // Mock getUserPreferences function
  getUserPreferences: jest.fn().mockResolvedValue({
    data: {
      preferredSkills: ['React', 'TypeScript'],
      experienceLevel: 'mid',
      jobTitles: ['Frontend Developer', 'Full Stack Developer'],
    },
  }),

  // Mock updateUserPreferences function
  updateUserPreferences: jest.fn().mockResolvedValue({
    success: true,
    message: 'Preferences updated successfully',
  }),

  // Mock health check function
  healthCheck: jest.fn().mockResolvedValue({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }),
};

// Mock the entire API module
export const api = {
  mcpApi,
};

export default api;
