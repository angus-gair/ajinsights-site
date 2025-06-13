import request from 'supertest';
import { app } from '../../app';
import { MCPTestHelper } from '../test-utils/mcp-test-helper';

// Mock the MCP client
jest.mock('@/lib/mcp-client', () => ({
  MCPClient: jest.fn().mockImplementation(() => ({
    analyzeJobDescription: jest.fn().mockResolvedValue({
      skills: [
        { name: 'React', relevance: 0.9 },
        { name: 'TypeScript', relevance: 0.85 },
        { name: 'Node.js', relevance: 0.8 },
      ],
    }),
    enhanceResume: jest.fn().mockResolvedValue({
      enhancedResume: {
        skills: ['JavaScript', 'React', 'TypeScript', 'Redux'],
        experience: [
          { 
            title: 'Frontend Developer', 
            company: 'Tech Corp', 
            duration: '2 years',
            enhanced: true
          }
        ]
      }
    }),
  })),
}));

describe('MCP API Endpoints', () => {
  let testHelper: MCPTestHelper;
  
  beforeAll(() => {
    testHelper = MCPTestHelper.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/mcp/analyze', () => {
    it('should analyze job description and return skills', async () => {
      const jobDescription = 'We are looking for a Senior React Developer with TypeScript experience.';
      
      const response = await request(app)
        .post('/api/mcp/analyze')
        .send({ jobDescription, userId: 'test-user-123' })
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('skills');
      expect(Array.isArray(response.body.skills)).toBe(true);
      expect(response.body.skills.length).toBeGreaterThan(0);
      expect(response.body.skills[0]).toHaveProperty('name');
      expect(response.body.skills[0]).toHaveProperty('relevance');
      
      // Check if the skills are sorted by relevance (descending)
      const relevances = response.body.skills.map((s: any) => s.relevance);
      const sortedRelevances = [...relevances].sort((a, b) => b - a);
      expect(relevances).toEqual(sortedRelevances);
    });

    it('should return 400 for missing job description', async () => {
      const response = await request(app)
        .post('/api/mcp/analyze')
        .send({ userId: 'test-user-123' })
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('jobDescription');
    });

    it('should handle errors during analysis', async () => {
      // Mock a failed analysis
      const errorMessage = 'Failed to analyze job description';
      jest.spyOn(require('@/lib/mcp-client'), 'MCPClient').mockImplementationOnce(() => ({
        analyzeJobDescription: jest.fn().mockRejectedValue(new Error(errorMessage)),
      }));
      
      const response = await request(app)
        .post('/api/mcp/analyze')
        .send({ jobDescription: 'Test job description', userId: 'test-user-123' })
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain(errorMessage);
    });
  });

  describe('POST /api/mcp/enhance', () => {
    it('should enhance resume with MCP data', async () => {
      const resumeData = {
        skills: ['JavaScript', 'React'],
        experience: [
          { title: 'Frontend Developer', company: 'Tech Corp', duration: '2 years' }
        ]
      };
      
      const enhancements = {
        skills: ['TypeScript', 'Redux'],
        suggestions: ['Add more details about your React experience']
      };
      
      const response = await request(app)
        .post('/api/mcp/enhance')
        .send({ 
          resumeData, 
          enhancements,
          userId: 'test-user-123' 
        })
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('enhancedResume');
      expect(response.body.enhancedResume).toHaveProperty('skills');
      expect(Array.isArray(response.body.enhancedResume.skills)).toBe(true);
      expect(response.body.enhancedResume.skills).toContain('TypeScript');
      expect(response.body.enhancedResume.skills).toContain('Redux');
    });
  });

  describe('GET /api/mcp/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/mcp/health')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.status).toBe('ok');
    });
  });
});
