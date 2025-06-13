const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Load MCP configuration
const configPath = path.join(__dirname, '..', 'mcp-config.json');
if (!fs.existsSync(configPath)) {
  console.error('Error: mcp-config.json not found');
  process.exit(1);
}

const config = require(configPath);
const servers = config.mcpServers || {};

console.log('Starting MCP servers...');

// Store references to server processes
const processes = [];

// Start each server
Object.entries(servers).forEach(([name, server]) => {
  if (server.disabled) {
    console.log(`Skipping disabled server: ${name}`);
    return;
  }

  console.log(`Starting ${name}...`);
  
  // Set environment variables
  const env = {
    ...process.env,
    ...server.env,
    PORT: server.port || process.env.PORT || 3001,
  };

  // Start the server
  const proc = spawn(server.command, server.args, {
    env,
    stdio: 'inherit',
    shell: true,
  });

  processes.push(proc);
  
  proc.on('error', (error) => {
    console.error(`Failed to start ${name}:`, error);
  });

  console.log(`Started ${name} (PID: ${proc.pid})`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down MCP servers...');
  processes.forEach(proc => {
    if (!proc.killed) {
      proc.kill('SIGTERM');
    }
  });
  process.exit(0);
});

console.log('MCP servers started. Press Ctrl+C to stop.');
