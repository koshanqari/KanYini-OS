#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const port = process.env.PORT || 3000;

console.log('\n🚀 Starting Next.js dev server...\n');

// Start Next.js with the specific hostname
const nextProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port], {
  stdio: 'pipe',
  shell: true
});

let serverStarted = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  
  // Intercept and modify the output to show actual IP
  if (output.includes('- Network:') && !serverStarted) {
    serverStarted = true;
    // Don't print the original output
    console.log(`  ▲ Next.js ${output.match(/Next\.js ([\d.]+)/)?.[1] || ''}`);
    console.log(`  - Local:        http://localhost:${port}`);
    console.log(`  - Network:      http://${localIP}:${port}`);
    console.log('');
  } else if (output.includes('Ready in') || output.includes('Compiled') || output.includes('Starting...')) {
    process.stdout.write(output);
  } else if (!output.includes('▲ Next.js') && !output.includes('- Local:') && !output.includes('- Network:')) {
    process.stdout.write(output);
  }
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

nextProcess.on('close', (code) => {
  process.exit(code);
});

// Handle termination
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
  process.exit(0);
});

