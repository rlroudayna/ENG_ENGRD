#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 ENG RND PROJECT STARTUP SCRIPT');
console.log('==================================\n');

// Check if backend directory exists
if (!fs.existsSync('backend')) {
  console.log('❌ Backend directory not found!');
  process.exit(1);
}

// Check if frontend directory exists
if (!fs.existsSync('eng-rd-clean')) {
  console.log('❌ Frontend directory not found!');
  process.exit(1);
}

console.log('📋 Starting backend...');

// Start backend
const backend = spawn('npm', ['start'], {
  cwd: 'backend',
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.log(`❌ Backend error: ${error.message}`);
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('\n📋 Starting frontend...');
  
  const frontend = spawn('npm', ['start'], {
    cwd: 'eng-rd-clean',
    stdio: 'inherit',
    shell: true
  });
  
  frontend.on('error', (error) => {
    console.log(`❌ Frontend error: ${error.message}`);
  });
}, 3000);

console.log('\n✅ Both servers are starting...');
console.log('📍 Frontend: http://localhost:3000');
console.log('📍 Backend: http://localhost:5000');
console.log('📍 Admin: http://localhost:3000/admin/login');
