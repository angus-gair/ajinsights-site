import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SkillsRecommendation } from '../../components/mcp/skills-recommendation';

describe('SkillsRecommendation Component', () => {
  const mockSkills = [
    { id: '1', name: 'React', relevance: 0.95 },
    { id: '2', name: 'TypeScript', relevance: 0.9 },
    { id: '3', name: 'Node.js', relevance: 0.85 },
  ];

  it('renders loading state initially', () => {
    render(<SkillsRecommendation jobDescription="" userId="test-user" />);
    expect(screen.getByText(/analyzing job description/i)).toBeInTheDocument();
  });

  it('displays skills when loaded', async () => {
    // Mock the API call
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ skills: mockSkills }),
    });

    render(<SkillsRecommendation jobDescription="Senior Frontend Developer" userId="test-user" />);
    
    // Wait for skills to load
    const skillItems = await screen.findAllByRole('listitem');
    expect(skillItems).toHaveLength(mockSkills.length);
    
    // Check if skill names are displayed
    mockSkills.forEach(skill => {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    // Mock a failed API call
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));
    
    render(<SkillsRecommendation jobDescription="Senior Frontend Developer" userId="test-user" />);
    
    // Check if error message is displayed
    const errorMessage = await screen.findByText(/error loading skills/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
