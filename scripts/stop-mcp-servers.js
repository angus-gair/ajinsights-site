const { exec } = require('child_process');
const os = require('os');

console.log('Stopping all MCP servers...');

// Command to find and kill MCP server processes
const isWindows = os.platform() === 'win32';
let command;

if (isWindows) {
  // Windows command to find and kill Node.js processes running MCP servers
  command = `taskkill /F /IM node.exe /FI "WINDOWTITLE eq MCP-*"`;
} else {
  // Unix/Linux/Mac command
  command = 'pkill -f "node.*mcp"';
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    if (error.code === 1) {
      console.log('No MCP server processes found.');
    } else {
      console.error(`Error stopping MCP servers: ${error.message}`);
      process.exit(1);
    }
  }
  
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
  
  console.log('All MCP servers have been stopped.');
});
