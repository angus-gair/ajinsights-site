import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MCPDashboard } from '../../components/mcp/mcp-dashboard';
import { MCPTestHelper } from '../test-utils/mcp-test-helper';

describe('MCPDashboard Component', () => {
  const mockUserId = 'test-user-123';
  let testHelper: MCPTestHelper;

  beforeAll(() => {
    testHelper = MCPTestHelper.getInstance();
  });

  beforeEach(async () => {
    // Reset the test environment before each test
    await testHelper.resetTestEnvironment();
    
    // Mock the fetch API
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes('/api/mcp/skills')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            skills: [
              { id: '1', name: 'React', relevance: 0.95 },
              { id: '2', name: 'TypeScript', relevance: 0.9 },
              { id: '3', name: 'Node.js', relevance: 0.85 },
            ]
          })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with default tab', async () => {
    render(<MCPDashboard userId={mockUserId} />);
    
    // Check if the default tab is active
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Skills Recommendation');
    
    // Check if the loading state is shown initially
    expect(screen.getByText(/analyzing job description/i)).toBeInTheDocument();
    
    // Wait for skills to load
    const skillItems = await screen.findAllByRole('listitem');
    expect(skillItems.length).toBeGreaterThan(0);
  });

  it('switches between tabs correctly', async () => {
    render(<MCPDashboard userId={mockUserId} />);
    
    // Click on the Technical Context tab
    const technicalTab = screen.getByRole('tab', { name: /technical context/i });
    fireEvent.click(technicalTab);
    
    // Check if the Technical Context tab is now active
    expect(technicalTab).toHaveAttribute('aria-selected', 'true');
    
    // Check if the content for Technical Context is displayed
    expect(screen.getByText(/technical enhancements/i)).toBeInTheDocument();
    
    // Click on the User Preferences tab
    const prefsTab = screen.getByRole('tab', { name: /user preferences/i });
    fireEvent.click(prefsTab);
    
    // Check if the User Preferences tab is now active
    expect(prefsTab).toHaveAttribute('aria-selected', 'true');
    
    // Check if the content for User Preferences is displayed
    expect(screen.getByText(/preferences/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock a failed API call
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('API Error'));
    
    render(<MCPDashboard userId={mockUserId} />);
    
    // Check if error message is displayed
    const errorMessage = await screen.findByText(/error loading skills/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('applies skills to resume', async () => {
    const mockOnApplySkills = jest.fn();
    
    render(
      <MCPDashboard 
        userId={mockUserId} 
        onApplySkills={mockOnApplySkills} 
      />
    );
    
    // Wait for skills to load
    const skillItems = await screen.findAllByRole('listitem');
    
    // Click the apply button
    const applyButton = screen.getByRole('button', { name: /apply selected skills/i });
    fireEvent.click(applyButton);
    
    // Check if the onApplySkills callback was called
    await waitFor(() => {
      expect(mockOnApplySkills).toHaveBeenCalled();
    });
  });
});
