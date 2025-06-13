import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/tests/test-utils/test-utils';
import { MCPDashboard } from './MCPDashboard';

// Mock the API calls
jest.mock('@/lib/api', () => ({
  mcpApi: {
    getSkills: jest.fn().mockResolvedValue({
      data: [
        { id: '1', name: 'React', relevance: 0.9 },
        { id: '2', name: 'TypeScript', relevance: 0.85 },
        { id: '3', name: 'Node.js', relevance: 0.8 },
      ],
    }),
    analyzeJobDescription: jest.fn().mockResolvedValue({
      data: {
        skills: [
          { id: '4', name: 'Next.js', relevance: 0.88 },
          { id: '5', name: 'GraphQL', relevance: 0.82 },
        ],
      },
    }),
  },
}));

describe('MCPDashboard', () => {
  it('renders the dashboard with tabs', async () => {
    render(<MCPDashboard />);
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: /skills recommendation/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /technical context/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /user preferences/i })).toBeInTheDocument();
    
    // Check if the first tab is active by default
    expect(screen.getByRole('tab', { name: /skills recommendation/i })).toHaveAttribute('aria-selected', 'true');
    
    // Check if the content for the first tab is visible
    await waitFor(() => {
      expect(screen.getByText(/trending skills/i)).toBeInTheDocument();
    });
  });

  it('loads and displays skills', async () => {
    render(<MCPDashboard />);
    
    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });

  it('allows switching between tabs', async () => {
    render(<MCPDashboard />);
    
    // Click on the Technical Context tab
    fireEvent.click(screen.getByRole('tab', { name: /technical context/i }));
    
    // Check if the Technical Context tab is now active
    expect(screen.getByRole('tab', { name: /technical context/i })).toHaveAttribute('aria-selected', 'true');
    
    // Check if the content for the Technical Context tab is visible
    expect(screen.getByText(/job description analyzer/i)).toBeInTheDocument();
    
    // Click on the User Preferences tab
    fireEvent.click(screen.getByRole('tab', { name: /user preferences/i }));
    
    // Check if the User Preferences tab is now active
    expect(screen.getByRole('tab', { name: /user preferences/i })).toHaveAttribute('aria-selected', 'true');
    
    // Check if the content for the User Preferences tab is visible
    expect(screen.getByText(/your preferences/i)).toBeInTheDocument();
  });

  it('allows analyzing a job description', async () => {
    render(<MCPDashboard />);
    
    // Switch to the Technical Context tab
    fireEvent.click(screen.getByRole('tab', { name: /technical context/i }));
    
    // Enter a job description
    const textarea = screen.getByPlaceholderText(/paste the job description here/i);
    fireEvent.change(textarea, { target: { value: 'We are looking for a React developer with Next.js experience.' } });
    
    // Click the analyze button
    fireEvent.click(screen.getByRole('button', { name: /analyze/i }));
    
    // Check if loading state is shown
    expect(screen.getByRole('button', { name: /analyzing.../i })).toBeDisabled();
    
    // Wait for the analysis to complete
    await waitFor(() => {
      expect(screen.getByText(/analysis results/i)).toBeInTheDocument();
      expect(screen.getByText('Next.js')).toBeInTheDocument();
      expect(screen.getByText('GraphQL')).toBeInTheDocument();
    });
  });

  it('handles errors when loading skills', async () => {
    // Mock a failed API call
    const mockError = new Error('Failed to load skills');
    require('@/lib/api').mcpApi.getSkills.mockRejectedValueOnce(mockError);
    
    render(<MCPDashboard />);
    
    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to load skills/i)).toBeInTheDocument();
    });
    
    // Check if retry button is shown
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('allows selecting and applying skills', async () => {
    render(<MCPDashboard />);
    
    // Wait for skills to load
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
    });
    
    // Select a skill
    const reactCheckbox = screen.getByLabelText('React');
    fireEvent.click(reactCheckbox);
    
    // Check if the skill is selected
    expect(reactCheckbox).toBeChecked();
    
    // Click the apply button
    const applyButton = screen.getByRole('button', { name: /apply selected skills/i });
    fireEvent.click(applyButton);
    
    // Check if the success message is shown
    await waitFor(() => {
      expect(screen.getByText(/skills applied successfully/i)).toBeInTheDocument();
    });
  });
});
