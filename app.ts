import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MCPClient } from './lib/mcp-client';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MCP client
const mcpClient = new MCPClient();

/**
 * Health check endpoint
 */
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Analyze job description and extract skills
 */
app.post('/api/mcp/analyze', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { jobDescription, userId } = req.body;
    
    if (!jobDescription) {
      return res.status(400).json({ error: 'jobDescription is required' });
    }
    
    const result = await mcpClient.analyzeJobDescription(jobDescription, userId);
    
    // Sort skills by relevance (descending)
    const sortedSkills = result.skills.sort((a, b) => b.relevance - a.relevance);
    
    res.status(200).json({ skills: sortedSkills });
  } catch (error) {
    next(error);
  }
});

/**
 * Enhance resume with MCP data
 */
app.post('/api/mcp/enhance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resumeData, enhancements, userId } = req.body;
    
    if (!resumeData) {
      return res.status(400).json({ error: 'resumeData is required' });
    }
    
    const result = await mcpClient.enhanceResume(resumeData, enhancements, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

export { app };
