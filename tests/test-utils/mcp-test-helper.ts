import { MCPClient } from '@modelcontextprotocol/mcp-client';

/**
 * Helper class for testing MCP integration
 */
export class MCPTestHelper {
  private client: MCPClient;
  private static instance: MCPTestHelper;

  private constructor() {
    this.client = new MCPClient({
      // Default configuration - can be overridden in test setup
      baseUrl: 'http://localhost:3000/api/mcp',
      timeout: 10000,
    });
  }

  /**
   * Get the singleton instance of MCPTestHelper
   */
  public static getInstance(): MCPTestHelper {
    if (!MCPTestHelper.instance) {
      MCPTestHelper.instance = new MCPTestHelper();
    }
    return MCPTestHelper.instance;
  }

  /**
   * Get the MCP client instance
   */
  public getClient(): MCPClient {
    return this.client;
  }

  /**
   * Reset the MCP test environment
   */
  public async resetTestEnvironment(): Promise<void> {
    try {
      // Clear any test data
      await this.client.post('/reset-test-environment');
    } catch (error) {
      console.warn('Failed to reset test environment:', error);
    }
  }

  /**
   * Wait for MCP servers to be ready
   * @param timeoutMs Maximum time to wait in milliseconds
   */
  public async waitForServers(timeoutMs = 30000): Promise<boolean> {
    const startTime = Date.now();
    const checkInterval = 1000; // Check every second
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await this.client.get('/health');
        if (response.status === 'ok') {
          return true;
        }
      } catch (error) {
        // Ignore errors and retry
      }
      
      // Wait before next check
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    throw new Error(`MCP servers not ready after ${timeoutMs}ms`);
  }
}

// Global test setup and teardown
beforeAll(async () => {
  const helper = MCPTestHelper.getInstance();
  await helper.waitForServers();
  await helper.resetTestEnvironment();
});

afterAll(async () => {
  const helper = MCPTestHelper.getInstance();
  await helper.resetTestEnvironment();
});

export default MCPTestHelper.getInstance();
