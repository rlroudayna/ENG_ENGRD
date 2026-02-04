#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 ENVIRONMENT CHECK');
console.log('===================\n');

// Check Node.js version
console.log('📋 Node.js version:', process.version);

// Check if required files exist
const requiredFiles = [
  'backend/package.json',
  'backend/.env',
  'backend/server.js',
  'eng-rd-clean/package.json',
  'eng-rd-clean/src/App.js'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check backend dependencies
if (fs.existsSync('backend/package.json')) {
  const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'jsonwebtoken', 'dotenv'];
  
  console.log('\n📋 Backend dependencies:');
  requiredDeps.forEach(dep => {
    if (backendPkg.dependencies && backendPkg.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
}

// Check frontend dependencies
if (fs.existsSync('eng-rd-clean/package.json')) {
  const frontendPkg = JSON.parse(fs.readFileSync('eng-rd-clean/package.json', 'utf8'));
  const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'axios'];
  
  console.log('\n📋 Frontend dependencies:');
  requiredDeps.forEach(dep => {
    if (frontendPkg.dependencies && frontendPkg.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - MISSING`);
      allFilesExist = false;
    }
  });
}

if (allFilesExist) {
  console.log('\n🎉 Environment check passed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: node start-project.js');
  console.log('2. Wait for both servers to start');
  console.log('3. Open http://localhost:3000');
} else {
  console.log('\n❌ Environment check failed!');
  console.log('\n📋 Fix the missing files/dependencies first:');
  console.log('- cd backend && npm install');
  console.log('- cd eng-rd-clean && npm install');
}
